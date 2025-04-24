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

    // --- Shop Simple Functionality ---
    // Add simple event listeners for the cart buttons
    const cartButtons = document.querySelectorAll('.simple-cart-button');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simple animation on click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                alert('Produkt wurde zum Warenkorb hinzugefügt');
            }, 200);
        });
    });

    // --- Shop Modal Funktion --- 
    const modal = document.getElementById('product-modal');
    const modalCloseButton = document.querySelector('.modal-close');
    const setSelectionCards = document.querySelectorAll('.set-selection-card');
    const setDataContainer = document.getElementById('set-data');
    const modalTitle = document.getElementById('modal-title');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalThumbnailsContainer = document.getElementById('modal-thumbnails');
    const modalDescriptionP = document.querySelector('#modal-description p');

    // Funktion zum Öffnen des Modals
    function openModal(selectedSet) {
        if (!modal || !setDataContainer) return;

        const setData = setDataContainer.querySelector(`[data-set-id="${selectedSet}"]`);
        if (!setData) return;

        // Titel setzen
        modalTitle.textContent = `Trainingsset - ${selectedSet === 'white' ? 'Weiß' : 'Schwarz'}`;
        
        // Beschreibung setzen
        const descriptionP = setData.querySelector('p[data-description]');
        modalDescriptionP.textContent = descriptionP ? descriptionP.getAttribute('data-description') : '';

        // Thumbnails generieren und erstes Bild setzen
        modalThumbnailsContainer.innerHTML = ''; // Alte Thumbnails löschen
        const imageSpans = setData.querySelectorAll('span[data-image]');
        let firstImageSrc = '';

        imageSpans.forEach((span, index) => {
            const imgSrc = span.getAttribute('data-image');
            if (index === 0) firstImageSrc = imgSrc; // Erstes Bild als Hauptbild merken

            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.classList.add('thumbnail');
            if (index === 0) thumb.classList.add('active');
            thumb.dataset.image = imgSrc; // Bildpfad für Klick speichern

            // Event Listener für Thumbnail-Klick
            thumb.addEventListener('click', () => {
                modalMainImage.src = imgSrc;
                // Aktiven Status für Thumbnails aktualisieren
                modalThumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            modalThumbnailsContainer.appendChild(thumb);
        });

        // Erstes Hauptbild setzen
        modalMainImage.src = firstImageSrc;

        // Modal anzeigen
        modal.classList.add('show');
    }

    // Funktion zum Schließen des Modals
    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Event Listener für Auswahlkarten
    setSelectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const set = card.getAttribute('data-set');
            openModal(set);
        });
    });

    // Event Listener für Schließen-Button
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }

    // Event Listener für Klick außerhalb des Modal-Inhalts (Overlay)
    if (modal) {
        modal.addEventListener('click', (event) => {
            // Schließen nur, wenn direkt auf das Overlay (modal) geklickt wird
            if (event.target === modal) { 
                closeModal();
            }
        });
    }

    // --- Navigations-Toggle Funktion --- 
    const sideNav = document.querySelector('.side-nav');
    const navToggleBtn = document.getElementById('nav-toggle-btn');

    if (sideNav && navToggleBtn) {
        navToggleBtn.addEventListener('click', () => {
            sideNav.classList.toggle('collapsed');
            
            // Optional: Icon ändern (Beispiel - benötigt Font Awesome)
            const icon = navToggleBtn.querySelector('i');
            if (sideNav.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
                navToggleBtn.setAttribute('aria-label', 'Navigation ausklappen');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
                 navToggleBtn.setAttribute('aria-label', 'Navigation einklappen');
            }
        });
    }

}); 