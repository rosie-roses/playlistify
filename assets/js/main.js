window.addEventListener("load", init);

function init() {
    bindEvents();
}

function bindEvents() {
    document.querySelector('#register_user').addEventListener("click", () => {
        console.log("Register button clicked");
    });
}