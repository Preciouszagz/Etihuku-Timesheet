document.addEventListener('DOMContentLoaded', () => {

    // Function to save the password using API
    async function savePassword(email, password) {
        try {
            const response = await fetch('https://etihuku-timesheet.azurewebsites.net/api/savePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to save password');
            }
        } catch (error) {
            console.error('Error saving password:', error);
            return false;
        }
    }

    // Function to check if the password is saved
    async function isPasswordSaved(email) {
        try {
            const response = await fetch(`https://etihuku-timesheet.azurewebsites.net/api/isPasswordSaved?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result.isPasswordSaved;
            } else {
                throw new Error('Failed to check if password is saved');
            }
        } catch (error) {
            console.error('Error checking if password is saved:', error);
            return false;
        }
    }

    // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('loginBtn');
        
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

    // Show toast notification
    function showToast(message) {
        disableBtn();
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
        const generalError = document.getElementById('general-error');
        if (errorMessage) {
            errorMessage.style.display = 'none';
            generalError.style.display = 'none';
            field.style.borderColor = 'transparent';
        }
    }

    // Get all input-field elements
    const inputFields = document.querySelectorAll('.input-field');

    // Initialize a flag to track if there are any errors
    let hasError = false;

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
            setFieldError(field, 'Invalid email format!');
        } else {
            const errorMessage = field.querySelector('.error-message');
            errorMessage.style.display = 'none';
            field.style.borderColor = 'transparent';
            hasError = false; // Reset hasError if the email is valid
        }
    });

    // Event listener for password length validation in real-time
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', (e) => {
        const field = e.target.closest('.input-field');
        if (e.target.value.length < 8) {
            setFieldError(field, 'Passcode cannot be less than 8 characters');
        } else {
            const errorMessage = field.querySelector('.error-message');
            errorMessage.style.display = 'none';
            field.style.borderColor = 'transparent';
            hasError = false; // Reset hasError if the password length is valid
        }
    });

    // Actions and functions when login button is clicked
    document.getElementById('loginBtn').addEventListener('click', async (e) => {
        // Prevent default form submission
        e.preventDefault();

        // Reset hasError for each submission
        hasError = false;

        resetFieldStyles();

        // Validate input fields
        inputFields.forEach(field => {
            const input = field.querySelector('input');
            if (input.value.trim() === '') {
                const errorMessageText = input.getAttribute('name') === 'email' ? 'Please enter your email' : 'Please enter your passcode';
                setFieldError(field, errorMessageText);
            } else if (input.getAttribute('name') === 'email' && !validateEmail(input.value)) {
                setFieldError(field, 'Invalid email format!');
            } else if (input.getAttribute('name') === 'password' && input.value.length < 8) {
                setFieldError(field, 'Passcode cannot be less than 8 characters');
            }
        });

        // Form submission if no errors
        if (!hasError) {
            const emailValue = document.getElementById('email').value;
            const passwordValue = document.getElementById('password').value;

            // Check if password is saved
            const passwordSaved = await isPasswordSaved(emailValue);

            if (!passwordSaved) {
                showToast('Password not saved, access restricted');
                return;
            }

            // Attempt to save the password
            const passwordSaveSuccess = await savePassword(emailValue, passwordValue);

            if (!passwordSaveSuccess) {
                showToast('Failed to save password');
                return;
            }

            // Proceed with login if password is saved
            if (emailValue === 'admin@etihuku.com' && passwordValue === 'adminPass') {
                window.location.href = "admin.html";
            } else if (emailValue === 'employee@etihuku.com' && passwordValue === 'employeePass') {
                window.location.href = "employee.html";
            } else if (emailValue === 'manager@etihuku.com' && passwordValue === 'managerPass') {
                window.location.href = "manager.html";
            } else if (emailValue === 'precious.ezeagu@etihuku.com' && passwordValue === '12345678') {
                window.location.href = "employee.html";
            } else {
                showToast('Unknown email or incorrect passcode');
            }
        }
    });
});
