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
    if (!descBox) {
        console.error('.description element not found');
    } else {
        descBox.addEventListener('click', function () {
            if (this.style.maxHeight !== this.scrollHeight + "px") {
                this.style.maxHeight = this.scrollHeight + "px";
            } else {
                this.style.maxHeight = getComputedStyle(this).getPropertyValue('--shrunk-height');
            }
        });
    }

    var span = document.getElementsByClassName("close")[0];
    if (!span) {
        console.error('.close span element not found');
    } else {
        span.onclick = function() { 
            modal.style.display = "none";
        };
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            // Pause any playing videos when closing the modal
            var modalVideo = document.querySelector('.modal-content video');
            if (modalVideo) {
                modalVideo.pause();
            }
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
                    subscribeButton.textContent = 'Subscribed';
                    subscribeButton.disabled = true;
                    subscribeButton.classList.add('disabled');
                    return response.json();
                }).then(json => {
                    console.log('Email sent successfully:', json);
                }).catch(error => {
                    console.error('Failed to send email:', error);
                });
            } else {
                console.warn('Email field is empty.');
            }
        });
    } else {
        console.error('.newsletter-signup form element not found');
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
            img.style.setProperty('--object-position', data.offset);
            img.onclick = () => openModal(img, data.modalContent);
            figure.appendChild(img);
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

});

function openModal(element, spotifyEmbed = "") {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var descriptionText = document.getElementById("description");

    if (!modal || !modalImg || !captionText || !descriptionText) {
        console.error('Modal components missing');
        return;
    }

    modal.style.display = "block";
    
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
            // Removed controls to make it appear more like an image
            
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

    if (spotifyEmbed !== "") {
        descriptionText.innerHTML = spotifyEmbed;
    } else {
        descriptionText.innerHTML = "";
    }

    var span = document.getElementsByClassName("close")[0];
    if (span) {
        span.onclick = function() { 
            modal.style.display = "none";
            // Pause any playing videos when closing the modal
            var modalVideo = document.querySelector('.modal-content video');
            if (modalVideo) {
                modalVideo.pause();
            }
        };
    } else {
        console.error('.close span element not found in openModal');
    }
}

// Function to adjust the height of description box 
function adjustHeight() {
    let descBox = document.querySelector('.description');
    if (descBox) {
        if (descBox.style.maxHeight !== getComputedStyle(descBox).getPropertyValue('--shrunk-height')) {
            // If it was expanded, recompute and set the maxHeight
            descBox.style.maxHeight = descBox.scrollHeight + "px";
        }
    } else {
        console.error('.description element not found in adjustHeight');
    }
}
