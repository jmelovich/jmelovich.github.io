// Add this to therminal-iframe.js

function toggleTherminal() {
    const iframe = document.getElementById('therminal-iframe');
    const toggleButton = document.getElementById('therminal-toggle');
    
    iframe.classList.toggle('expanded');
    toggleButton.textContent = iframe.classList.contains('expanded') ? 'Close Therminal' : 'Open Therminal';
    
    if (iframe.classList.contains('expanded')) {
        // Focus the input field inside the iframe
        setTimeout(() => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const inputField = iframeDocument.getElementById('input');
            if (inputField) {
                inputField.focus();
            }
            
            // Clear the URL parameter after expanding
            const url = new URL(window.location);
            url.searchParams.delete('expandTherminal');
            window.history.replaceState({}, '', url);
        }, 100);
    }
}

function initTherminal() {
    const toggleButton = document.getElementById('therminal-toggle');
    const iframe = document.getElementById('therminal-iframe');

    if (toggleButton && iframe) {
        toggleButton.addEventListener('click', toggleTherminal);
        
        // Add keybind event listener
        function addKeybindListener() {
            document.addEventListener('keydown', function(event) {
                if (event.ctrlKey && event.altKey && event.key === 't') {
                    event.preventDefault(); // Prevent default browser behavior
                    toggleTherminal();
                }
            });
        }

        // Add keybind listener immediately
        addKeybindListener();

        // Also add keybind listener when window gains focus
        window.addEventListener('focus', addKeybindListener);
    } else {
        console.error('Therminal elements not found');
    }
}

// Ensure the window has focus
window.focus();

// Run initTherminal when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTherminal);
} else {
    initTherminal();
}