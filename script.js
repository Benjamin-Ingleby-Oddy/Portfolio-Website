document.addEventListener("DOMContentLoaded", () => {

    // Theme Icons
    const sunIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    // Theme Toggle
    let isLightMode = document.documentElement.classList.contains('light-mode');
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.innerHTML = isLightMode ? moonIcon : sunIcon;
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.documentElement.classList.toggle('light-mode');
            isLightMode = document.documentElement.classList.contains('light-mode');
            themeBtn.innerHTML = isLightMode ? moonIcon : sunIcon;
        });
    }

    // Split Nav Logic
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');
    const contentArea = document.querySelector('.content-area');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active-section');
            });

            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                contentArea.scrollTop = 0; // Reset scroll on view change
            }
        });
    });

    // Portal Hover Logic
    const portalLinks = document.querySelectorAll('.portal-link');
    const portalContents = document.querySelectorAll('.portal-content');

    portalLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            portalLinks.forEach(l => l.classList.remove('active'));
            portalContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            const targetId = link.getAttribute('data-id');
            const content = document.getElementById(targetId + '-content');
            if (content) content.classList.add('active');
        });
    });

    // Particles Background Effect (100% STATIC to fix cutoff and tearing cleanly)
    const canvas = document.getElementById('particles-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        let particleCount = 150;
        const connectionDistance = 150;

        window.recalParticles = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            // Adjust density purely relative to viewport
            particleCount = Math.floor((width * height) / 10000);
            particleCount = Math.min(particleCount, 300);
            initParticles();
        };


        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLightMode ? 'rgba(0, 128, 0, 0.8)' : 'rgba(46, 160, 67, 0.7)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        let alpha = 1 - distance / connectionDistance;
                        ctx.strokeStyle = isLightMode ? `rgba(0, 128, 0, ${alpha})` : `rgba(46, 160, 67, ${alpha * 0.8})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', window.recalParticles);
        window.recalParticles();
    }
});
