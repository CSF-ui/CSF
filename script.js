document.addEventListener("DOMContentLoaded", function() {
    
    // 0. SUBTLE FLOATING CELEBRATION PARTICLES
    const heroSection = document.getElementById('home');
    const particleCanvas = document.getElementById('hero-particles');
    if (particleCanvas && heroSection) {
        const ctx = particleCanvas.getContext('2d');
        let width = particleCanvas.width = heroSection.offsetWidth;
        let height = particleCanvas.height = heroSection.offsetHeight;
        let particles = [];

        function initParticles() {
            width = particleCanvas.width = heroSection.offsetWidth;
            height = particleCanvas.height = heroSection.offsetHeight;
            particles = [];
            const count = Math.min(35, Math.floor(width / 30));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2.2 + 0.8,
                    speedY: Math.random() * 0.35 + 0.12,
                    speedX: (Math.random() - 0.5) * 0.2,
                    alpha: Math.random() * 0.6 + 0.2,
                    fadeSpeed: Math.random() * 0.008 + 0.003,
                    fadeDir: Math.random() > 0.5 ? 1 : -1
                });
            }
        }

        initParticles();
        window.addEventListener('resize', initParticles);

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.y -= p.speedY;
                p.x += p.speedX;
                p.alpha += p.fadeSpeed * p.fadeDir;
                if (p.alpha <= 0.15) p.fadeDir = 1;
                if (p.alpha >= 0.8) p.fadeDir = -1;

                if (p.y < 0) {
                    p.y = height + 5;
                    p.x = Math.random() * width;
                }
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 208, 153, ${p.alpha})`;
                ctx.fill();
            }
            requestAnimationFrame(drawParticles);
        }

        drawParticles();
    }

    // 1. MOBILE NAVBAR TOGGLE & CLOSE
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');
    const menuLinks = document.querySelectorAll('#nav-links a');
    const closeMenuBtn = document.getElementById('close-menu');

    function closeNav() {
        if (navLinksContainer) {
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = "";
        }
    }

    function openNav() {
        if (navLinksContainer) {
            navLinksContainer.classList.add('active');
            document.body.style.overflow = "hidden";
        }
    }

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinksContainer.classList.contains('active')) {
                closeNav();
            } else {
                openNav();
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeNav);
        }

        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active')) {
                if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
                    closeNav();
                }
            }
        });
    }

    // 2. ACTIVE NAVIGATION ITEM ON SCROLL
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-item");

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove("active");
                    if (item.getAttribute("href") === `#${sectionId}`) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightNavOnScroll);

    // 3. FB & MESSENGER / SAFARI SAFE COUNTDOWN TIMER LOGIC (PHILIPPINE TIMEZONE SAFE)
    const countdownContainer = document.querySelector('.countdown-container');
    const celebrationBanner = document.getElementById('celebration-started-banner');
    const targetDateNote = document.getElementById('target-date-note');
    
    if (countdownContainer) {
        const targetDateString = countdownContainer.getAttribute('data-target-date') || "2026-11-08T09:00:00+08:00";
        
        function getTargetTimestamp(dateStr) {
            const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
                const y = parseInt(match[1], 10);
                const m = parseInt(match[2], 10) - 1;
                const d = parseInt(match[3], 10);
                const h = parseInt(match[4], 10) - 8; // Manila is UTC+8
                const min = parseInt(match[5], 10);
                const s = parseInt(match[6], 10);
                return Date.UTC(y, m, d, h, min, s);
            }
            const parsed = Date.parse(dateStr);
            return isNaN(parsed) ? Date.UTC(2026, 10, 8, 1, 0, 0) : parsed;
        }

        const targetDate = getTargetTimestamp(targetDateString);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");
        let lastSeconds = null;

        function updateCountdown() {
            const now = Date.now();
            const distance = targetDate - now;

            if (distance <= 0) {
                if (countdownContainer) countdownContainer.style.display = "none";
                if (targetDateNote) targetDateNote.style.display = "none";
                if (celebrationBanner) celebrationBanner.style.display = "block";
                return true;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
            if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
            if (minsEl) minsEl.innerText = minutes < 10 ? "0" + minutes : minutes;
            if (secsEl) {
                const sText = seconds < 10 ? "0" + seconds : seconds;
                if (lastSeconds !== seconds) {
                    lastSeconds = seconds;
                    secsEl.innerText = sText;
                    secsEl.classList.remove('tick-pulse');
                    void secsEl.offsetWidth; // trigger reflow
                    secsEl.classList.add('tick-pulse');
                }
            }
            return false;
        }

        if (!updateCountdown()) {
            const countdownInterval = setInterval(function() {
                if (updateCountdown()) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }
    }

    // 4. LIGHTBOX GALLERY & SWIPE GESTURE WITH SMOOTH FADE
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("close-lightbox");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    const galleryData = [
        { src: "assets/images/sunday-service.jpg", name: "Sunday Service" },
        { src: "assets/images/pistang-kristiyano.jpg", name: "Pistang Kristiyano" },
        { src: "assets/images/youth-revival.jpg", name: "Youth Revival" },
        { src: "assets/images/bible-study.jpg", name: "Bible Study" },
        { src: "assets/images/online-bible-study.jpg", name: "Online Bible Study" },
        { src: "assets/images/elders.jpg", name: "Elders" },
        { src: "assets/images/youth.jpg", name: "Youth" },
        { src: "assets/images/childrens.jpg", name: "Childrens" },
        { src: "assets/images/recital.jpg", name: "Recital" },
        { src: "assets/images/dvbs.jpg", name: "DVBS" },
        { src: "assets/images/outreach.jpg", name: "Outreach" },
        { src: "assets/images/outreach-1.jpg", name: "Outreach Program" },
        { src: "assets/images/outreach-2.jpg", name: "Outreach Community" },
        { src: "assets/images/bonding.jpg", name: "Baptism" },
        { src: "assets/images/christmas-party.jpg", name: "Christmas Party" },
        { src: "assets/images/csf-members.jpg", name: "CSF Members" },
        { src: "assets/images/csf-members-1.jpg", name: "CSF Members Gathering" },
        { src: "assets/images/outing.jpg", name: "Outing" }
    ];

    const lightboxCounter = document.getElementById("lightbox-counter");
    const albumCover = document.getElementById("album-preview-trigger");

    let currentIndex = 0;

    function showImage(index) {
        if (galleryData.length > 0 && lightboxImg && lightboxCaption) {
            lightboxImg.classList.remove("zoomed");
            lightboxImg.style.opacity = "0";
            setTimeout(() => {
                lightboxImg.src = galleryData[index].src;
                lightboxCaption.innerText = galleryData[index].name;
                if (lightboxCounter) {
                    lightboxCounter.innerText = `${index + 1} / ${galleryData.length}`;
                }
                lightboxImg.style.opacity = "1";
            }, 150);
            currentIndex = index;
        }
    }

    function openLightbox(index = 0) {
        if (lightbox) {
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
            showImage(index);
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove("active");
            if (lightboxImg) lightboxImg.classList.remove("zoomed");
            document.body.style.overflow = "";
        }
    }

    if (albumCover) {
        albumCover.addEventListener("click", () => openLightbox(0));
        albumCover.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(0);
            }
        });
    }

    // Zoom in / out on tap without flipping images
    if (lightboxImg) {
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation();
            lightboxImg.classList.toggle("zoomed");
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        showImage(currentIndex);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nextImage();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            prevImage();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg && e.target !== nextBtn && e.target !== prevBtn && e.target !== lightboxCaption && e.target !== lightboxCounter) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.classList.contains("active")) {
            if (e.key === "ArrowRight") {
                nextImage();
            } else if (e.key === "ArrowLeft") {
                prevImage();
            } else if (e.key === "Escape") {
                closeLightbox();
            }
        }
    });

    // 5. BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 6. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .section-subtitle, .timeline-item, .big-20, .program-summary-box, .pastor-grid, .guest-speaker, .contact-grid, .gallery-album-preview'
    );
    
    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.1, 
            rootMargin: "0px 0px -30px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                }
            });
        }, appearOptions);

        elementsToAnimate.forEach(el => {
            el.classList.add('fade-in-scroll');
            appearOnScroll.observe(el);
        });
    } else {
        elementsToAnimate.forEach(el => el.classList.add('appear'));
    }

});