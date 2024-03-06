console.log('Hello from ga-pv.js!');

var currentURL = window.location.pathname;
var url = "{{ site.backend.url }}" + "/get_page_views" + currentURL;
fetch(url)
    .then(response => {
        // Check if the request was successful (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response (if applicable)
        return response.json(); // You can use response.text() for non-JSON data
    })
    .then(data => {
        // Handle the data from the API
        console.log('API response:', data);

        // Log the URL to the console (optional)

        // Get the selected element
        var selectedElement = document.querySelector('.readtime');

        // Create a new span element
        var newElement = document.createElement('span');

        // Set the inner text of the new element
        newElement.innerHTML = '<em><i class="fas fa-eye small"></i> ' + '  ' + data.page_views + '</em> views';

        // Insert the new element before the selected element under the same parent
        selectedElement.parentNode.insertBefore(newElement, selectedElement);
    })
    .catch(error => {
        // Handle errors
        console.error('Error during API call:', error);
    });