/**
 * ============================================================================
 * CSF CHURCH - 20TH ANNIVERSARY MAIN JAVASCRIPT
 * Modular Architecture:
 *   0. initCrossBrowserViewportGuard() - In-App Browser (Messenger/FB) & mobile viewport guard
 *   1. initHeroParticles()             - Floating golden celebration particles
 *   2. initNavbarAndScrollProgress()   - Scroll progress bar & navbar glass state
 *   3. initMobileNavigation()          - Mobile drawer menu & ARIA states
 *   4. initScrollSpy()                 - Active section link highlighting
 *   5. initCountdownTimer()            - Philippine Time (+08:00) live countdown
 *   6. initLightboxGallery()           - Photo gallery, zoom toggle & smart mobile swipe
 *   7. initShareInvitation()           - Native Web Share API, modal dialog & 1-click clipboard copy
 *   8. initBackToTopButton()           - Smooth scroll-to-top button
 *   9. initScrollRevealAnimations()    - IntersectionObserver scroll animations
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    initCrossBrowserViewportGuard();
    initAutoVersionSync();
    initHeroParticles();
    initNavbarAndScrollProgress();
    initMobileNavigation();
    initScrollSpy();
    initCountdownTimer();
    initLightboxGallery();
    initShareInvitation();
    initBackToTopButton();
    initScrollRevealAnimations();
});

/* ============================================================================
   0. CROSS-BROWSER & IN-APP WEBVIEW VIEWPORT GUARD (MESSENGER / FB / SAFARI / CHROME)
   ============================================================================ */
function initCrossBrowserViewportGuard() {
    const root = document.documentElement;
    const ua = navigator.userAgent || "";
    const isInAppBrowser = /FBAN|FBAV|Messenger|Instagram|Line|MicroMessenger/i.test(ua);

    if (isInAppBrowser) {
        root.classList.add("is-inapp-browser");
    }

    let lastWidth = window.innerWidth;

    function syncViewportHeight(forceUpdate = false) {
        const currentWidth = window.innerWidth;
        if (forceUpdate || Math.abs(currentWidth - lastWidth) > 20) {
            lastWidth = currentWidth;
            root.style.setProperty("--app-height", `${window.innerHeight}px`);
        }
    }

    syncViewportHeight(true);

    window.addEventListener("resize", () => syncViewportHeight(false), { passive: true });
    window.addEventListener(
        "orientationchange",
        () => {
            setTimeout(() => syncViewportHeight(true), 150);
        },
        { passive: true }
    );

    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.addEventListener("click", (e) => {
            const rawHref = (registerBtn.getAttribute("href") || "").trim();
            if (!rawHref || rawHref === "#") {
                e.preventDefault();
            } else if (/^https?:\/\//i.test(rawHref)) {
                registerBtn.setAttribute("target", "_blank");
                registerBtn.setAttribute("rel", "noopener noreferrer");
            }
        });
    }
}

/* ============================================================================
   0B. AUTOMATIC LIVE VERSION & CACHE SYNC (NO MANUAL RELOAD NEEDED)
   ============================================================================ */
function initAutoVersionSync() {
    const root = document.documentElement;
    const currentVersion = root.getAttribute("data-app-version") || "2026.10";
    let baselineSignature = null;
    let isChecking = false;

    try {
        const savedScrollY = sessionStorage.getItem("csf_auto_sync_scroll_y");
        if (savedScrollY !== null) {
            sessionStorage.removeItem("csf_auto_sync_scroll_y");
            const targetY = parseInt(savedScrollY, 10);
            if (!Number.isNaN(targetY) && targetY > 0) {
                window.scrollTo({ top: targetY, behavior: "instant" });
            }
        }
    } catch (_) {
        // Ignore sessionStorage restrictions in strict privacy modes
    }

    async function checkServerVersion() {
        if (isChecking || document.visibilityState === "hidden") return;
        if (window.location.protocol === "file:") return;

        isChecking = true;
        try {
            const checkUrl = `${window.location.pathname}?_nocache=${Date.now()}`;
            const response = await fetch(checkUrl, {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache"
                }
            });

            if (!response.ok) return;

            const htmlText = await response.text();
            const versionMatch = htmlText.match(/data-app-version=["']([^"']+)["']/i);
            const remoteVersion = versionMatch ? versionMatch[1] : currentVersion;
            const etag = response.headers.get("etag") || "";
            const lastModified = response.headers.get("last-modified") || "";
            const signature = `${remoteVersion}|${etag}|${lastModified}|${htmlText.length}`;

            if (baselineSignature === null) {
                baselineSignature = signature;
                return;
            }

            if (remoteVersion !== currentVersion || signature !== baselineSignature) {
                try {
                    sessionStorage.setItem("csf_auto_sync_scroll_y", String(window.scrollY || 0));
                } catch (_) {}
                window.location.reload();
            }
        } catch (_) {
            // Silently ignore offline/network errors
        } finally {
            isChecking = false;
        }
    }

    // Establish baseline signature after load
    setTimeout(checkServerVersion, 2500);

    // Check automatically when user returns to tab or opens from Messenger/Browser history
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            checkServerVersion();
        }
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            checkServerVersion();
        }
    });

    window.addEventListener("focus", checkServerVersion, { passive: true });

    // Periodic background check every 45 seconds while page is open
    setInterval(checkServerVersion, 45000);
}

/* ============================================================================
   1. HERO FLOATING CELEBRATION PARTICLES
   ============================================================================ */
function initHeroParticles() {
    const heroSection = document.getElementById("home");
    const particleCanvas = document.getElementById("hero-particles");
    if (!particleCanvas || !heroSection) return;

    const ctx = particleCanvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];

    function createParticles() {
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

    function renderParticles() {
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

        requestAnimationFrame(renderParticles);
    }

    createParticles();
    window.addEventListener("resize", createParticles);
    renderParticles();
}

/* ============================================================================
   2. NAVBAR GLASS EFFECT & TOP SCROLL PROGRESS BAR
   ============================================================================ */
function initNavbarAndScrollProgress() {
    const navbar = document.getElementById("navbar");
    const scrollProgress = document.getElementById("scroll-progress");

    function updateNavbarAndProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }

        if (scrollProgress && docHeight > 0) {
            const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    }

    window.addEventListener("scroll", updateNavbarAndProgress, { passive: true });
    updateNavbarAndProgress();
}

/* ============================================================================
   3. MOBILE NAVIGATION DRAWER MODULE
   ============================================================================ */
function initMobileNavigation() {
    const hamburger = document.getElementById("hamburger");
    const navLinksContainer = document.getElementById("nav-links");
    const navBackdrop = document.getElementById("nav-backdrop");
    const menuLinks = document.querySelectorAll("#nav-links a");
    const closeMenuBtn = document.getElementById("close-menu");

    if (!hamburger || !navLinksContainer) return;

    function openNav() {
        navLinksContainer.classList.add("active");
        hamburger.classList.add("is-active");
        hamburger.setAttribute("aria-expanded", "true");
        if (navBackdrop) navBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeNav() {
        navLinksContainer.classList.remove("active");
        hamburger.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        if (navBackdrop) navBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (navLinksContainer.classList.contains("active")) {
            closeNav();
        } else {
            openNav();
        }
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener("click", closeNav);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener("click", closeNav);
    }

    document.addEventListener("click", (e) => {
        if (
            navLinksContainer.classList.contains("active") &&
            !navLinksContainer.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeNav();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinksContainer.classList.contains("active")) {
            closeNav();
            hamburger.focus();
        }
    });
}

/* ============================================================================
   4. ACTIVE NAVIGATION LINK SCROLL-SPY MODULE
   ============================================================================ */
function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-item");

    if (!sections.length || !navItems.length) return;

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 110;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach((item) => {
                    item.classList.remove("active");
                    if (item.getAttribute("href") === `#${sectionId}`) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightNavOnScroll, { passive: true });
    highlightNavOnScroll();
}

/* ============================================================================
   5. COUNTDOWN TIMER MODULE (PHILIPPINE TIMEZONE UTC+8 SAFE)
   ============================================================================ */
function initCountdownTimer() {
    const countdownContainer = document.getElementById("countdown-container");
    const celebrationBanner = document.getElementById("celebration-started-banner");
    const targetDateNote = document.getElementById("target-date-note");

    if (!countdownContainer) return;

    const targetDateString =
        countdownContainer.getAttribute("data-target-date") || "2026-11-08T09:00:00+08:00";

    function parseTargetTimestamp(dateStr) {
        const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const day = parseInt(match[3], 10);
            const hourUtc = parseInt(match[4], 10) - 8; // Manila is UTC+8
            const minute = parseInt(match[5], 10);
            const second = parseInt(match[6], 10);
            return Date.UTC(year, month, day, hourUtc, minute, second);
        }
        const parsed = Date.parse(dateStr);
        return isNaN(parsed) ? Date.UTC(2026, 10, 8, 1, 0, 0) : parsed;
    }

    const targetTimestamp = parseTargetTimestamp(targetDateString);
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");
    let lastSeconds = null;

    function formatTwoDigits(value) {
        return value < 10 ? `0${value}` : `${value}`;
    }

    function updateCountdown() {
        const distance = targetTimestamp - Date.now();

        if (distance <= 0) {
            countdownContainer.classList.add("is-hidden");
            if (targetDateNote) targetDateNote.classList.add("is-hidden");
            if (celebrationBanner) {
                celebrationBanner.hidden = false;
                celebrationBanner.classList.remove("is-hidden");
            }
            return true;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = formatTwoDigits(days);
        if (hoursEl) hoursEl.innerText = formatTwoDigits(hours);
        if (minsEl) minsEl.innerText = formatTwoDigits(minutes);

        if (secsEl && lastSeconds !== seconds) {
            lastSeconds = seconds;
            secsEl.innerText = formatTwoDigits(seconds);
            secsEl.classList.remove("tick-pulse");
            void secsEl.offsetWidth;
            secsEl.classList.add("tick-pulse");
        }

        return false;
    }

    if (!updateCountdown()) {
        const timerInterval = setInterval(() => {
            if (updateCountdown()) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
}

/* ============================================================================
   6. LIGHTBOX GALLERY MODULE (KEYBOARD, ZOOM TOGGLE & SMART MOBILE SWIPE)
   ============================================================================ */
function initLightboxGallery() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("close-lightbox");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const albumCover = document.getElementById("album-preview-trigger");

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    const galleryData = [
        { src: "assets/images/sunday-service.jpg", name: "Sunday Service" },
        { src: "assets/images/pistang-kristiyano.jpg", name: "Pistang Kristiyano" },
        { src: "assets/images/youth-revival.jpg", name: "Youth Camp" },
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
    let isZoomed = false;
    let panX = 0;
    let panY = 0;
    let wasDraggingOrSwiping = false;

    function preloadAdjacentImages(index) {
        const nextIdx = (index + 1) % galleryData.length;
        const prevIdx = (index - 1 + galleryData.length) % galleryData.length;
        [nextIdx, prevIdx].forEach((idx) => {
            const preloadImg = new Image();
            preloadImg.src = galleryData[idx].src;
        });
    }

    function applyTransform() {
        if (isZoomed) {
            lightboxImg.classList.add("zoomed");
            lightboxImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(1.75)`;
        } else {
            lightboxImg.classList.remove("zoomed");
            lightboxImg.classList.remove("dragging");
            lightboxImg.style.transform = "";
        }
    }

    function resetZoom() {
        isZoomed = false;
        panX = 0;
        panY = 0;
        applyTransform();
    }

    function toggleZoom() {
        if (isZoomed) {
            resetZoom();
        } else {
            isZoomed = true;
            panX = 0;
            panY = 0;
            applyTransform();
        }
    }

    function showImage(index) {
        if (!galleryData.length) return;
        resetZoom();
        lightboxImg.style.opacity = "0";

        setTimeout(() => {
            lightboxImg.src = galleryData[index].src;
            lightboxImg.alt = `${galleryData[index].name} - Church Memory Photo`;
            lightboxCaption.innerText = galleryData[index].name;
            lightboxImg.style.opacity = "1";
            preloadAdjacentImages(index);
        }, 140);

        currentIndex = index;
    }

    function openLightbox(index = 0) {
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        showImage(index);
        if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        resetZoom();
        document.body.style.overflow = "";
        if (albumCover) albumCover.focus();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        showImage(currentIndex);
    }

    // Open album via click or Enter/Space
    if (albumCover) {
        albumCover.addEventListener("click", () => openLightbox(0));
        albumCover.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(0);
            }
        });
    }

    // Tap / Click or Enter/Space on image to toggle zoom in & out (only if not swiping/dragging)
    lightboxImg.addEventListener("click", (e) => {
        e.stopPropagation();
        if (wasDraggingOrSwiping) {
            wasDraggingOrSwiping = false;
            return;
        }
        toggleZoom();
    });

    lightboxImg.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            toggleZoom();
        }
    });

    // Previous / Next / Close button listeners
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

    // Close when clicking backdrop outside image & controls
    lightbox.addEventListener("click", (e) => {
        if (wasDraggingOrSwiping) {
            wasDraggingOrSwiping = false;
            return;
        }
        if (
            e.target !== lightboxImg &&
            e.target !== nextBtn &&
            e.target !== prevBtn &&
            e.target !== lightboxCaption
        ) {
            closeLightbox();
        }
    });

    // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "ArrowRight") {
            e.preventDefault();
            nextImage();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevImage();
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeLightbox();
        }
    });

    // Smart Mobile Touch Gestures (Chrome, Safari, Messenger & Facebook In-App Browser):
    // - When UNZOOMED (1 finger): swipe left/right switches photos with smooth drag feedback.
    // - When ZOOMED (1 finger): drag pans around the zoomed photo without switching photos.
    // - When PINCHING (2+ fingers): locks swipe so photo never flips.
    let touchStartX = 0;
    let touchStartY = 0;
    let startPanX = 0;
    let startPanY = 0;
    let isMultiTouch = false;

    lightbox.addEventListener(
        "touchstart",
        (e) => {
            if (e.touches.length > 1) {
                isMultiTouch = true;
                wasDraggingOrSwiping = true;
                return;
            }
            isMultiTouch = false;
            wasDraggingOrSwiping = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            startPanX = panX;
            startPanY = panY;

            if (isZoomed) {
                lightboxImg.classList.add("dragging");
            }
        },
        { passive: true }
    );

    lightbox.addEventListener(
        "touchmove",
        (e) => {
            if (!lightbox.classList.contains("active")) return;

            if (e.touches.length > 1) {
                isMultiTouch = true;
                wasDraggingOrSwiping = true;
                return;
            }

            if (e.cancelable) {
                e.preventDefault();
            }

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - touchStartX;
            const deltaY = currentY - touchStartY;

            if (Math.hypot(deltaX, deltaY) > 10) {
                wasDraggingOrSwiping = true;
            }

            // If zoomed in, allow smooth panning around the photo without switching images
            if (isZoomed && !isMultiTouch) {
                panX = Math.max(-140, Math.min(140, startPanX + deltaX));
                panY = Math.max(-140, Math.min(140, startPanY + deltaY));
                applyTransform();
            } else if (!isZoomed && !isMultiTouch && Math.abs(deltaX) > Math.abs(deltaY)) {
                lightboxImg.classList.add("dragging");
                lightboxImg.style.transform = `translate3d(${deltaX * 0.25}px, 0, 0)`;
            }
        },
        { passive: false }
    );

    lightbox.addEventListener(
        "touchend",
        (e) => {
            lightboxImg.classList.remove("dragging");

            if (isZoomed) {
                return;
            }

            if (isMultiTouch || !e.changedTouches || e.changedTouches.length === 0) {
                applyTransform();
                return;
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Trigger horizontal swipe if horizontal distance > 35px and dominates vertical movement
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                wasDraggingOrSwiping = true;
                if (diffX > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            } else {
                applyTransform();
            }
        },
        { passive: true }
    );
}

/* ============================================================================
   7. SHARE INVITATION MODULE (NATIVE WEB SHARE, MODAL FALLBACK & CLIPBOARD COPY)
   ============================================================================ */
function initShareInvitation() {
    const shareTriggers = document.querySelectorAll(".btn-share-trigger");
    const copyInvitationBtn = document.getElementById("copy-invitation-btn");
    const shareModal = document.getElementById("shareModal");
    const shareModalBackdrop = document.getElementById("shareModalBackdrop");
    const shareModalClose = document.getElementById("shareModalClose");
    const modalCopyBtn = document.getElementById("modalCopyBtn");
    const modalCopyText = document.getElementById("modalCopyText");
    const shareInvitationText = document.getElementById("shareInvitationText");
    const copyToast = document.getElementById("copyToast");
    const toastMessage = document.getElementById("toastMessage");

    const modalShareFb = document.getElementById("modalShareFacebook");
    const modalShareMsg = document.getElementById("modalShareMessenger");
    const modalShareWa = document.getElementById("modalShareWhatsApp");
    const modalShareTwitter = document.getElementById("modalShareTwitter");

    const quickShareFb = document.getElementById("quick-share-fb");
    const quickShareMsg = document.getElementById("quick-share-messenger");
    const quickShareWa = document.getElementById("quick-share-whatsapp");

    // Canonical URL for sharing
    let siteUrl = window.location.href.split("#")[0];
    if (!/^https?:\/\//i.test(siteUrl)) {
        siteUrl = "https://csfchurch.web.app";
    }

    const shareTitle = "CSF Church 20th Anniversary Celebration";
    const shareHeadline = "Two Decades of God's Faithfulness: Pressing Forward Toward the Promise Ahead";

    const defaultInvitationContent =
`✦ YOU'RE CORDIALLY INVITED! ✦
CSF Church 20th Anniversary Celebration

"Two Decades of God's Faithfulness: Pressing Forward Toward the Promise Ahead" (Philippians 3:14)

🗓 Date: Sunday, November 8, 2026
⏰ Time: 9:00 AM – 12:00 PM
📍 Venue: CSF Church Sapang Kawayan, San Ildefonso, Bulacan
🎙 Guest Speaker: Ptra. Miles Barleta

Come and celebrate God's goodness with us!
Register here: https://docs.google.com/forms/d/e/1FAIpQLSdApIFcluOuj8TLqBu2NIcWL1Z0Dg6EO45Uwpe3PyEMu1jplw/viewform
Official Site: ${siteUrl}`;

    // Update social share URLs with live URLs
    const encodedUrl = encodeURIComponent(siteUrl);
    const shortShareText = `${shareTitle} — ${shareHeadline}! Join us on Sunday, November 8, 2026:`;
    const encodedShortShare = encodeURIComponent(shortShareText);

    if (modalShareFb) modalShareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (quickShareFb) quickShareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    if (modalShareMsg) modalShareMsg.href = `https://m.me/ChristSaviorForerunnerChurch`;
    if (quickShareMsg) quickShareMsg.href = `https://m.me/ChristSaviorForerunnerChurch`;

    if (modalShareWa) modalShareWa.href = `https://api.whatsapp.com/send?text=${encodedShortShare}%20${encodedUrl}`;
    if (quickShareWa) quickShareWa.href = `https://api.whatsapp.com/send?text=${encodedShortShare}%20${encodedUrl}`;

    if (modalShareTwitter) modalShareTwitter.href = `https://twitter.com/intent/tweet?text=${encodedShortShare}&url=${encodedUrl}`;

    let toastTimeout = null;
    function showToast(message = "Invitation text copied to clipboard!") {
        if (!copyToast) return;
        if (toastMessage) toastMessage.textContent = message;
        copyToast.classList.add("show");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            copyToast.classList.remove("show");
        }, 3200);
    }

    async function copyToClipboard(textToCopy, successFeedbackCallback) {
        let success = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            } catch (_) {
                success = false;
            }
        }

        if (!success) {
            try {
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = textToCopy;
                tempTextArea.style.position = "fixed";
                tempTextArea.style.left = "-9999px";
                tempTextArea.style.top = "0";
                document.body.appendChild(tempTextArea);
                tempTextArea.focus();
                tempTextArea.select();
                success = document.execCommand("copy");
                document.body.removeChild(tempTextArea);
            } catch (_) {
                success = false;
            }
        }

        if (success) {
            showToast("Invitation text copied to clipboard! ✓");
            if (typeof successFeedbackCallback === "function") {
                successFeedbackCallback();
            }
        } else {
            showToast("Please copy the invitation text manually.");
        }
    }

    function openModal() {
        if (!shareModal) return;
        shareModal.removeAttribute("hidden");
        // Force reflow
        void shareModal.offsetWidth;
        shareModal.classList.add("is-active");
        document.body.style.overflow = "hidden";
        if (shareModalClose) shareModalClose.focus();
    }

    function closeModal() {
        if (!shareModal) return;
        shareModal.classList.remove("is-active");
        setTimeout(() => {
            if (!shareModal.classList.contains("is-active")) {
                shareModal.setAttribute("hidden", "");
            }
        }, 300);
        document.body.style.overflow = "";
    }

    // Trigger buttons (Hero & Card)
    shareTriggers.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();

            const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (navigator.share && isMobileDevice) {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: `${shareHeadline}\n\nJoin us on Sunday, November 8, 2026 at CSF Church Sapang Kawayan!`,
                        url: siteUrl
                    });
                    return;
                } catch (err) {
                    if (err && err.name === "AbortError") {
                        // User dismissed share sheet, do not show modal
                        return;
                    }
                    // If native share fails, fallback to modal
                }
            }

            // Fallback for desktop or non-share browsers
            openModal();
        });
    });

    // 1-Click Copy on Card
    if (copyInvitationBtn) {
        copyInvitationBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const text = (shareInvitationText && shareInvitationText.value) || defaultInvitationContent;
            copyToClipboard(text);
        });
    }

    // 1-Click Copy inside Modal
    if (modalCopyBtn) {
        modalCopyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const text = (shareInvitationText && shareInvitationText.value) || defaultInvitationContent;
            copyToClipboard(text, () => {
                if (modalCopyText) {
                    const originalText = modalCopyText.textContent;
                    modalCopyText.textContent = "Copied! ✓";
                    setTimeout(() => {
                        modalCopyText.textContent = originalText;
                    }, 2000);
                }
            });
        });
    }

    // Close handlers
    if (shareModalClose) {
        shareModalClose.addEventListener("click", closeModal);
    }
    if (shareModalBackdrop) {
        shareModalBackdrop.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && shareModal && shareModal.classList.contains("is-active")) {
            closeModal();
        }
    });
}

/* ============================================================================
   8. BACK TO TOP BUTTON MODULE
   ============================================================================ */
function initBackToTopButton() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    window.addEventListener(
        "scroll",
        () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        },
        { passive: true }
    );

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ============================================================================
   9. SCROLL REVEAL ANIMATIONS MODULE
   ============================================================================ */
function initScrollRevealAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        ".section-title, .section-subtitle, .timeline-item, .big-20, .program-summary-box, .pastor-grid, .guest-speaker, .invitation-card, .contact-grid, .gallery-album-preview"
    );

    if (!elementsToAnimate.length) return;

    if ("IntersectionObserver" in window) {
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("appear");
                } else {
                    entry.target.classList.remove("appear");
                }
            });
        }, appearOptions);

        elementsToAnimate.forEach((el) => {
            el.classList.add("fade-in-scroll");
            appearOnScroll.observe(el);
        });
    } else {
        elementsToAnimate.forEach((el) => el.classList.add("appear"));
    }
}