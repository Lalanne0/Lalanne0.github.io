// Shared behaviour for every page: navigation, reveal animations, parallax.
// Each page declares itself with <body data-page="index|aboutme|projects">.

const page = document.body.dataset.page;
const MOBILE_BREAKPOINT = 800;


/* Navigation */

const mobileNavbar = document.querySelector(".mobile-navbar");
const menuButton = document.querySelector(".top-right-image");

function setActiveTab(name) {
    document.querySelectorAll("[data-tab]").forEach(tab => {
        const isActive = tab.dataset.tab === name;
        tab.classList.toggle("opened", isActive);
        tab.classList.toggle("closed", !isActive);
    });
}

function setMobileNavbarOpen(open) {
    mobileNavbar.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
}

function changeLanguage() {
    const targetLang = document.documentElement.lang === "en" ? "fr" : "en";
    window.location.href = `../${targetLang}/${page}.html`;
}

function activeTabFromScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    setActiveTab(progress < 0.7 ? "home" : "contact");
}

menuButton.addEventListener("click", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
        changeLanguage();
    } else {
        setMobileNavbarOpen(!mobileNavbar.classList.contains("open"));
    }
});

document.querySelector(".mobile-flag").addEventListener("click", changeLanguage);

document.querySelectorAll(".mobile-tabs a").forEach(link => {
    link.addEventListener("click", () => setMobileNavbarOpen(false));
});

if (page === "index") {
    activeTabFromScroll();
    document.addEventListener("scroll", activeTabFromScroll, { passive: true });
} else {
    setActiveTab(page);
}


/* Reveal animations
   Elements with .js-hidden fade in when they enter the viewport. A data-delay
   attribute (ms) fixes the delay; otherwise elements entering together are
   staggered in document order. */

const STAGGER_MS = 150;

function reveal(el, delay) {
    setTimeout(() => el.classList.add("js-visible"), delay);
}

const hiddenElements = document.querySelectorAll(".js-hidden");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries
            .filter(entry => entry.isIntersecting)
            .forEach((entry, i) => {
                const { delay } = entry.target.dataset;
                reveal(entry.target, delay !== undefined ? Number(delay) : i * STAGGER_MS);
                observer.unobserve(entry.target);
            });
    }, { rootMargin: "0px 0px -10% 0px" });

    hiddenElements.forEach(el => observer.observe(el));
} else {
    hiddenElements.forEach(el => reveal(el, 0));
}


/* Parallax: gradient circles drift with the mouse on pointer devices */

const parallaxElements = Array.from(document.querySelectorAll(".parallax"), el => ({
    el,
    depth: Number(el.dataset.depth) || 0,
    x: 0,
    y: 0,
}));

function readBaseTransforms() {
    parallaxElements.forEach(item => {
        item.el.style.removeProperty("transform");
        const matrix = new DOMMatrixReadOnly(getComputedStyle(item.el).transform);
        item.x = matrix.m41;
        item.y = matrix.m42;
    });
}

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let frame = null;

    readBaseTransforms();
    window.addEventListener("resize", readBaseTransforms);

    document.addEventListener("mousemove", event => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            const offsetX = (0.5 - event.clientX / window.innerWidth) * window.innerWidth * 0.01;
            const offsetY = (0.5 - event.pageY / window.innerHeight) * window.innerWidth * 0.01;
            parallaxElements.forEach(({ el, depth, x, y }) => {
                el.style.transform = `translate(${x + offsetX * depth}px, ${y + offsetY * depth}px)`;
            });
        });
    });
}


/* About page: stretch the hero background to fit the text when it sits
   next to the photo, and keep the gradient circles the same height. */

if (page === "aboutme") {
    const aboutDiv = document.querySelector(".aboutme-div");
    const background = document.querySelector(".homepage-background");
    const circleDivs = document.querySelectorAll(".home-circle-div");

    const fitBackground = () => {
        const textHeight = aboutDiv.offsetHeight;
        if (window.innerWidth > 1430) {
            background.style.height = textHeight > 0.82 * window.innerHeight
                ? `${textHeight / 0.82}px`
                : "100%";
        } else {
            background.style.removeProperty("height");
        }
        circleDivs.forEach(div => {
            div.style.height = `${background.offsetHeight}px`;
        });
    };

    fitBackground();
    window.addEventListener("load", fitBackground); // text height changes once webfonts load
    window.addEventListener("resize", fitBackground);
}
