document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.side-nav .nav-link');
    const internalLinks = document.querySelectorAll('.section-internal-link');
    const pageContainer = document.getElementById('page-container'); // Assuming this is the scroll container

    // --- Smooth Scroll Function ---
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Calculate target position relative to the viewport
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // --- Navigation Active State based on Scroll ---
    // More robust intersection observer approach
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                // Update nav links ONLY
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
                });
                // REMOVED: Update section active state - no longer needed for scroll
                /*
                sections.forEach(section => {
                     section.classList.toggle('active', section.id === targetId);
                });
                */
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Navigation Click Handlers (Smooth Scroll) ---

    // Side navigation links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });

    // Internal links within sections
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target'); // Use data-target
            smoothScrollTo(targetId);
        });
    });
    
    // --- Remove previous scroll-jacking listeners ---
    // The listeners for 'wheel', 'touchstart', 'touchend', 'keydown' are removed.
    // The 'setActiveSection' function is no longer needed for scroll/swipe/key events.
    // The 'isScrolling' logic is also removed as we rely on native smooth scroll.

    // Initial setup: Ensure the first section's nav link is active on load
    // Handled by IntersectionObserver on initial load

    // Handle direct navigation via hash (e.g., page.html#philosophie)
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        // Delay slightly to allow initial render and observer to potentially fire
        setTimeout(() => {
            // Check if observer already set the correct active link
            const activeLink = document.querySelector('.side-nav .nav-link.active');
            if (!activeLink || activeLink.getAttribute('href') !== `#${initialHash}`) {
                 smoothScrollTo(initialHash);
            }
        }, 150);
    }
    
    // --- Enable Body Scroll ---
    // The body scroll was disabled in CSS, enable it now.
    document.body.style.overflow = 'auto'; // Or 'visible'
    // Also remove overflow:hidden from the page container if it exists
    const container = document.getElementById('page-container');
    if (container) {
        container.style.overflow = 'visible'; // Allow container to scroll
        // Adjust container height if it was fixed (e.g., 100vh)
        // This might need CSS changes instead, depending on layout goals
        // container.style.height = 'auto'; 
    }
    
     // --- CSS Adjustments Needed ---
    // In style.css, you'll need to:
    // 1. Remove `overflow: hidden;` from `body`.
    // 2. Remove `position: absolute;` and associated `top`, `left`, `width`, `height` from `.page-section`. Let them stack normally.
    // 3. Remove `overflow: hidden;` from `#page-container`.
    // 4. Adjust height of `#page-container` if it's fixed (e.g., `height: 100vh;` should likely be removed or changed to `min-height: 100vh;`).
    // 5. Review the transition properties on `.page-section` - they might not be needed or desirable anymore.
    // 6. Ensure sections have enough content or `min-height` (e.g., `min-height: 100vh;`) if you want them to fill the viewport.

}); 