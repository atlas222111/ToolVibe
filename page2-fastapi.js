/**
 * Updated page2.js for FastAPI backend
 * Use this to replace the old page2.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001'; // Change to your deployed URL
    
    // === AUTH FORM SWITCHING ===
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

    // === LOGIN LOGIC (WITH FASTAPI BACKEND) ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Check if already logged in on page load
        if (localStorage.getItem('loggedIn') === 'true') {
            loginForm.style.display = 'none';
            const loginSuccessBlock = document.getElementById('login-success-block');
            if (loginSuccessBlock) {
                loginSuccessBlock.style.display = 'block';
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.onclick = function() {
                        localStorage.removeItem('loggedIn');
                        localStorage.removeItem('token');
                        loginSuccessBlock.style.display = 'none';
                        loginForm.style.display = '';
                    };
                }
            }
        }

        // Handle login form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            try {
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (response.ok && data.access_token) {
                    // Save token and login state
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('user_email', data.user.email);
                    
                    // Show success
                    loginForm.style.display = 'none';
                    const loginSuccessBlock = document.getElementById('login-success-block');
                    if (loginSuccessBlock) {
                        loginSuccessBlock.style.display = 'block';
                        const logoutBtn = document.getElementById('logoutBtn');
                        if (logoutBtn) {
                            logoutBtn.onclick = function() {
                                localStorage.removeItem('loggedIn');
                                localStorage.removeItem('token');
                                loginSuccessBlock.style.display = 'none';
                                loginForm.style.display = '';
                            };
                        }
                    }
                } else {
                    alert(data.detail || 'Login failed. Check your credentials.');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Connection error. Is the backend running?');
            }
        });
    }

    // === ACCOUNT MODAL ===
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

    // === FAVORITES BUTTON ===
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

    // === MOBILE MENU ===
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

    // === CART BUTTON ===
    const cartBadge = document.querySelector('.badge');
    const cartButton = document.querySelector('[title="Cart"]');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            alert(`Cart contains ${cartBadge ? cartBadge.textContent : '0'} item(s)`);
        });
    }

    console.log('%cToolVibe - FastAPI Backend', 'color: #FFD700; font-size: 24px; font-weight: bold;');
    console.log('%cConnected to FastAPI backend', 'color: #B8860B; font-size: 14px;');
    console.log('%c📚 API Docs: /docs', 'color: #FFD700; font-size: 12px;');
});
