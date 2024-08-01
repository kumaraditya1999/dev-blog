---
title: Adding Page Views In My Jekyll Blog
date: 2024-03-07 10:10:10 +0530
categories: [Software Engineering]
tags: [blog, jekyll, pageviews]
math: true
mermaid: true
img_path: /assets/images/page-view/
---

Recently I came across some tutorials that taught me how to create a blog free of cost using Ruby, Jekyll and Github Pages. Took me less than half an hour to set it up, I chose a good theme ([Chirpy](https://chirpy.cotes.page/posts/getting-started/){:target="_blank"}) which consumed most of my time; and I thought I am good to go now. But then I came across a post by [Neo Wang](https://nwatx.me/post/atcoderdp){:target="_blank"} and saw something really interesting, the page view counter. 

![Page View Counter](page-view.png)

As soon as I saw it I knew its a must have feature for my blog and I should add it ASAP. So here is my story of how I went into a rabbit hole for adding page views to my blog 😁

## Google Analytics

The first step was to add google analytics to my website, which was straight forward. Followed the steps to create a new App in google analytics got the GA tag and pasted the id in the `config.yaml`. For additional security, I configured my Analytics account to only accept events from my domain. That's it for the easy part.

## Super Proxy

Then to add the page views I stumbled across a closed github [issue](https://github.com/cotes2020/jekyll-theme-chirpy/issues/92){:target="_blank"} where the author gave the steps to add page views, they mentioned its not documented well for some reasons like hard to do, reduces motivation etc etc... So I followed the author and went ahead to create a google super proxy server.

> Google Super proxy servers were old ways to expose the google analytics data to rest of the world. Please can create custom queries at expose it via the proxy.
{: .prompt-tip }

Now the thing is google stopped the super proxy 😒

![Google superProxy](super-proxy.png)

So I thought lets create proxy of my own and went ahead and created a python server, which just forwards the API response of the GA APIs and deployed it as web app. Why create a server and not do it from js ? because it requires API keys! I was not able to find a way to do it without exposing secrets, if you are aware of any such solutions please let me know.

```python
@app.route('/page_views')
def get_page_views():
    page_views = cache.get_ga_response(property_id)
    return jsonify(page_views)
```

## The Catch

After I deployed the server, I went ahead and filled all the config values. But it was not working! So I dug a little into the codebase and found out that after google deprecated creating the superProxy, on 4th June 2024 the devs [removed the functionality](https://github.com/cotes2020/jekyll-theme-chirpy/issues/92){:target="_blank"} to use google analytics for displaying page views.

![No GA support for GA Reports](pull-request.png)

## Taking Matters In My Own Hands

I had already spent more than `8 hours` researching and doing random stuff, now I cannot give up at this point. So I decided to take the matters in my own hand. I wrote a custom script and injected it the markdown, the script will take care of adding the page views. The hacky-wacky solution:

```js
console.log('Hello from ga-pv.js!');

var currentURL = window.location.pathname;
var url = '{{ site.backend.url }}' + '/get_page_views' + currentURL;
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var selectedElement = document.querySelector('.readtime');
        var newElement = document.createElement('span');
        newElement.innerHTML = '<em><i class="fas fa-eye small"></i> ' + '  ' + data.page_views + '</em> views';
        var originalClass = selectedElement.className;
        newElement.className = originalClass;
        selectedElement.parentNode.insertBefore(newElement, selectedElement);
    })
    .catch(error => {
        console.error('Error during API call:', error);
    });
```

Now how to add this to each page? We are using jekyll so obviously we aim for reusability. The reusable codes are in `_layout` and `_includes`. Well copying the `_layout` and `_includes` folders were something which lead to me copying entire codebase else build as failing here and here, which I didn't want to do. In the end I went with injecting the custom script on top of each post using liquid templates

```text
    <script>{\% include_relative path/to/script.js %}</script>
```

> Note for the future, if you are injecting scripts don't add comments in your js file, when I did that and deployed the build it gave me errors at random line for unrecognised characters. The reason being that for building it minifies the files and all the things are written on one line, so the first time it encounters a `//` rest of the html gets commented out.
{: .prompt-danger }

After spending more than `16 hours` I was able to display the `pageviews`. Impact on the world was 0 but atleast I slept with satisfaction.

Resources:
- [Enabling Page Views](https://enqio.cn/posts/enable-google-pv/){:target="_blank"}
- [Google Analytics superProzxy](https://developers.google.com/analytics/solutions/google-analytics-super-proxy){:target="_blank"}
