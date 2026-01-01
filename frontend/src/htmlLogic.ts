// Popup Modal Functions

interface User {
    username: string;
    password: string;
    userId: string;
}

let currentUser: User = {
    username: '',
    password: '',
    userId: ''
};

let isPasswordVisible: boolean = false;

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

function handleLogin(): void {
    const usernameInput = document.getElementById('login-username') as HTMLInputElement;
    const passwordInput = document.getElementById('login-password') as HTMLInputElement;
    const errorDiv = document.getElementById('login-error');

    if (!usernameInput || !passwordInput || !errorDiv) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous errors
    errorDiv.classList.add('hidden');

    // Validation
    if (!username || !password) {
        showError('login-error', 'Please fill in all fields');
        return;
    }

    // YOUR LOGIN LOGIC HERE
    // Example: Check against stored credentials
    console.log('Login attempt:', username, password);

    // Example success:
    currentUser.username = username;
    currentUser.password = password;
    currentUser.userId = 'USER_' + Math.random().toString(36).substr(2, 9).toUpperCase();

    showSuccess('Login successful!');
}

function handleRegister(): void {
    const usernameInput = document.getElementById('register-username') as HTMLInputElement;
    const passwordInput = document.getElementById('register-password') as HTMLInputElement;
    const errorDiv = document.getElementById('register-error');

    if (!usernameInput || !passwordInput || !errorDiv) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous errors
    errorDiv.classList.add('hidden');

    // Validation
    if (!username || !password) {
        showError('register-error', 'Please fill in all fields');
        return;
    }

    if (username.length < 3) {
        showError('register-error', 'Username must be at least 3 characters');
        return;
    }

    if (password.length < 6) {
        showError('register-error', 'Password must be at least 6 characters');
        return;
    }

    // YOUR REGISTRATION LOGIC HERE
    // Example: Check if username exists
    if (checkUsernameExists(username)) {
        showError('register-error', 'Username already in use');
        return;
    }

    // Success - create account
    currentUser.username = username;
    currentUser.password = password;
    currentUser.userId = 'USER_' + Math.random().toString(36).substr(2, 9).toUpperCase();

    console.log('Account created:', currentUser);
    showSuccess('Account created successfully!');
}

function checkUsernameExists(username: string): boolean {
    // YOUR LOGIC TO CHECK IF USERNAME EXISTS
    // Example: return username === 'admin' || username === 'test';
    return false; // Replace with actual check
}

function showError(elementId: string, message: string): void {
    const errorDiv = document.getElementById(elementId);
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

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

function updateAccountDisplay(): void {
    const displayUsername = document.getElementById('display-username');
    const displayUserId = document.getElementById('display-userid');
    const displayPassword = document.getElementById('display-password');
    const passwordBtnText = document.getElementById('password-btn-text');

    if (displayUsername) displayUsername.textContent = currentUser.username || 'Not logged in';
    if (displayUserId) displayUserId.textContent = currentUser.userId || '-';

    // Reset password display
    isPasswordVisible = false;
    if (displayPassword) {
        displayPassword.textContent = '••••••••';
        displayPassword.classList.add('password-hidden');
    }
    if (passwordBtnText) passwordBtnText.textContent = 'Show Password';
}

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