document.addEventListener('DOMContentLoaded', function() {
    const markBtn = document.getElementById('markBtn');
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    const error = document.querySelector('.error');

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

    // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('markBtn');
        
        // Disable button
        dButton.disabled = true;
        dButton.style.background = '#b890f8';
        dButton.style.cursor = 'not-allowed';

        // Re-enable button
        setTimeout(() => {
            dButton.disabled = false;
            dButton.style.background = '';
            dButton.style.cursor = '';
        }, 6000);
    }

    // Function to reset the border color and hide error message
    function resetBorderColor(inputElement) {
        inputElement.classList.remove('error-border'); // Remove the red border from input
    }

    // Function to set the border color and show error message
    function setBorderColor(inputElement) {
        inputElement.classList.add('error-border');
        error.style.display = 'block';
    }

    function setFieldError(field, message) {
        const inputElement = field.querySelector('input');
        inputElement.classList.add('error-border');
        const errorMessage = field.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            errorMessage.style.marginTop = '5px';
        }
    }

    // Reset all field styles
    function resetFieldStyles() {
        inputs.forEach(input => resetBorderColor(input));
    }

    // Input event listener to hide error message and reset border color
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            resetBorderColor(input);
        });
    });

    // Event listener for password length validation in real-time
    const passwordInput = document.getElementById('passcode');
    passwordInput.addEventListener('input', (e) => {
        const field = e.target.closest('.input-field');
        if (e.target.value.length !== 6) {
            setFieldError(field, 'Passcode must be 6 characters long');
        } else {
            const errorMessage = field.querySelector('.error-message');
            errorMessage.style.display = 'none';
            resetBorderColor(e.target);
        }
    });

    //Actions and events when submit button is clicked
    markBtn.addEventListener('click', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Initialize a flag to track if there are any errors
        let hasError = false;

        resetFieldStyles();

        // Validate input fields
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                setBorderColor(input);
                hasError = true;
            }
        });

        // If no errors, proceed with form submission
        if (!hasError) {
            // Get the login data stored as JSON in localStorage
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            const name = loginData.name;
            const passcode = loginData.passcode;
            const dailyPasscode = document.getElementById('passcode').value;

            error.style.display = 'none';
            disableBtn();

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("employee_name", name);
            urlencoded.append("employee_pass_code", passcode);
            urlencoded.append("daily_passcode", dailyPasscode);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };

            fetch("https://etihuku-timesheet.azurewebsites.net/stand-up?clock_date=2024-09-05&clock_time=13%3A21%3A12", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                showToast(result);
            })
            .catch((error) => {
                showToast('Error submitting time log');
                console.error(error);
            });
        }
    });

    // Event listener for Logout Button
    document.getElementById('logOutBtn').addEventListener('click', () => {
        localStorage.removeItem('loginData');
        window.location.href = 'index.html';
        history.replaceState(null, '', 'index.html');
    });
});
