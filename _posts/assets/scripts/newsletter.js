// Create a script element
var scriptElement = document.createElement('script');

// Set the script ID
scriptElement.id = 'mcjs';

// Set the script content
scriptElement.innerHTML = '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/28f75d929cd39e7ba9f9a0f2b/eca6a8e72dfcb034a0ee8bc36.js");';

// Append the script element to the head of the document
document.head.appendChild(scriptElement);

console.log('Mailchimp script added');