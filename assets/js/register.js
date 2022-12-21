const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    // Reset errors.
    emailError.textContent = '';
    passwordError.textContent = '';

    // Get the values.
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;
    try {
        const res = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data);
        if (data.errors) {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }
        if (data.user) {
            location.assign('/login');
        }
    } catch (err) {
        console.log(err);
    }
});