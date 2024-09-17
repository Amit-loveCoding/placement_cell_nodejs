document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    showSignupLink.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });
});
