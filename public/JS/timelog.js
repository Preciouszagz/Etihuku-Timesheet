document.addEventListener('DOMContentLoaded', function() {
    const timelogBtn = document.getElementById('timelogBtn');
    const clockType = document.getElementById('time');
    const manager = document.getElementById('manager');
    const project = document.getElementById('project');
    const error = document.querySelector('.error');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    const selects = [clockType, manager, project];

    let hasError = false;

    // Function to reset the border color
    function resetBorderColor(element) {
        element.style.borderColor = 'transparent';
        element.style.borderWidth = '';
    }

    // Set border color to indicate error
    function setBorderColor(element) {
        element.style.borderColor = 'red';
        element.style.borderWidth = '1px';
        element.style.borderStyle = 'solid';
        hasError = true;
        error.style.display = 'block';
    }

    //Function to reset field styles
    function resetFieldStyles() {
        selects.forEach(select => resetBorderColor(select));
        inputs.forEach(input => resetBorderColor(input));
    }

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            resetBorderColor(input);
        });
    });

    selects.forEach(select => {
        select.addEventListener('change', function() {
            if (select.value !== 'default') {
                resetBorderColor(select);
            }
        });
    });

    // Function to disable and re-enable button
    function disableBtn() {
        const dButton = document.getElementById('timelogBtn');
        dButton.disabled = true;
        dButton.style.background = '#b890f8';
        dButton.style.cursor = 'not-allowed';

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

        setTimeout(() => {
            loader.style.display = 'none';
            pleaseWait.style.display = 'none';
            toastMessage.style.display = 'inline-block';

            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }, 3000);
    }

    // Actions and functions when timelog button is clicked
    timelogBtn.addEventListener('click', function(event) {
        event.preventDefault();

        hasError = false;
        resetFieldStyles();
        
        //Validate fields
        if (clockType.value === 'default') {
            setBorderColor(clockType);
        }
        if (manager.value === 'default') {
            setBorderColor(manager);
        }
        if (project.value === 'default') {
            setBorderColor(project);
        }

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                setBorderColor(input);
            }
        });

        //Proceed if no errors
        if (!hasError) {
        // Get the login data stored as JSON in localStorage
        const loginData = JSON.parse(localStorage.getItem('loginData'));
        const name = loginData.name;
        const passcode = loginData.passcode;

        //Get Values from form fields
        const storyTaskNumber = document.getElementById('task-num').value;
        const description = document.getElementById('description').value;

        error.style.display = 'none';
        disableBtn();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("employee_name", name);
        urlencoded.append("clock_type", clockType.value);
        urlencoded.append("project", project.value);
        urlencoded.append("emp_manager", manager.value);
        urlencoded.append("story_task_number", storyTaskNumber);
        urlencoded.append("description", description);
        urlencoded.append("employee_pass_code", passcode);


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        };

        fetch("https://etihuku-timesheet.azurewebsites.net/clock?clock_date=2024-09-05&clock_time=13%3A21%3A12", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                showToast(result);
                console.log(result);
            })
            .catch((error) => {
                showToast(error);
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
