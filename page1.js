const registerWindow = document.getElementById("registerWindow");
const openRegister = document.getElementById("openRegister");
const openLogin = document.getElementById("openLogin");

openRegister.onclick = () => {
    document.querySelector(".auth-window").classList.add("hidden");
    registerWindow.classList.remove("hidden");
};

openLogin.onclick = () => {
    registerWindow.classList.add("hidden");
    document.querySelector(".auth-window").classList.remove("hidden");
};
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        if (localStorage.getItem('loggedIn') === 'true') {
            loginForm.style.display = 'none';
            const msg = document.createElement('div');
            msg.textContent = 'Вы успешно вошли!';
            msg.style = 'color: #FFD700; font-size: 20px; margin-top: 24px; text-align: center;';
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Выйти';
            logoutBtn.style = 'margin-top: 16px; padding: 8px 20px; background: #FFD700; color: #222; border-radius: 8px; border: none; font-weight: bold; cursor: pointer;';
            logoutBtn.onclick = function() {
                localStorage.removeItem('loggedIn');
                msg.remove();
                logoutBtn.remove();
                loginForm.style.display = '';
            };
            loginForm.parentNode.appendChild(msg);
            loginForm.parentNode.appendChild(logoutBtn);
        }

        loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                try {
                    const res = await fetch('http://localhost:3001/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();
                    if (data.success) {
                        localStorage.setItem('loggedIn', 'true');
                        loginForm.style.display = 'none';
                        const msg = document.createElement('div');
                        msg.textContent = 'Вы успешно вошли!';
                        msg.style = 'color: #FFD700; font-size: 20px; margin-top: 24px; text-align: center;';
                        // Кнопка выхода
                        const logoutBtn = document.createElement('button');
                        logoutBtn.textContent = 'Выйти';
                        logoutBtn.style = 'margin-top: 16px; padding: 8px 20px; background: #FFD700; color: #222; border-radius: 8px; border: none; font-weight: bold; cursor: pointer;';
                        logoutBtn.onclick = function() {
                            localStorage.removeItem('loggedIn');
                            msg.remove();
                            logoutBtn.remove();
                            loginForm.style.display = '';
                        };
                        loginForm.parentNode.appendChild(msg);
                        loginForm.parentNode.appendChild(logoutBtn);
                    } else {
                        alert(data.error || 'Ошибка входа');
                    }
                } catch (err) {
                    alert('Ошибка соединения с сервером');
                }
            });
    }

    const accountBtn = document.querySelector('button[title="Account"]');
        const accountModal = document.getElementById('account-modal');
        let closeAccountModal = null;
        if (accountBtn && accountModal) {
            accountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                accountModal.style.display = 'block';
                const loginForm = document.getElementById('loginForm');
                const loginSuccessBlock = document.getElementById('login-success-block');
                if (loginForm && loginSuccessBlock) {
                    loginForm.style.display = 'none';
                    loginSuccessBlock.style.display = 'block';
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.onclick = function() {
                            localStorage.removeItem('loggedIn');
                            loginSuccessBlock.style.display = 'none';
                            loginForm.style.display = '';
                        };
                    }
                }
                closeAccountModal = document.getElementById('close-account-modal');
                if (closeAccountModal) {
                    closeAccountModal.onclick = function() {
                        accountModal.style.display = 'none';
                    };
                }
            });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accountModal && accountModal.style.display === 'block') {
            accountModal.style.display = 'none';
        }
    });

    const backgroundTools = document.querySelectorAll('.tool-bg');
    
    backgroundTools.forEach(tool => {
        const category = tool.getAttribute('data-category');
        
        tool.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tool-tooltip';
            tooltip.textContent = category;
            tooltip.style.cssText = `
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 215, 0, 0.95);
                color: #000;
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12px;
                white-space: nowrap;
                z-index: 100;
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
            `;
            tool.appendChild(tooltip);
        });
        
        tool.addEventListener('mouseleave', () => {
            const tooltip = tool.querySelector('.tool-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
        
        tool.addEventListener('click', () => {
            alert(`Opening ${category} category...\n\nThis would redirect to the category page.`);
        });
    });

    const body = document.body;
    let intensity = 0;
    const maxIntensity = 0.3;

    function updateGradient() {
        intensity = (intensity + 0.003) % (2 * Math.PI);
        const currentIntensity = Math.abs(Math.sin(intensity)) * maxIntensity;

        const darkShade1 = `rgba(10, 10, 10, ${1 - currentIntensity})`;
        const darkShade2 = `rgba(26, 26, 26, ${1 - currentIntensity * 0.5})`;

        body.style.background = `
            linear-gradient(
                135deg,
                ${darkShade1},
                ${darkShade2},
                #0a0a0a,
                #1a1a1a
            )
        `;
        body.style.backgroundSize = '400% 400%';

        requestAnimationFrame(updateGradient);
    }

    updateGradient();

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(255, 215, 0, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });

    const searchInput = document.querySelector('.search-input');
    const ghost = document.querySelector('.search-ghost');
    
    if (searchInput && ghost) {
        function updateGhost() {
            const hasText = searchInput.value.trim().length > 0;
            if (hasText) {
                ghost.style.opacity = '0';
                ghost.style.display = 'none';
            } else {
                ghost.style.opacity = '0.8';
                ghost.style.display = 'inline-block';
                ghost.classList.remove('pos-left');
                ghost.classList.add('pos-right');
            }
        }
        
        updateGhost();
        searchInput.addEventListener('input', updateGhost);
    }

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

    const drillImage = document.querySelector('.drill-image');
    const heroTitle = document.querySelector('.hero-title');
    
    if (drillImage && heroTitle) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            drillImage.style.transform = `translateY(${scrolled * parallaxSpeed}px) rotate(-5deg)`;
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
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    svg.style.fill = 'currentColor';
                }
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    alert(`Searching for: "${query}"\n\nThis is a demo. Real search would be implemented here.`);
                }
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    const cartBadge = document.querySelector('.badge');
    const cartButton = document.querySelector('[title="Cart"]');
    
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            alert(`Cart contains ${cartBadge ? cartBadge.textContent : '0'} item(s)`);
        });
    }
});