import './style.css'
import * as THREE from 'three'

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 01. Theme Toggler
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    if (initialTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            document.body.classList.toggle('light-theme', !isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // =========================================================================
    // 02. Mobile Navigation Toggle
    // =========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        mainNav.querySelectorAll('a').forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                });
            }
        });
    }

    // =========================================================================
    // 02.5 Dropdown Menu Handler
    // =========================================================================
    const dropdownWrapper = document.querySelector('.nav-dropdown-wrapper');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.nav-dropdown-menu');

    if (dropdownWrapper && dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 || e.pointerType === 'touch') {
                e.preventDefault();
                dropdownMenu.classList.toggle('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdownWrapper.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // =========================================================================
    // 03. Three.js Hero 3D Tech Globe & Gear Node Mesh
    // =========================================================================
    const initHeroThreeScene = () => {
        const canvas = document.getElementById('hero-three-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        let width = container.offsetWidth || window.innerWidth;
        let height = container.offsetHeight || window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 24);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const cyanLight = new THREE.PointLight(0x00b4d8, 4, 100);
        cyanLight.position.set(12, 10, 10);
        scene.add(cyanLight);

        const blueLight = new THREE.PointLight(0x0077b6, 3, 100);
        blueLight.position.set(-10, -10, 10);
        scene.add(blueLight);

        // ── 3D Tech Globe Group ──────────────────────────────────────────
        const globeGroup = new THREE.Group();
        globeGroup.position.set(window.innerWidth > 992 ? 8 : 0, 1, 0);
        scene.add(globeGroup);

        // Outer Tech Wireframe Sphere
        const globeGeo = new THREE.IcosahedronGeometry(5.8, 2);
        const globeMat = new THREE.MeshStandardMaterial({
            color: 0x00b4d8,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
            metalness: 0.8,
            roughness: 0.2
        });
        const globeMesh = new THREE.Mesh(globeGeo, globeMat);
        globeGroup.add(globeMesh);

        // Glowing Node Points
        const nodeMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.28,
            transparent: true,
            opacity: 0.9
        });
        const nodePoints = new THREE.Points(globeGeo, nodeMat);
        globeGroup.add(nodePoints);

        // 3D Gear Rings (Matching Gear Graphic in Reference Image)
        const gearGeo = new THREE.TorusGeometry(8.2, 0.16, 16, 12);
        const gearMat = new THREE.MeshStandardMaterial({
            color: 0x00b4d8,
            metalness: 0.95,
            roughness: 0.1,
            emissive: 0x0077b6,
            emissiveIntensity: 0.5
        });

        const gearMesh1 = new THREE.Mesh(gearGeo, gearMat);
        gearMesh1.rotation.x = Math.PI / 3;
        globeGroup.add(gearMesh1);

        const gearMesh2 = new THREE.Mesh(gearGeo, gearMat);
        gearMesh2.rotation.y = Math.PI / 4;
        gearMesh2.rotation.x = -Math.PI / 6;
        globeGroup.add(gearMesh2);

        // Floating Node Particles
        const particleCount = 1200;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const r = 15 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00b4d8,
            size: 0.18,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
        });

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Smooth Globe Rotation
            globeGroup.rotation.y = elapsed * 0.2 + mouseX * 2;
            globeGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.15 + mouseY * 2;

            gearMesh1.rotation.z = elapsed * 0.3;
            gearMesh2.rotation.z = -elapsed * 0.25;

            particles.rotation.y = elapsed * 0.015;

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            width = container.offsetWidth || window.innerWidth;
            height = container.offsetHeight || window.innerHeight;

            globeGroup.position.set(window.innerWidth > 992 ? 8 : 0, 1, 0);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    };

    initHeroThreeScene();

    // =========================================================================
    // 03.5 Floating Robot AI Assistant Widget Logic
    // =========================================================================
    const robotBtn = document.getElementById('ai-robot-btn');
    const chatPopup = document.getElementById('ai-chat-popup');
    const closeChatBtn = document.getElementById('close-chat-popup');
    const miniChipBtns = document.querySelectorAll('.chip-btn-mini');

    if (robotBtn && chatPopup) {
        robotBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('active');
        });
    }

    if (closeChatBtn && chatPopup) {
        closeChatBtn.addEventListener('click', () => {
            chatPopup.classList.remove('active');
        });
    }

    // =========================================================================
    // 04. About Image Slider Script
    // =========================================================================
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const slides = document.querySelectorAll('.slider-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    // =========================================================================
    // 04.5 Services Horizontal Carousel Script
    // =========================================================================
    const servicesPrevBtn = document.getElementById('services-prev');
    const servicesNextBtn = document.getElementById('services-next');
    const servicesGrid = document.querySelector('.services-cards-grid');

    if (servicesPrevBtn && servicesNextBtn && servicesGrid) {
        servicesPrevBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: -320, behavior: 'smooth' });
        });

        servicesNextBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // =========================================================================
    // 05. ROI Analytics Calculator Logic
    // =========================================================================
    const analyticsForm = document.getElementById('analytics-form');
    const analyticsResults = document.getElementById('analytics-results');
    const recalculateBtn = document.getElementById('recalculate-btn');

    if (analyticsForm && analyticsResults) {
        analyticsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const bizName = document.getElementById('biz-name').value || 'Target Client';
            const location = document.getElementById('biz-location').value || 'Target Area';
            const bizType = document.getElementById('biz-type').value;

            const seed = (bizName.length * 11) + (location.length * 9);
            let baseTAM = 1800000 + (seed * 95000);
            let baseCustomers = 1500 + (seed * 60);
            let baseProfit = Math.round(baseTAM * 0.20);

            if (bizType === 'tech') {
                baseTAM *= 2.8;
                baseCustomers *= 2.5;
                baseProfit *= 2.5;
            }

            document.getElementById('result-biz-name').textContent = `Analysis Report: ${bizName} (${location})`;

            analyticsResults.style.display = 'block';
            analyticsResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            animateNumber('stat-tam', baseTAM, '₹', true);
            animateNumber('stat-customers', baseCustomers, '', false);
            animateNumber('stat-profit', baseProfit, '₹', true);
        });

        if (recalculateBtn) {
            recalculateBtn.addEventListener('click', () => {
                analyticsResults.style.display = 'none';
                analyticsForm.reset();
            });
        }
    }

    function animateNumber(elementId, targetValue, prefix = '', isCurrency = false) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let start = 0;
        const duration = 1000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(start + (targetValue - start) * easeProgress);

            if (isCurrency) {
                el.textContent = `${prefix}${currentVal.toLocaleString('en-IN')}`;
            } else {
                el.textContent = `${prefix}${currentVal.toLocaleString()}`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // =========================================================================
    // 06. AI Assistant Chat Engine
    // =========================================================================
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const clearChatBtn = document.getElementById('clear-chat');
    const chipBtns = document.querySelectorAll('.chip-btn-clean');

    const botResponses = {
        conversion: "Aparox builds data-backed web architecture, fast 3D WebGL interfaces, and high-contrast CTA layouts that average a 2.4x increase in conversion rates.",
        tech: "We specialize in custom web applications using Three.js WebGL, Vite, clean HTML/CSS, and automated APIs. All builds achieve Lighthouse performance scores above 98/100.",
        timeline: "Standard project timelines range from 2 to 4 weeks, including market TAM analysis, UI/UX prototyping, 3D visual integration, and full deployment.",
        default: "Thank you for reaching out! Aparox AI merges custom web engineering with real-world market intelligence. Would you like to request a consultation or run an ROI calculation above?"
    };

    function appendMessage(text, isUser = false) {
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = isUser ? '👤' : '⚡';

        const content = document.createElement('div');
        content.className = 'message-content';
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage(query) {
        if (!query.trim()) return;

        appendMessage(query, true);
        if (chatInput) chatInput.value = '';

        setTimeout(() => {
            const q = query.toLowerCase();
            let reply = botResponses.default;

            if (q.includes('conversion') || q.includes('increase') || q.includes('rate')) {
                reply = botResponses.conversion;
            } else if (q.includes('tech') || q.includes('stack') || q.includes('code')) {
                reply = botResponses.tech;
            } else if (q.includes('timeline') || q.includes('time') || q.includes('long')) {
                reply = botResponses.timeline;
            }

            appendMessage(reply, false);
        }, 500);
    }

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUserMessage(chatInput.value);
        });
    }

    const allChipBtns = document.querySelectorAll('.chip-btn-clean, .chip-btn-mini');
    allChipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            if (prompt) handleUserMessage(prompt);
        });
    });

    if (clearChatBtn && chatMessages) {
        clearChatBtn.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="avatar">⚡</div>
                    <div class="message-content">
                        <p>Chat cleared. How can Aparox AI help you today?</p>
                    </div>
                </div>
            `;
        });
    }

    // =========================================================================
    // 07. Contact Form Handling
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.className = 'form-status success';
            formStatus.textContent = '✓ Request received! Our engineering team will contact you within 24 hours.';
            contactForm.reset();
        });
    }

    // =========================================================================
    // 08. Hero Interactive Prompt Box Handlers
    // =========================================================================
    const heroAiForm = document.getElementById('hero-ai-form');
    const heroPromptInput = document.getElementById('hero-prompt-input');
    const heroChipAudit = document.getElementById('hero-chip-audit');
    const heroChipRefresh = document.getElementById('hero-chip-refresh');
    const heroChipFullstack = document.getElementById('hero-chip-fullstack');

    if (heroAiForm && heroPromptInput) {
        heroAiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = heroPromptInput.value.trim();
            if (text) {
                if (chatPopup) chatPopup.classList.add('active');
                handleUserMessage(text);
                heroPromptInput.value = '';
            }
        });
    }

    if (heroChipAudit) {
        heroChipAudit.addEventListener('click', () => {
            const target = document.getElementById('analytics');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (heroChipRefresh) {
        heroChipRefresh.addEventListener('click', () => {
            if (chatPopup) chatPopup.classList.add('active');
            handleUserMessage("How does Aparox AI refresh existing web designs?");
        });
    }

    if (heroChipFullstack) {
        heroChipFullstack.addEventListener('click', () => {
            const target = document.getElementById('services');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

});
