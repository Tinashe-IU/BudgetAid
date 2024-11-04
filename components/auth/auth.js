// Function to handle sign-in process
function signIn()
{
    const error_output = document.getElementById('loginErrorOutput'); // Element to show login errors

    // Define required input fields
    const inputs =
    [
        'loginEmail',
        'loginPassword',
    ];

    // Validate inputs and proceed if valid
    const submit = validateInputs(inputs);

    if (submit)
    {
        const values = extractFormData(inputs); // Extract input values

        const endpoint = 'api/auth/login.php'; // API endpoint for login
        const payload =
        {
            'email': values.loginEmail,
            'password': values.loginPassword,
        };

        // Make API request to login
        apiRequest(endpoint, payload, 'POST', function(error, response)
        {
            if (!error)
            {
                // Handle different responses from the API
                if (response === 'no user')
                {
                    error_output.innerHTML = 'No user found! Check the email address or register';
                    display('show', 'loginErrorOutput');
                }
                if (response === 'wrong password')
                {
                    error_output.innerHTML = 'Wrong password or email address!';
                    display('show', 'loginErrorOutput');
                }
                if (response === 'success')
                {
                    display('hide', 'loginErrorOutput');
                    location.href = 'https://www.budgetaid.co.za/'; // Redirect on successful login
                }
            }
            else
            {
                error_output.innerHTML = 'An error occurred!';
                display('show', 'loginErrorOutput');
            }
        })
    }
}

// Function to handle user registration process
function register()
{
    const error_output = document.getElementById('registerErrorOutput'); // Element to show registration errors

    // Define required input fields
    const inputs =
    [
        'firstname',
        'surname',
        'registerEmail',
        'registerPassword',
    ];

    // Validate inputs and proceed if valid
    const submit = validateInputs(inputs);

    if (submit)
    {
        const values = extractFormData(inputs); // Extract input values

        const endpoint = 'api/auth/register.php'; // API endpoint for registration
        const payload =
        {
            'firstname': values.firstname,
            'surname': values.surname,
            'email': values.registerEmail,
            'password': values.registerPassword,
        };

        // Make API request to register
        apiRequest(endpoint, payload, 'POST', function(error, response)
        {
            if (!error)
            {
                if (response === 'success') location.href = 'https://www.budgetaid.co.za/'; // Redirect on successful registration
                else if (response === 'email exists')
                {
                    error_output.innerHTML = 'Email address already registered!';
                    display('show', 'registerErrorOutput');
                }
                else
                {
                    error_output.innerHTML = 'Something went wrong. Try again';
                    display('show', 'registerErrorOutput');
                }
            }
            else
            {
                error_output.innerHTML = 'An error occurred. Try again';
                display('show', 'registerErrorOutput');
            }
        })
    }
}

// Function to switch between login and registration forms
function switchForm(form)
{
    const empty_values =
    {
        'loginEmail': '',
        'loginPassword': '',
        'registerEmail': '',
        'registerPassword': '',
        'firstname': '',
        'surname': '',
    }
    fillInputValues(empty_values); // Reset form fields

    // Adjust label positions for cleared fields
    for (attr in empty_values)
    {
        document.getElementById(attr + 'Box').classList.remove('label-up');
    }

    // Toggle visibility of login and registration forms
    if (form === 'register')
    {
        display('hide', 'loginModal');
        display('show', 'registerModal');
    }
    else
    {
        display('hide', 'registerModal');
        display('show', 'loginModal');
    }
}

// Function to toggle password visibility
function togglePassword(form, status) 
{
    const hide_password = status === 'off'; // Determine if password should be hidden
    const eye_on = form + 'EyeOn';
    const eye_off = form + 'EyeOff';

    // Toggle visibility icons and password type
    display('hide', hide_password ? eye_on : eye_off);
    display('show', hide_password ? eye_off : eye_on);

    document.getElementById(form + 'Password').type = hide_password ? 'password' : 'text';
}
