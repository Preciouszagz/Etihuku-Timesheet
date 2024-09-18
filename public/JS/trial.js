document.getElementById('loginBtn').addEventListener('click', function() {
    // Get the selected name from the dropdown
    const manager = document.getElementById('manager').value;
    
    // Get the entered password
    const password = document.getElementById('password').value;

    // Basic validation (you can expand this)
    if (manager === 'default' || password === '') {
        document.querySelector('.error').style.display = 'block';
        return; // Stops the function if validation fails
    } else {
        document.querySelector('.error').style.display = 'none';
    }

    // Show the toast loader (optional: to show something is happening)
    document.getElementById('toast').style.display = 'block';
    document.getElementById('pleaseWait').style.display = 'inline';

    // Make the fetch request to your server
    fetch('https://etihuku-timesheet.azurewebsites.net/api/login', { 
        method: 'POST',
        mode: 'no-cors',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            manager: manager,
            password: password
        })
    })
    .then(response => {
        console.log();
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
});
