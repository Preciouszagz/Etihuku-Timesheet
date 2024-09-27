document.addEventListener('DOMContentLoaded', () => {
     // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('enrollBtn');
        
        // Disable button
        dButton.disabled = true;
        dButton.style.background = '#b890f8';
        dButton.style.cursor = 'not-allowed';

        // Re-enable button
        setTimeout(() => {
            dButton.disabled = false;
            dButton.style.background = '';
            dButton.style.cursor = '';
        }, 8000);
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        const loader = document.getElementById('toastLoader');
        const pleaseWait = document.getElementById('pleaseWait');
        const toastMessage = document.getElementById('toastMessage');
        
        toast.className = 'toast show';
        loader.style.display = 'inline-block';
        pleaseWait.style.display = 'block';
        toastMessage.style.display = 'none';
        toastMessage.textContent = message;

        // Timer to hide loader and loading message after 3 seconds of display
        setTimeout(() => {
            loader.style.display = 'none';
            pleaseWait.style.display = 'none';
            toastMessage.style.display = 'inline-block';

            // Timer to hide toast message after 3 seconds of display
            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }, 3000);
    }

    // Get all the input fields
    const inputFields = document.querySelectorAll('.input-field');

    let hasError = false;

    // Reset the border color and hide error messages
    function resetFieldStyles() {
        inputFields.forEach(field => {
            field.style.borderColor = 'transparent';
            const errorMessage = field.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
    }

    // Set the border color and show error messages
    function setFieldError(field, message) {
        field.style.border = '1px solid red';
        hasError = true;
        const errorMessage = field.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    // Hide error message when the user starts typing
    function hideErrorMessage(event) {
        const field = event.target.closest('.input-field');
        const errorMessage = field.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
            field.style.borderColor = 'transparent';
        }
    }

    // Event listeners to hide error messages on input
    inputFields.forEach(field => {
        const input = field.querySelector('input');
        input.addEventListener('input', hideErrorMessage);
    });

    // Validate email using Regular Expression formats 
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Event listener for email validation in real-time
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', (e) => {
        const field = e.target.closest('.input-field');
        if (!validateEmail(e.target.value)) {
            setFieldError(field, 'Invalid email address!');
        } else {
            const errorMessage = field.querySelector('.error-message');
            errorMessage.style.display = 'none';
            field.style.borderColor = 'transparent';
            hasError = false;
        }
    });

    // Actions and functions when enroll button is clicked    
    document.getElementById('enrollBtn').addEventListener('click', (e) => {
        e.preventDefault();

        hasError = false;

        resetFieldStyles();

        //Check if all fields have been inputted and display error messages if empty
        inputFields.forEach(field => {
            const input = field.querySelector('input');
            if (input.value.trim() === '') {
                const errorMessageText = 'Please input this field';
                setFieldError(field, errorMessageText);
            } else if (input.getAttribute('name') === 'email' && !validateEmail(input.value)) {
                setFieldError(field, 'Invalid email address!');
            }
        });

        // If no errors, proceed with form submission
        if (!hasError) {
            // Get the login data stored as JSON in localStorage
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            const passcode = loginData.passcode;
            const employee_name = document.getElementById('name').value;
            const employee_email = document.getElementById('email').value;
            
            //Convert to URLEncoded Format 
            const encodedName = encodeURIComponent(employee_name);
            const encodedEmail = encodeURIComponent(employee_email);
            const encodedPasscode = encodeURIComponent(passcode);

            // Build the request URL dynamically with enrolled details
            const url = `https://etihuku-timesheet.azurewebsites.net/enroll_new_employee?employee_name=${encodedName}&employee_email=${encodedEmail}&admin_auth_code=${encodedPasscode}`

            disableBtn();

            const requestOptions = {
                method: "POST",
                redirect: "follow"
              };
              
            fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                showToast(result);
                console.log(result);
            })
            .catch((error) => {
                showToast(error);
                console.log(error);
            });

        }
    });
    
    //Logout Functionality
    document.getElementById('logOutBtn').addEventListener('click', () =>{
        localStorage.removeItem('loginData');
        window.location.href = 'index.html';
        history.replaceState(null, '', 'index.html');
    })

});
