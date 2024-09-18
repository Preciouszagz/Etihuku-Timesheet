// Create a new XMLHttpRequest object
let xhr = new XMLHttpRequest();

// GET-request for the URL
xhr.open('GET', 'https://etihuku-timesheet.azurewebsites.net/docs#/admin/update_manager_auth_update_manager_auth_post', true);

// Function for completed request
xhr.onload = function() {
    // For successful request
  if (xhr.status == 200) { 
    console.log("Success:", xhr.responseText); 

    // For unsuccessful request
  } else {
    console.log("Error:", xhr.status);
  }
};

// Send the request
xhr.send();

//Using cURL
/* curl -X 'POST' \
  'https://etihuku-timesheet.azurewebsites.net/enroll_new_employee' \
  -H 'accept: application/json' \
  -d '' */

  //Using Javascript Fetch
  fetch('https://etihuku-timesheet.azurewebsites.net/enroll_new_employee', {
    method: 'POST',
    headers: {
      'Accept': 'application/json', 
    },
    body: JSON.stringify({}) 
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  
