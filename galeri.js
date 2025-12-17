document.addEventListener('DOMContentLoaded', () => {
    const door = document.querySelector('.door');
    const popup = document.getElementById('doorPopup');
    const overlay = document.getElementById('popupOverlay');

    // Check for view parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'selection') {
        const container = document.querySelector('.door-container');
        const selectionPage = document.getElementById('selectionPage');

        container.style.display = 'none';
        container.style.opacity = '0';
        selectionPage.classList.add('active');
        selectionPage.style.opacity = '1';
    }

    function openPopup() {
        popup.classList.add('active');
        overlay.classList.add('active');
    }

    function closePopup() {
        popup.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Add click event to the door
    door.addEventListener('click', (e) => {
        // Prevent event bubbling if clicking on children that might trigger other things
        e.stopPropagation();
        openPopup();
    });

    // Close popup when clicking overlay
    overlay.addEventListener('click', closePopup);

    // Global function to handle handle buttons (called from HTML)
    window.handleDoorAction = function (action) {
        console.log(`Door action: ${action}`);
        if (action === 'open') {
            // Switch to Selection Page
            const container = document.querySelector('.door-container');
            const selectionPage = document.getElementById('selectionPage');

            // Fade out current container
            container.style.transition = 'opacity 0.5s ease';
            container.style.opacity = '0';

            setTimeout(() => {
                container.style.display = 'none';
                selectionPage.classList.add('active');
            }, 500);

        } else {
            // Close action - just close the popup (no alert needed)
        }
        closePopup();
    }
    // Go back to door function
    window.goBackToDoor = function () {
        // If we are in "selection view mode" (URL param present), handle seamless transition
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'selection') {
            // Remove injected style if it exists
            const injectedStyle = document.getElementById('selection-style');
            if (injectedStyle) {
                injectedStyle.remove();
            }

            // Clean URL without reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }

        const container = document.querySelector('.door-container');
        const selectionPage = document.getElementById('selectionPage');

        // Force door container styles back if they were overridden by !important
        container.style.display = 'flex';
        container.style.opacity = '1';

        // Hide selection page
        selectionPage.style.opacity = '0';
        selectionPage.classList.remove('active'); // Remove active class immediately to accept transition logic

        // Since we removed !important styles, the CSS transition might not apply instantly if we don't manage it carefully.
        // But simply invalidating the !important style by removing the element should let the original CSS take over.

        // We just need to ensure the standard "close" animation happens or just switching.
        // The original logic was:
        /*
        selectionPage.style.opacity = '0';
        setTimeout(() => {
            selectionPage.classList.remove('active');
            selectionPage.style.opacity = ''; 
            container.style.display = 'flex'; 
             setTimeout(() => { container.style.opacity = '1'; }, 50);
        }, 500);
        */

        // Let's stick to the standard logic, but now starting from a state where valid DOM Elements exist.
        // However, we just made container visible above. 
        // Let's refine:

        // 1. Fade out selection
        selectionPage.style.opacity = '0';

        // 2. After fade, hide selection and ensuring door is fully visible
        setTimeout(() => {
            selectionPage.classList.remove('active');
            selectionPage.style.opacity = ''; // Reset

            // Ensure door is visible (it should be visible now that style is removed, but let's be safe)
            container.style.display = 'flex';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 50);
        }, 500);
    }



    // About Us Navigation
    window.showAboutUs = function () {
        const selectionPage = document.getElementById('selectionPage');
        const aboutUsPage = document.getElementById('aboutUsPage');

        selectionPage.style.opacity = '0';
        setTimeout(() => {
            selectionPage.style.display = 'none';
            aboutUsPage.style.display = 'flex';
            setTimeout(() => {
                aboutUsPage.style.opacity = '1';
            }, 50);
        }, 300);
    }

    window.hideAboutUs = function () {
        const selectionPage = document.getElementById('selectionPage');
        const aboutUsPage = document.getElementById('aboutUsPage');

        aboutUsPage.style.opacity = '0';
        setTimeout(() => {
            aboutUsPage.style.display = 'none';
            selectionPage.style.display = 'flex';
            setTimeout(() => {
                selectionPage.style.opacity = '1';
            }, 50);
        }, 300);
    }

    // Handle house selection
    const houseItems = document.querySelectorAll('.house-item');
    houseItems.forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('.house-label').textContent.trim().toLowerCase();
            if (['bugis', 'toraja', 'mandar'].includes(label)) {
                // Navigate to motif gallery with region param
                window.location.href = `motif_gallery.html?region=${label}`;
            }
        });
    });
    // Audio Setup
    const audio = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    if (audio && muteBtn) {
        audio.volume = 0.5;

        // Try to autoplay
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented");
                muteBtn.textContent = '🔇';
            });
        }

        // Mute Toggle
        muteBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                muteBtn.textContent = '🔊';
            } else {
                audio.pause();
                muteBtn.textContent = '🔇';
            }
        });
    }
});
