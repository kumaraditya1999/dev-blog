---
title: Creating A Logging Library For Microsoft Application Insights
date: 2024-07-31 10:10:10 +0530
categories: [Software Engineering]
tags: [logging, telemetry, nuget]
math: true
mermaid: true
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>

### Before You Read

This article mostly revolves around the `.NET` ecosystem, so familiarity with the following terms will be helpful:

1. `Startup`: The class plays a central role in configuring the application's services and middleware. It's where you set up the application's behavior, including how it responds to HTTP requests, interacts with databases, and integrates with other services.

2. `Dependency Injection`: It is a design pattern used to achieve `Inversion of Control (IoC)` between classes and their dependencies. In `.NET Core applications`, DI is a core feature integrated into the framework, making it easier to manage object lifetimes, dependencies, and configurations.

3. `Application Insights`: It is an Azure service that provides real-time monitoring and performance insights for your applications. It collects telemetry data such as request times, error rates, and usage patterns to help diagnose issues and optimize performance. By integrating Application Insights, you can gain valuable visibility into your application's health and user interactions.

4. `Extension Methods`: A way to add method to existing classes without altering the source code.

## Pretext

While working at Microsoft, I was contributing in developing a solution to create an extensible `logging` library for various services to enhance the telemetry stored in `Application Insights`. Features like storing the request/response body, masking sensitive data, storing telemetry in a different storage account instead of Application Insights and more were commonly reimplemented across services. Instead of reinventing the wheel, we needed to come up with a standardized solution.

## How to approach the problem ?

Since I was working at Microsoft, the ecosystem was built in C# and `.NET`, so we didn’t have to worry about varying tech stacks. So, we needed to come up with a standardized way to integrate features and enhance the telemetry. After some investigation, it was found that the Application Insights team had a vision for enhancing telemetry, offering two main approaches:

1. Add or Modify properties to any telemetry sent from your app by implementing `ITelemetryInitializer`.
2. Filtering can modify or discard telemetry before it's sent from the SDK by implementing `ITelemetryProcessor`.

These classes provide control over modifying telemetry data (e.g., adding fields like request body) and controlling the flow of telemetry data (e.g., moving data to separate storage instead of Application Insights). You can read more about them in the [official documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling?tabs=dotnet%2Cjavascriptwebsdkloaderscript){:target="_blank"}

Now that we know that is possible how do we make it easy for the users to use the libary, `Without Much Changes In The Application!`

## Bootstrapping Method

In .NET solutions, appsettings.json is used to store all application-related settings. We will provide a section in appsettings called TelemetrySetting, which will include boolean flags and other details used by the library to control feature activation.

A basic example of the JSON configuration is provided below. Similarly, for any new feature, just add the JSON config inside the TelemetrySetting and control the features you want to enable:

```json
{
    "TelemetrySetting": {
        "RequestBodyCapture": {
            "Enable": true
        },
        "IngnoreTelemetry": {
            "Enable": true,
            "PathsToIgnore": [
                "*"
            ]
        },
        "MaskTelemetry": {
            "Enable": true,
            "Regex": [
                "^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
            ]
        }
    }
}

```

## Enabling The Features

Just passing the settings is not enough. We need to add the corresponding `ITelemetryInitializers` and `ITelemetryProcessors` to the dependency pipeline, how do we do that ?

First of all, for any new feature we dont want people to manually add the corresponding implemented version of the Initializer and Processors in Dependency Injection pipeline, so lets provide an extension method on the `IServiceCollection`. To simplify this process, we provide an extension method on `IServiceCollection` that handles the heavy lifting for the developer. The startup will look like this:

```c#

var builder = WebApplication.CreateBuilder(args);

var telemetrySettings = builder
                        .Configuration
                        .GetSection("TelemetrySetting")
                        .Get<TelemetrySetting>(); // Define the TelemetrySetting model

builder.Services.BootstrapCustomTelemetryLibrary(telemetrySettings); // the extension method

app.Run();

```

Now implement all the logic to add the features in the extension method

```c#

public static IServiceCollection BootstrapCustomTelemetryLibrary(
        this IServiceCollection services,
        TelemetrySetting telemetrySettings)
    {
        if (telemetrySettings.RequestBodyCapture.Enable) {
            services.AddSingleton<ITelemetryInitializer, RequestBodyCaptureInitializer>(); // RequestBodyCaptureInitializer implements ITelemetryInitializer
        }

        if (telemetrySettings.IgnoreTelemetry.Enable) {
            services.AddApplicationInsightsTelemetryProcessor<IgnoreTelemetryFilter>(); // IgnoreTelemetryFilter implements ITelemetryProcessor
        }
    }
```

## The End

I will not go into the details of the implementation of the individual features, I am sure you can figure those out. This article highlights how leveraging existing `.NET` features and the extensibility of the `Application Insights SDK` allowed us to develop a lightweight library, avoiding the need to reinvent the wheel and saving significant developer effort across the organization.