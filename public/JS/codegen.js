document.addEventListener('DOMContentLoaded', function() {

    // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('generateBtn');
        
        // Disable button
        dButton.disabled = true;
        dButton.style.background = '#b890f8';
        dButton.style.cursor = 'not-allowed';

        // Re-enable button
        setTimeout(() => {
            dButton.disabled = false;
            dButton.style.background = '';
            dButton.style.cursor = '';
        }, 10000);
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
        field.style.border = '1px solid transparent';
        const errorMessage = field.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            errorMessage.style.marginTop = '5px';
        }
    }

    // Actions and functions when generate button is clicked
    document.getElementById('generateBtn').addEventListener('click', function() {
        // Get the elements
        const manager = document.getElementById('manager');
        const error = document.querySelector('.error');

        let hasError = false;

        // Reset all field styles
        function resetFieldStyles() {
            resetBorderColor(manager);
        }

        resetFieldStyles();

        if (manager.value === 'default') {
            setBorderColor(manager);
            hasError = true;
        }

        if (hasError) {
            error.style.display = 'block';
        } else {
            // Get the login data stored as JSON in localStorage
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            const name = loginData.name;
            const passcode = loginData.passcode;

            //Convert to URLEncoded Format
            const encodedManager = encodeURIComponent(name);
            
            // Build the request URL dynamically with manager name
            const url = `https://etihuku-timesheet.azurewebsites.net/gen_standup_code?manager_name=${encodedManager}`


            error.style.display = 'none';
            disableBtn();

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("manager_pass_code", passcode);

            const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
            };

            fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                showToast(result);
                console.log(result);
            })
            .catch((error) => {
                showToast('Error generating code');
                console.error(error);
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
