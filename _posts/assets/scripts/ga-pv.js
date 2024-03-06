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
        selectedElement.parentNode.insertBefore(newElement, selectedElement);
    })
    .catch(error => {
        console.error('Error during API call:', error);
    });