console.log('Hello from ga-pv.js!');

var currentURL = window.location.pathname;
var url = "{{ site.backend.url }}" + "/get_page_views" + currentURL;
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

// Create a script element
var scriptElement = document.createElement('script');

// Set the script ID
scriptElement.id = 'mcjs';

// Set the script content
scriptElement.innerHTML = '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/28f75d929cd39e7ba9f9a0f2b/eca6a8e72dfcb034a0ee8bc36.js");';

// Append the script element to the head of the document
document.head.appendChild(scriptElement);

console.log('Mailchimp script added');