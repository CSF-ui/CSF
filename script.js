document.addEventListener("DOMContentLoaded", function() {
    
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
        
        let targetDate = Date.parse(targetDateString);
        if (isNaN(targetDate)) {
            // Fallback: 2026-11-08 09:00:00 Philippine Time (UTC+8) -> 01:00 UTC
            targetDate = Date.UTC(2026, 10, 8, 1, 0, 0);
        }

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

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
            if (secsEl) secsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
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

    let currentIndex = 0;

    function showImage(index) {
        if (galleryData.length > 0 && lightboxImg && lightboxCaption) {
            lightboxImg.style.opacity = "0";
            setTimeout(() => {
                lightboxImg.src = galleryData[index].src;
                lightboxCaption.innerText = galleryData[index].name;
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
            document.body.style.overflow = "";
        }
    }

    const galleryTriggers = document.querySelectorAll(".gallery-card, #album-preview-trigger");
    galleryTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const index = parseInt(trigger.getAttribute("data-index"), 10) || 0;
            openLightbox(index);
        });
        trigger.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const index = parseInt(trigger.getAttribute("data-index"), 10) || 0;
                openLightbox(index);
            }
        });
    });

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
            if (e.target !== lightboxImg && e.target !== nextBtn && e.target !== prevBtn && e.target !== lightboxCaption) {
                closeLightbox();
            }
        });
    }

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
            nextImage();
        }
        if (touchEndX > touchStartX + threshold) {
            prevImage();
        }
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
        '.section-title, .section-subtitle, .timeline-item, .big-20, .program-summary-box, .pastor-grid, .guest-speaker, .contact-grid, .gallery-grid, .gallery-actions'
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