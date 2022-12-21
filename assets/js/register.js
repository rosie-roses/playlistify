const form = document.querySelector('form');
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Get the values.
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;
    console.log(email, username, password);
});