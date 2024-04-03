function openModal(element, spotifyEmbed = "") {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var descriptionText = document.getElementById("description");

    modal.style.display = "block";
    modalImg.src = element.src;
    captionText.innerHTML = element.alt;

    // Check if spotifyEmbed parameter is empty and assign accordingly
    if (spotifyEmbed !== "") {
        descriptionText.innerHTML = spotifyEmbed;
    } else {
        descriptionText.innerHTML = "";
    }

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() { 
        modal.style.display = "none";
    }
}


// Function to adjust the height of description box 
function adjustHeight() {
    let descBox = document.querySelector('.description');
    if (descBox.style.maxHeight !== getComputedStyle(descBox).getPropertyValue('--shrunk-height')) {
        // If it was expanded, recompute and set the maxHeight
        descBox.style.maxHeight = descBox.scrollHeight + "px";
    }
}

// Add eventListener on click
document.querySelector('.description').addEventListener('click', function () {
    if (this.style.maxHeight !== this.scrollHeight + "px") {
        this.style.maxHeight = this.scrollHeight + "px";
    } else {
        this.style.maxHeight = getComputedStyle(this).getPropertyValue('--shrunk-height');
    }
});

document.addEventListener('keydown', function(event) {
    var modal = document.getElementById("myModal");
    if (event.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
    }
});


// Adjusts maxHeight when the window resizes
window.addEventListener('resize', adjustHeight);

// Select the form element
var form = document.querySelector('.newsletter-signup form');

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
  }
});


document.addEventListener('DOMContentLoaded', function() {
    // Fetch the list of images from the JSON file
    fetch('gallery/gallery-list.json')
        .then(response => response.json())
        .then(imageData => {
            const gallery = document.querySelector('.gallery');
            imageData.forEach(data => {
                // Create figure and img elements
                const figure = document.createElement('figure');
                figure.className = 'gallery-item';
                const img = document.createElement('img');
                img.src = `gallery/${data.src}`;
                img.alt = data.alt; // Get alt text from the JSON object
                img.onclick = () => openModal(img); // Assuming openModal is already defined
                
                // Append img to figure
                figure.appendChild(img);

                // Insert figure at the beginning of the gallery div
                const firstChild = gallery.firstChild;
                if(firstChild) {
                    gallery.insertBefore(figure, firstChild);
                } else {
                    gallery.appendChild(figure);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching gallery list:', error);
        });
});
