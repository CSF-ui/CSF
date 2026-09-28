document.addEventListener("DOMContentLoaded", function() {
    
    // 1. MOBILE NAVBAR TOGGLE & CLOSE
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');
    const menuLinks = document.querySelectorAll('#nav-links a');
    const closeMenuBtn = document.getElementById('close-menu');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.add('active');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active')) {
                if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    }

    // 2. COUNTDOWN TIMER LOGIC
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (countdownContainer) {
        const targetDateString = countdownContainer.getAttribute('data-target-date');
        const targetDate = new Date(targetDateString).getTime();

        const updateCountdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(updateCountdown);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days < 10 ? "0" + days : days;
            document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
        }, 1000);
    }

    // 3. LIGHTBOX GALLERY & SWIPE GESTURE
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
        if (galleryData.length > 0) {
            lightboxImg.src = galleryData[index].src;
            lightboxCaption.innerText = galleryData[index].name;
            currentIndex = index;
        }
    }

    if (albumCover) {
        albumCover.addEventListener("click", function() {
            lightbox.style.display = "flex"; 
            showImage(0);
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
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg && e.target !== nextBtn && e.target !== prevBtn && e.target !== lightboxCaption) {
                lightbox.style.display = "none";
            }
        });
    }

    // Touch Swipe Gestures para sa Mobile Phones
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
            nextImage(); // Swipe Kaliwa -> Next
        }
        if (touchEndX > touchStartX + threshold) {
            prevImage(); // Swipe Pakanan -> Previous
        }
    }

    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") {
                nextImage();
            } else if (e.key === "ArrowLeft") {
                prevImage();
            } else if (e.key === "Escape") {
                lightbox.style.display = "none";
            }
        }
    });

    // 4. SCROLL ANIMATIONS
    const elementsToAnimate = document.querySelectorAll('.about-card, .timeline-item, .gallery-album-preview, .pastor-grid, .contact-grid');
    
    const appearOptions = {
        threshold: 0, 
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            } else {
                entry.target.classList.remove('appear');
            }
        });
    }, appearOptions);

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-scroll');
        appearOnScroll.observe(el);
    });

});