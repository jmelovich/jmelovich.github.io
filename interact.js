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

  // Check if the email field is not empty
  if(email.trim() !== '') {
    console.log('Email Submitted:', email);
  
    // Change button text, disable it after email is submitted, and add 'disabled' CSS class
    var subscribeButton = document.querySelector('.newsletter-signup form button');
    subscribeButton.textContent = 'Subscribed';
    subscribeButton.disabled = true;
    subscribeButton.classList.add('disabled');

    // You can add your own AJAX call or fetch API request here to send 'email' to your server
  }
});
