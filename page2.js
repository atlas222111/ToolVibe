const API_URL = "http://localhost:3001";

document.addEventListener('DOMContentLoaded', () => {
    const registerWindow = document.getElementById("registerWindow");
    const openRegister = document.getElementById("openRegister");
    const openLogin = document.getElementById("openLogin");

    if (openRegister) {
        openRegister.onclick = () => {
            document.querySelector(".auth-window").classList.add("hidden");
            registerWindow.classList.remove("hidden");
        };
    }

    if (openLogin) {
        openLogin.onclick = () => {
            registerWindow.classList.add("hidden");
            document.querySelector(".auth-window").classList.remove("hidden");
        };
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            loginForm.style.display = 'none';
            const loginSuccessBlock = document.getElementById('login-success-block');
            if (loginSuccessBlock) {
                loginSuccessBlock.style.display = 'block';
                const userData = JSON.parse(user);
                const userEmailSpan = loginSuccessBlock.querySelector('span');
                if (userEmailSpan) {
                    userEmailSpan.textContent = userData.email;
                }
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.onclick = function() {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        loginSuccessBlock.style.display = 'none';
                        loginForm.style.display = '';
                    };
                }
            }
        }

        // Handle login form submission (with API)
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMsg = data.detail || data.message || 'Неверные учетные данные';
                    alert(`Ошибка: ${errorMsg}`);
                    return;
                }

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert(`Добро пожаловать, ${data.user.email}!`);
                
                loginForm.style.display = 'none';
                const loginSuccessBlock = document.getElementById('login-success-block');
                if (loginSuccessBlock) {
                    loginSuccessBlock.style.display = 'block';
                    const userEmailSpan = loginSuccessBlock.querySelector('span');
                    if (userEmailSpan) {
                        userEmailSpan.textContent = data.user.email;
                    }
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.onclick = function() {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            loginSuccessBlock.style.display = 'none';
                            loginForm.style.display = '';
                        };
                    }
                }
                
                emailInput.value = '';
                passwordInput.value = '';
                
            } catch (error) {
                alert(`Ошибка подключения:\n${error.message}\n\nПроверьте:\n1. Запущен ли backend?\n2. Доступен ли http://localhost:3001?`);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = registerForm.querySelector('input[type="email"]');
            const passwordInput = registerForm.querySelector('input[type="password"]');
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            if (password.length < 6) {
                alert('Пароль должен быть не менее 6 символов');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMsg = data.detail || data.message || 'Ошибка регистрации';
                    alert(`Ошибка: ${errorMsg}`);
                    return;
                }

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert(`Пользователь ${data.user.email} успешно зарегистрирован!`);
                
                // Clear form and switch to login
                emailInput.value = '';
                passwordInput.value = '';
                document.querySelector(".auth-window").classList.remove("hidden");
                registerForm.parentElement.classList.add("hidden");
                
                const loginSuccessBlock = document.getElementById('login-success-block');
                if (loginSuccessBlock) {
                    loginSuccessBlock.style.display = 'block';
                    const userEmailSpan = loginSuccessBlock.querySelector('span');
                    if (userEmailSpan) {
                        userEmailSpan.textContent = data.user.email;
                    }
                    document.querySelector(".auth-window").style.display = 'none';
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.onclick = function() {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            loginSuccessBlock.style.display = 'none';
                            document.querySelector(".auth-window").style.display = 'block';
                        };
                    }
                }
                
            } catch (error) {
                alert(`Ошибка подключения:\n${error.message}\n\nПроверьте:\n1. Запущен ли backend?\n2. Доступен ли http://localhost:3001?`);
            }
        });
    }

    const accountBtn = document.querySelector('button[title="Account"]');
    const accountModal = document.getElementById('account-modal');
    
    if (accountBtn && accountModal) {
        accountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            accountModal.style.display = 'block';
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && accountModal.style.display === 'block') {
                accountModal.style.display = 'none';
            }
        });
    }

    const favoriteButtons = document.querySelectorAll('[title="Favorites"]');
    favoriteButtons.forEach(button => {
        let isFavorited = false;
        button.addEventListener('click', () => {
            isFavorited = !isFavorited;
            const svg = button.querySelector('svg path');
            if (svg) {
                if (isFavorited) {
                    svg.style.fill = '#FFD700';
                    button.style.transform = 'scale(1.2)';
                    setTimeout(() => { button.style.transform = 'scale(1)'; }, 200);
                } else {
                    svg.style.fill = 'currentColor';
                }
            }
        });
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    const cartBadge = document.querySelector('.badge');
    const cartButton = document.querySelector('[title="Cart"]');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            alert(`Cart contains ${cartBadge ? cartBadge.textContent : '0'} item(s)`);
        });
    }
});
