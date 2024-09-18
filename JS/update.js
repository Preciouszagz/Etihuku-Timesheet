document.addEventListener('DOMContentLoaded', function() {

    // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('updatebtn');
        
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

    // Function to reset the border color
    function resetBorderColor(selectElement) {
        selectElement.style.borderColor = 'transparent';
        selectElement.style.borderWidth = '';
    }

    // Set border color to indicate error
    function setBorderColor(selectElement) {
        selectElement.style.borderColor = 'red';
        selectElement.style.borderWidth = '1px';
        selectElement.style.borderStyle = 'solid';
    }

    // Set field error and display message
    function setFieldError(field, message) {
        field.style.border = '1px solid red';
        const errorMessage = field.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            errorMessage.style.marginTop = '5px';
        }
    }

    // Actions and functions when update button is clicked
    document.getElementById('updatebtn').addEventListener('click', function() {
        // Get the elements
        const manager = document.getElementById('manager');
        const error = document.querySelector('.error');

        let hasError = false;

        // Reset all field styles
        function resetFieldStyles() {
            resetBorderColor(manager);
        }

        resetFieldStyles();

        //Validate fields
        if (manager.value === 'default') {
            setBorderColor(manager);
            hasError = true;
        }
        if (hasError) {
            error.style.display = 'block';
        } else {
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            const passcode = loginData.passcode;
            const selectedManager = manager.value;

            //Convert to URLEncoded Format 
            const encodedManager = encodeURIComponent(selectedManager);
            const encodedPasscode = encodeURIComponent(passcode);

            // Build the request URL dynamically with details
            const url = `https://etihuku-timesheet.azurewebsites.net/update_manager_auth?manager_name=${encodedManager}&admin_auth_code=${encodedPasscode}`

            error.style.display = 'none';
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

    //Event listener for Logout Button
    document.getElementById('logOutBtn').addEventListener('click', () =>{
        localStorage.removeItem('loginData');
        window.location.href = 'index.html';
        history.replaceState(null, '', 'index.html');
    });
});
