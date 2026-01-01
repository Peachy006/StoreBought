// Popup Modal Functions

//this handles the login and register forms as well as some html menu handling for functionality

interface User {
    username: string;
    password: string;
    id?: number;
    gameState?: string;
}

let currentUser: User = {
    username: '',
    password: '',
};

let isPasswordVisible: boolean = false;

//just for html popup
function openPopup(type: string): void {
    const popup = document.getElementById('account-popup');
    const forms = document.querySelectorAll('.popup-content');

    if (!popup) return;

    // Hide all forms
    forms.forEach(form => form.classList.add('hidden'));

    // Show the requested form
    if (type === 'login') {
        document.getElementById('login-form')?.classList.remove('hidden');
    } else if (type === 'register') {
        document.getElementById('register-form')?.classList.remove('hidden');
    } else if (type === 'account') {
        document.getElementById('account-view')?.classList.remove('hidden');
        updateAccountDisplay();
    }

    // Show popup
    popup.classList.remove('hidden');
}

//just for html popup
function closePopup(): void {
    const popup = document.getElementById('account-popup');
    if (!popup) return;

    popup.classList.add('hidden');

    // Clear input fields
    const loginUsername = document.getElementById('login-username') as HTMLInputElement;
    const loginPassword = document.getElementById('login-password') as HTMLInputElement;
    const registerUsername = document.getElementById('register-username') as HTMLInputElement;
    const registerPassword = document.getElementById('register-password') as HTMLInputElement;

    if (loginUsername) loginUsername.value = '';
    if (loginPassword) loginPassword.value = '';
    if (registerUsername) registerUsername.value = '';
    if (registerPassword) registerPassword.value = '';

    // Hide error messages
    document.getElementById('login-error')?.classList.add('hidden');
    document.getElementById('register-error')?.classList.add('hidden');

    // Reset password visibility
    isPasswordVisible = false;
}

//this is for login and register
async function handleLogin(): Promise<void> {

    //Grab the elements
    const usernameInput = document.getElementById('login-username') as HTMLInputElement;
    const passwordInput = document.getElementById('login-password') as HTMLInputElement;
    const errorDiv = document.getElementById('login-error');

    if (!usernameInput || !passwordInput || !errorDiv) return;

    const username = usernameInput.value;
    const password = passwordInput.value;


    //hides earlier errors
    errorDiv.classList.add('hidden');


    //throw potential error
    if (!username || !password) {
        showError('login-error', 'Please fill in all fields');
        return;
    }

    //try to login
    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        //if successful, grab the user
        const user = await response.json();
        if (user) {
            currentUser = user;
            //if the user has a gamestate, load it into the gamestate
            if (user.gameState) {
                const loadedState = JSON.parse(user.gameState);
                Object.assign(gameState, loadedState);
                updateDisplay();
                // Update UI for items
                for (const key in gameState.ITEMS) {
                    const el = document.querySelector(`[data-product="${key}"] .product-owned`);
                    if (el) el.textContent = String(gameState.ITEMS[key].amount);
                }
            }
            showSuccess('Login successful!');
        } else {
            showError('login-error', 'Invalid username or password');
        }
    } catch (e) {
        showError('login-error', 'Server error. Try again later.');
    }
}

//register a new user
async function handleRegister(): Promise<void> {
    const usernameInput = document.getElementById('register-username') as HTMLInputElement;
    const passwordInput = document.getElementById('register-password') as HTMLInputElement;
    const errorDiv = document.getElementById('register-error');

    if (!usernameInput || !passwordInput || !errorDiv) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    errorDiv.classList.add('hidden');

    if (!username || !password || username.length < 2 || password.length < 2) {
        showError('register-error', 'Invalid input details');
        return;
    }

    try {
        const response = await fetch('/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, gameState: JSON.stringify(gameState) })
        });
        const user = await response.json();
        currentUser = user;
        showSuccess('Account created successfully!');
    } catch (e) {
        showError('register-error', 'Could not create account');
    }
}


//function for showing errors
function showError(elementId: string, message: string): void {
    const errorDiv = document.getElementById(elementId);
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

//function for showing success messages
function showSuccess(message: string): void {
    // Hide all forms
    const forms = document.querySelectorAll('.popup-content');
    forms.forEach(form => form.classList.add('hidden'));

    // Show success message
    const successText = document.getElementById('success-text');
    const successMessage = document.getElementById('success-message');

    if (successText) successText.textContent = message;
    if (successMessage) successMessage.classList.remove('hidden');
}

//function for updating the account display, this is for the account view page
function updateAccountDisplay(): void {

    //Grab the elements
    const displayUsername = document.getElementById('display-username');
    const displayUserId = document.getElementById('display-userid');
    const displayPassword = document.getElementById('display-password');
    const passwordBtnText = document.getElementById('password-btn-text');

    //if the elements exist, update their text content
    if (displayUsername) displayUsername.textContent = currentUser.username || 'Not logged in';
    if (displayUserId) displayUserId.textContent = currentUser.id ? String(currentUser.id) : '-';

    //set the password visibility to false
    isPasswordVisible = false;

    //if the elements exist, update their text content
    if (displayPassword) {
        displayPassword.textContent = '••••••••';
        displayPassword.classList.add('password-hidden');
    }
    if (passwordBtnText) passwordBtnText.textContent = 'Show Password';
}

//function for toggling the password visibility, the button that says show password
function togglePassword(): void {
    const passwordDisplay = document.getElementById('display-password');
    const btnText = document.getElementById('password-btn-text');

    if (!passwordDisplay || !btnText) return;

    if (isPasswordVisible) {
        passwordDisplay.textContent = '••••••••';
        passwordDisplay.classList.add('password-hidden');
        btnText.textContent = 'Show Password';
        isPasswordVisible = false;
    } else {
        passwordDisplay.textContent = currentUser.password || 'No password set';
        passwordDisplay.classList.remove('password-hidden');
        btnText.textContent = 'Hide Password';
        isPasswordVisible = true;
    }
}