document.addEventListener('DOMContentLoaded', function() {
    // Ensure the modal elements exist
    var modal = document.getElementById("myModal");
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var descriptionText = document.getElementById("description");

    if (!modalImg || !captionText || !descriptionText) {
        console.error('One or more modal elements not found');
        return;
    }

    var descBox = document.querySelector('.description');
    if (descBox) {
        descBox.addEventListener('click', function () {
            if (this.style.maxHeight !== this.scrollHeight + "px") {
                this.style.maxHeight = this.scrollHeight + "px";
            } else {
                this.style.maxHeight = getComputedStyle(this).getPropertyValue('--shrunk-height');
            }
        });
    }

    var span = document.getElementsByClassName("close")[0];
    if (span) {
        span.onclick = function() { 
            closeModal();
        };
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });

    // Close modal when clicking outside of modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('resize', function() {
        if (descBox) adjustHeight();
    });

    // Select the form element
    var form = document.querySelector('.newsletter-signup form');

    if (form) {
        // Add an event listener for form submission
        form.addEventListener('submit', function(event) {
            // Prevent the default form submit action (page refresh)
            event.preventDefault();

            // Access the email input field value
            var email = document.querySelector('.newsletter-signup form input[type="email"]').value;

            // Check if the email field is not empty and send the 'email' to Formspree
            if(email.trim() !== '') {
                var subscribeButton = document.querySelector('.newsletter-signup form button');
                
                // Show loading state
                subscribeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                subscribeButton.disabled = true;
                
                fetch('https://formspree.io/f/mleyejpr', { // replace with your Formspree ID
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    console.log('Email Submitted:', email);
                    subscribeButton.innerHTML = '<i class="fas fa-check"></i> Subscribed';
                    subscribeButton.classList.add('success');
                    return response.json();
                }).then(json => {
                    console.log('Email sent successfully:', json);
                    // Reset form after 3 seconds
                    setTimeout(() => {
                        form.reset();
                        subscribeButton.innerHTML = 'Subscribe';
                        subscribeButton.disabled = false;
                        subscribeButton.classList.remove('success');
                    }, 3000);
                }).catch(error => {
                    console.error('Failed to send email:', error);
                    subscribeButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
                    subscribeButton.classList.add('error');
                    setTimeout(() => {
                        subscribeButton.innerHTML = 'Try Again';
                        subscribeButton.disabled = false;
                        subscribeButton.classList.remove('error');
                    }, 3000);
                });
            } else {
                console.warn('Email field is empty.');
            }
        });
    }

    // Fetch the list of images from the JSON file
    fetch('gallery/gallery-list.json')
        .then(response => response.json())
        .then(imageData => {
            const gallery = document.querySelector('.gallery');
            if (!gallery) {
                console.error('.gallery element not found');
                return;
            }

            imageData.forEach(data => {
                const figure = document.createElement('figure');
                figure.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = `gallery/${data.src}`;
                img.alt = data.alt;
                if (data.offset) {
                    img.style.setProperty('--object-position', data.offset);
                }
                img.onclick = () => openModal(img, data.modalContent);
                
                figure.appendChild(img);
                
                if (data.title) {
                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = data.title;
                    figure.appendChild(figcaption);
                }
                
                gallery.appendChild(figure);
            });
        })
        .catch(error => {
            console.error('Error fetching gallery list:', error);
        });

    // Add event listeners to ensure videos play properly
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            // If video fails to load, show the poster image
            if (this.hasAttribute('poster')) {
                this.style.backgroundImage = `url(${this.getAttribute('poster')})`;
                this.style.backgroundSize = 'cover';
                this.style.backgroundPosition = 'center';
            }
        });
        
        // Try to play the video after page load
        video.addEventListener('loadeddata', function() {
            this.play().catch(e => console.warn('Could not autoplay on load:', e));
        });
    });

    // Add scroll-based animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.gallery-item, .video-wrapper, section');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition.top < windowHeight * 0.9) {
                element.classList.add('in-view');
            }
        });
    };
    
    // Run on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});

function openModal(element, modalData = {}) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var descriptionText = document.getElementById("description");

    if (!modal || !modalImg || !captionText || !descriptionText) {
        console.error('Modal components missing');
        return;
    }

    // First make modal display block but with opacity 0
    modal.style.display = "block";
    modal.style.opacity = "0";
    
    // Handle video or image based on element type
    if (element.tagName.toLowerCase() === 'video') {
        // Create a video element if the clicked element is a video
        if (modalImg.tagName.toLowerCase() !== 'video') {
            // Replace the img with a video element
            var modalVideo = document.createElement('video');
            modalVideo.id = "img01";
            modalVideo.className = "modal-img";
            modalVideo.autoplay = true;
            modalVideo.loop = true;
            modalVideo.muted = true;
            modalVideo.playsInline = true;
            
            // If the original video has a poster, use it
            if (element.hasAttribute('poster')) {
                modalVideo.poster = element.getAttribute('poster');
            }
            
            modalImg.parentNode.replaceChild(modalVideo, modalImg);
            modalImg = modalVideo;
        }
        modalImg.src = element.src;
        
        // Ensure the video starts playing in the modal
        modalImg.play().catch(e => {
            console.error('Failed to play video:', e);
        });
    } else {
        // If the clicked element is an image but modal has a video
        if (modalImg.tagName.toLowerCase() === 'video') {
            // Replace the video with an img element
            var newModalImg = document.createElement('img');
            newModalImg.id = "img01";
            newModalImg.className = "modal-img";
            modalImg.parentNode.replaceChild(newModalImg, modalImg);
            modalImg = newModalImg;
        }
        modalImg.src = element.src;
    }
    
    // Use getAttribute to avoid undefined when alt is not present
    captionText.innerHTML = element.getAttribute('alt') || '';

    // Clear previous description
    descriptionText.innerHTML = "";

    // Add streaming links if provided
    if (modalData.streamingLinks) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'streaming-links-container';

        const preferredOrder = ['spotify', 'apple', 'youtube', 'tidal', 'amazon', 'bandcamp'];
        const processedServices = new Set();

        // First, add links in preferred order
        preferredOrder.forEach(serviceName => {
            if (modalData.streamingLinks.hasOwnProperty(serviceName) && modalData.streamingLinks[serviceName]) {
                const link = document.createElement('a');
                link.href = modalData.streamingLinks[serviceName];
                link.target = "_blank";
                link.setAttribute('aria-label', serviceName.charAt(0).toUpperCase() + serviceName.slice(1));

                if (serviceName.toLowerCase() === 'tidal') {
                    const img = document.createElement('img');
                    img.src = 'source/icons/tidal_icon.png';
                    img.alt = 'Tidal';
                    link.appendChild(img);
                } else {
                    link.className = `fab fa-${serviceName.toLowerCase()}`;
                }
                linksContainer.appendChild(link);
                processedServices.add(serviceName);
            }
        });

        // Then, add any remaining links not in preferred order
        for (const serviceName in modalData.streamingLinks) {
            if (modalData.streamingLinks.hasOwnProperty(serviceName) && modalData.streamingLinks[serviceName] && !processedServices.has(serviceName)) {
                const link = document.createElement('a');
                link.href = modalData.streamingLinks[serviceName];
                link.target = "_blank";
                link.setAttribute('aria-label', serviceName.charAt(0).toUpperCase() + serviceName.slice(1));

                // Note: Tidal image handling is specific to the preferred loop. 
                // If Tidal could somehow be outside preferredOrder and needs image, this part would need duplication or refactor.
                // However, with Tidal in preferredOrder, this else block is fine.
                link.className = `fab fa-${serviceName.toLowerCase()}`;
                
                linksContainer.appendChild(link);
            }
        }
        descriptionText.appendChild(linksContainer);
    }

    // Add Spotify embed if provided
    if (modalData.spotifyEmbed && modalData.spotifyEmbed !== "") {
        const embedContainer = document.createElement('div');
        embedContainer.innerHTML = modalData.spotifyEmbed;
        descriptionText.appendChild(embedContainer);
    } else if (!modalData.streamingLinks) { // If no links and no embed, clear description
        descriptionText.innerHTML = "";
    }

    // Fade in modal
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);
}

function closeModal() {
    var modal = document.getElementById("myModal");
    
    // Fade out animation
    modal.style.opacity = "0";
    
    // After fade out completes, hide the modal
    setTimeout(() => {
        modal.style.display = "none";
        
        // Pause any playing videos when closing the modal
        var modalVideo = document.querySelector('.modal-content video');
        if (modalVideo) {
            modalVideo.pause();
        }
    }, 300); // match this time with the CSS transition time
}

// Function to adjust the height of description box 
function adjustHeight() {
    let descBox = document.querySelector('.description');
    if (descBox) {
        if (descBox.style.maxHeight !== getComputedStyle(descBox).getPropertyValue('--shrunk-height')) {
            // If it was expanded, recompute and set the maxHeight
            descBox.style.maxHeight = descBox.scrollHeight + "px";
        }
    }
}
