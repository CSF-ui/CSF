document.addEventListener("DOMContentLoaded", function() {
    
    // 1. MOBILE NAVBAR TOGGLE & AUTO CLOSE ON CLICK
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');
    const menuLinks = document.querySelectorAll('#nav-links a');
    const closeMenuBtn = document.getElementById('close-menu');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.add('active');
        });

        // Isara kapag pinindot ang alinmang link (Home, About, etc.)[cite: 3]
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        // Isara kapag pinindot ang X button
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        }
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

    // 3. LIGHTBOX GALLERY
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const galleryImages = document.querySelectorAll(".hidden-gallery-pool .gallery-img");
    const albumCover = document.querySelector(".gallery-album-preview");
    
    let currentIndex = 0;

    function showImage(index) {
        if (galleryImages.length > 0) {
            lightboxImg.src = galleryImages[index].src;
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
        currentIndex = (currentIndex + 1) % galleryImages.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
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
            if (e.target !== lightboxImg && e.target !== nextBtn && e.target !== prevBtn) {
                lightbox.style.display = "none";
            }
        });
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