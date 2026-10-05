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

    // 3. FB & MESSENGER / SAFARI SAFE COUNTDOWN TIMER LOGIC
    const countdownContainer = document.querySelector('.countdown-container');
    const celebrationBanner = document.getElementById('celebration-started-banner');
    const targetDateNote = document.getElementById('target-date-note');
    
    if (countdownContainer) {
        const targetDateString = countdownContainer.getAttribute('data-target-date');
        
        let targetDate;
        if (targetDateString) {
            const parts = targetDateString.split(/[-T:]/);
            if (parts.length >= 5) {
                targetDate = new Date(
                    parseInt(parts[0], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[2], 10),
                    parseInt(parts[3], 10),
                    parseInt(parts[4], 10),
                    parts[5] ? parseInt(parts[5], 10) : 0
                ).getTime();
            } else {
                targetDate = new Date(targetDateString.replace(/-/g, "/")).getTime();
            }
        }

        if (targetDate && !isNaN(targetDate)) {
            const daysEl = document.getElementById("days");
            const hoursEl = document.getElementById("hours");
            const minsEl = document.getElementById("minutes");
            const secsEl = document.getElementById("seconds");

            const updateCountdown = setInterval(function() {
                const now = new Date().getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    clearInterval(updateCountdown);
                    
                    if (countdownContainer) countdownContainer.style.display = "none";
                    if (targetDateNote) targetDateNote.style.display = "none";
                    if (celebrationBanner) celebrationBanner.style.display = "block";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
                if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
                if (minsEl) minsEl.innerText = minutes < 10 ? "0" + minutes : minutes;
                if (secsEl) secsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
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
    const albumCover = document.getElementById("album-preview-trigger");
    
    const galleryData = [
        { src: "assets/images/Sunday Service.jpg", name: "Sunday Service" },
        { src: "assets/images/Pistang Kristiyano.jpg", name: "Pistang Kristiyano" },
        { src: "assets/images/Youth Revival.jpg", name: "Youth Revival" },
        { src: "assets/images/Bible Study.jpg", name: "Bible Study" },
        { src: "assets/images/Online Bible Study.jpg", name: "Online Bible Study" },
        { src: "assets/images/Elders.jpg", name: "Elders" },
        { src: "assets/images/Youth.jpg", name: "Youth" },
        { src: "assets/images/Childrens.jpg", name: "Childrens" },
        { src: "assets/images/Recital.jpg", name: "Recital" },
        { src: "assets/images/DVBS.jpg", name: "DVBS" },
        { src: "assets/images/Outreach.jpg", name: "Outreach" },
        { src: "assets/images/Outreach 1.jpg", name: "Outreach Program" },
        { src: "assets/images/Outreach 2.jpg", name: "Outreach Community" },
        { src: "assets/images/Bonding.jpg", name: "Baptism" },
        { src: "assets/images/Christmas Party.jpg", name: "Christmas Party" },
        { src: "assets/images/CSF Members.jpg", name: "CSF Members" },
        { src: "assets/images/CSF Members 1.jpg", name: "CSF Members Gathering" },
        { src: "assets/images/Outing.jpg", name: "Outing" }
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

    if (albumCover) {
        albumCover.addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.getAttribute("data-index"), 10) || 0;
            openLightbox(index);
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