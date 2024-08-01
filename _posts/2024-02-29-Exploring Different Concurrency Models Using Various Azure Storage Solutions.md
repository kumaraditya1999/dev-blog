---
title: Exploring Different Concurrency Models Using Various Azure Storage Solutions
date: 2024-03-05 10:10:10 +0530
categories: [Software Engineering, Distributed System]
tags: [sql, azure, cosmosdb, distributed-system]
math: true
mermaid: true
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>
<script>{% include_relative assets/scripts/newsletter.js %}</script>

We are in the era of `cloud` boom (transitioning to AI boom but okay), where storage solutions are seamlessly offered as services through prominent cloud providers like `Azure`, `GCP`, and `AWS`. The accessibility provided by these platforms has transformed database usage into a straightforward endeavor. With infrastructure maintenance going out the window, understanding the tradeoffs and the behaviour of databases plays a key role while developing any distributed solution. 

This post aims to guide you in designing a system that allows for the analysis of databases based on their concurrency handling capabilities. Recognizing that there's no universal key for all locks, comprehending the associated trade-offs is crucial. We'll delve into a specific use case, examining some of the most popular databases and their suitability within the given problem space.

## Generating Serial Numbers

Let's establish the problem at hand. We aim to construct a serial number generator capped at $$N$$, resetting daily and starting the numbering afresh from $$0$$ to $$N$$. In simpler terms, the serial number service we're developing should adhere to the following constraints:

```yaml
1. On demand, the serial number service should return a unique serial number, no repetation.
2. The serial numbers should start from 0 and cease at N.
3. The serial numbers are unique within a day, but not accross days. If the day changes, the service should start generating the serial number from 0.
```

## The Naive Approach

One way to do so is to have a service, which has an in-memory storage like an integer counter and just keep generating the numbers again and again. Sounds simple, but do you see the problem here ?

The above approach has two major problems:
1. `In-memory counter`: If the service fails and restarts within the day, the counter resets, causing the service to return serial numbers starting from 0—undesirable behavior.
2. `Scaling issues`: Creating two instances results in different in-memory variables, causing each to return serial numbers between 0 to N instead of sharing the load.

So clearly in-memory is out of option, so we have established that we need a persistent storage. This persistant storage will be accessed by multiple instances of the serial number service. Now for the choice of databases, lets look at `CosmosDB`, `Blob Storage` and `SQL` and understand how these Azure Storage Solutions can be used to generate the serial number.

## Azure Cosmos DB

Azure Cosmos DB is a document DB solution. Lets define the structure of the Document:

```json
{
    "id": "date",
    "serialNumberGenerated": 0,
    "_etag": "GUID"
}
```

We assign the `id` of the document to the date of the request, that way we will have one document per day. Now the flow for serial number generation would be like:

![Azure Cosmos DB Serial Number Generation](/assets/images/serial-number-generation/cosmosdb.png)

Cosmos DB employs `Optimistic Concurrency`, which assumes a predominantly concurrent system. The system proceeds to attempt the document update with the expectation that conflicts will be infrequent. The `_etag` gets modified whenever the document is modified so it can be used to check if someone else requested and generated the serial number before we try to update the document. If the document updation succeeds then there is no concurrency issue but if the document updation fails then we need to retry since someone else already used it.

```csharp
public class CosmosDbSerialNumberGenerator
{
    private const string _endpointUri = "Your_Cosmos_DB_Endpoint_URI";
    private const string _primaryKey = "Your_Cosmos_DB_Primary_Key";
    private const string _databaseId = "Your_Database_Id";
    private const string _containerId = "Your_Container_Id";
    private readonly int _limit;

    private readonly CosmosClient cosmosClient;
    private readonly Container container;

    public CosmosDbSerialNumberGenerator(int n)
    {
        this._limit = n;
        this.cosmosClient = new CosmosClient(_endpointUri, _primaryKey);
        this.container = cosmosClient.GetContainer(_databaseId, _containerId);
    }

    public async Task<int> GenerateSerialNumberAsync(DateTime dateOfRequest)
    {
        // Assume 'dateOfRequest' is the date of the request
        string documentId = $"{dateOfRequest:yyyyMMdd}";

        try
        {
            // Read the document with optimistic concurrency
            var response = await container.ReadItemAsync<DocumentType>(documentId, new PartitionKey(documentId));

            // Update the document and increment the serial number
            if (response.Resource.SerialNumberGenerated == _limit)
            {
                throw new InvalidOperationException("Serial Number Generation Reached its limit");
            }

            response.Resource.SerialNumberGenerated++;
            var updatedResponse = await container.ReplaceItemAsync(response.Resource, documentId, new PartitionKey(documentId));

            return updatedResponse.Resource.SerialNumberGenerated - 1;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.PreconditionFailed)
        {
            // Handle concurrency conflict by retrying
            return await GenerateSerialNumberAsync();
        }
        catch (Exception ex)
        {
            // Handle other exceptions
            Console.WriteLine($"Error: {ex.Message}");
            return -1;
        }
    }
}

public class DocumentType
{
    [JsonProperty("id")]
    public string Id { get; set; } = 0;

    [JsonProperty("serialNumberGenerated")]
    public int SerialNumberGenerated { get; set; }

    [JsonProperty("_etag")]
    public string Etag { get; set; }
}
```

Now, we have solved the problem, and the service we've constructed guarantees unique serial numbers while handling concurrent requests. But what about performance? Let's consider a scenario with $$N$$ concurrent requests. All instances will read the same document, and only `one` will be able to update the document and return the serial number. The others will fail, leading to $$N - 1$$ retries. In the end, there will be $$N^2$$ calls to the database, which is not very efficient.

## Azure Blob Storage:

Azure Blob is an object storage solution. Let's store an object in the blobs, containing only one field: `serialNumberGenerated`. The name of the blob would be the date, representing the date of the request. When making a request to read a blob, we aim to acquire a `lease` on the blob. Leasing is a mechanism that enables locking on the blob, ensuring that two instances cannot acquire a lease simultaneously. If the leasing operation is successful, we know that we have exclusive control over the serial number generation. Once our work is completed, we simply release the lock on the blob, allowing others to read it.

![Azure Cosmos DB Serial Number Generation](/assets/images/serial-number-generation/blobstorage.png)

Blobs use `Pessimistic Concurrency`, which enforces fail fast behaviour.

```csharp


public class BlobData
{
    [JsonProperty("serialNumberGenerated")]
    public int SerialNumberGenerated { get; set; } = 0;
}

public class BlobStorageSerialNumberGenerator
{
    private readonly BlobServiceClient blobServiceClient;
    private readonly int limit;

    public BlobStorageSerialNumberGenerator(BlobServiceClient blobServiceClient, int n)
    {
        this.limit = n;
        this.blobServiceClient = blobServiceClient;
    }

    public async Task<int> GenerateSerialNumberAsync(DateTime dateOfRequest)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobName = dateOfRequest.ToString("yyyyMMdd");

        var blobClient = containerClient.GetBlobClient(blobName);
        try
        {
            // Check if the blob exists
            var blobExists = await blobClient.ExistsAsync();
            if (!blobExists)
            {
                // Blob does not exist, create the blob
                using (var stream = new MemoryStream(Encoding.UTF8.GetBytes("")))
                {
                    await blobClient.UploadAsync(stream, true);
                }
            }

            var leaseClient = blobClient.GetBlobLeaseClient();
            var leaseId = await leaseClient.AcquireAsync(timeSpan);

            // If leasing is successful then get the data from the blob
            // Deserialize the current content to the desired type
            var currentContent = new StreamReader(blobStream).ReadToEnd();
            var currentData = JsonConvert.DeserializeObject<BlobData>(currentContent);

            // Acquire a lease on the blob (distributed lock)
            using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(newContent)))
            {
                var uploadOptions = new BlobUploadOptions
                {
                    Conditions = new BlobRequestConditions
                    {
                        LeaseId = lockInfo.leaseId
                    }
                };
                await blobClient.UploadAsync(stream, uploadOptions);
            }

            await blobLeaseClient.ReleaseAsync();
        } 
        catch (RequestFailedException ex) when (ex.Status == 412) // 412 Pre Condition Failed (Lease Already Taken)
        {
            return await GenerateSerialNumberAsync(dateOfRequest);
        } 
        catch (Exception ex)
        {
            // Handle other exceptions
            Console.WriteLine($"Error acquiring lock for blob '{lockName}': {ex.Message}");
            throw;
        }
    }
}

```

Although we've addressed the problem of redundant reads seen in Cosmos DB, in the case of $$N$$ concurrent requests, it will require resources to constantly contend for acquiring the lease. While we've improved performance, can we achieve even better efficiency ?

## SQL

Lets look at the final solution for this problem. We will use SQL Sequences for this. Its does everything we need in our problem. Looking at the sequence defination you can understand what field does what:

```sql
CREATE SEQUENCE SerialNumberSequence
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 1000;
```

To get the next number in the sequence you can use:

```sql
    SELECT NEXT VALUE FOR {sequenceName}
```

And thats all we need to know! Now we are completely relying on the DB to handle the concurrency, SQL will do the hardwork for us and we can just chill 😊.

```csharp
public class SqlSerialNumberGenerator
{
    private readonly string _connectionString;

    public SqlSerialNumberGenerator(string connectionString)
    {
        this._connectionString = connectionString;
    }

    public int GenerateSerialNumber(DateTime dateOfRequest)
    {
        var sequenceName = dateOfRequest.ToString("yyyyMMdd");
        EnsureSequenceExists(sequenceName);

        int serialNumber;

        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();

            using (var command = new SqlCommand($"SELECT NEXT VALUE FOR {sequenceName};", connection))
            {
                // ExecuteScalar is used to retrieve a single value (the next value from the sequence)
                serialNumber = Convert.ToInt32(command.ExecuteScalar());
            }
        }

        return serialNumber;
    }

    private void EnsureSequenceExists(string sequenceName)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();

            // Check if the sequence exists
            var query = $"IF NOT EXISTS (SELECT * FROM sys.sequences WHERE name = '{sequenceName}') " +
                        $"BEGIN " +
                        $"   CREATE SEQUENCE {sequenceName} " +
                        $"       START WITH 1 " +
                        $"       INCREMENT BY 1 " +
                        $"       MINVALUE 1 " +
                        $"       MAXVALUE 1000" +
                        $"END;";
            
            using (var command = new SqlCommand(query, connection))
            {
                command.ExecuteNonQuery();
            }
        }
    }
}
```

## Thanks

I hope you learnt a thing or two about concurrency!

### Resources:
1. <a href="https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/database-transactions-optimistic-concurrency" target="_blank">Optimistic Concurrency</a>
2. <a href="https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-lease" target="_blank">Leasing Blobs</a>
3. <a href="https://learn.microsoft.com/en-us/sql/t-sql/statements/create-sequence-transact-sql?view=sql-server-ver16" target="_blank">SQL Sequences</a>