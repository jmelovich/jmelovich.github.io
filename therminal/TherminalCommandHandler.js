function handlePGPPuzzle(userInput) {
    if (userInput.toLowerCase() === "cancel") {
        isCompletingPGPPuzzle = false;
        typeWriter("Download cancelled. Returning to main terminal.\n\n");
    } else if (userInput.toLowerCase() === "dl pgp") {
        downloadPGPMsg();
    } else if (userInput.toLowerCase() === correctPassword) {
        typeWriter("Decryption successful. Access granted to BIOS.update.\n\nDownloading text-based order form...\n", () => {
            let progress = 0;
            const totalSteps = 20;
            const intervalTime = 3000 / totalSteps;

            // Create a new element for the progress bar
            const progressElement = document.createElement('div');
            output.appendChild(progressElement);

            function updateProgressBar() {
                progress++;
                const progressBar = '[' + '='.repeat(progress) + ' '.repeat(totalSteps - progress) + ']';
                const percentage = Math.round((progress / totalSteps) * 100);
                
                // Update the progress element directly
                progressElement.textContent = `${progressBar} ${percentage}%`;
                
                if (progress < totalSteps) {
                    setTimeout(updateProgressBar, intervalTime);
                } else {
                    setTimeout(() => {
                        window.location.href = "../source/reffed/BIOS.update.orderform";
                        isCompletingPGPPuzzle = false;  // Reset the flag after successful download
                        output.removeChild(progressElement);
                        typeWriter("\nDownload complete. Returning to main terminal.\n\n");
                    }, intervalTime);
                }
            }

            updateProgressBar();
        });
    } else {
        typeWriter("Incorrect password. Decryption failed. Please try again or type 'cancel' to abort.\n\n");
    }
}

function handleDownload(args) {
    if (args.length === 0) {
        typeWriter("Error: Missing argument for 'download' command.\nUsage: download [release-title] or download ls\n\n");
        return;
    }

    fetch('discography/releases.json')
        .then(response => response.json())
        .then(releases => {
            if (args[0].toLowerCase() === 'ls') {
                // List all available releases
                let releaseList = "Available releases:\n";
                releases.forEach(release => {
                    releaseList += `- ${release.title}\n`;
                });
                typeWriter(releaseList + "\n");
            } else {
                const requestedRelease = args.join("").toLowerCase();
                const matchedRelease = releases.find(release => release.title.toLowerCase() === requestedRelease);

                if (matchedRelease) {
                    typeWriter(`Downloading ${matchedRelease.title}...\n\n`, () => {
                        // Callback function to trigger download after typewriter finishes
                        triggerDownload(matchedRelease.link);
                        typeWriter(`Download initiated for ${matchedRelease.title}.\n\n`);
                    });
                } else {
                    typeWriter(`Error: Release '${requestedRelease}' not found. Please check the available releases and try again.\n\n`);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching releases:', error);
            typeWriter("An error occurred while fetching the releases. Please try again later.\n\n");
        });
}

function triggerDownload(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    link.remove();
}

// for contact command
function handleContactForm(input) {
    if (input.toLowerCase() === 'cancel') {
        isContactFormActive = false;
        contactFormStep = 0;
        contactFormData = { name: '', email: '', message: '' };
        typeWriter("Contact form cancelled.\n\n");
        isExecuting = false;
        executeNextCommand();
        return;
    }

    switch (contactFormStep) {
        case 1:
            contactFormData.name = input;
            contactFormStep++;
            typeWriter("Please enter your email (or type 'cancel' to abort):\n");
            break;
        case 2:
            contactFormData.email = input;
            contactFormStep++;
            typeWriter("Please enter your message (or type 'cancel' to abort):\n");
            break;
        case 3:
            contactFormData.message = input;
            sendContactForm();
            break;
    }
}


function sendContactForm() {
    typeWriter("Sending your message...\n");

    emailjs.send("service_therummusic", "therminal.message", {
        from_name: contactFormData.name,
        email: contactFormData.email,
        msg: contactFormData.message
    }, "6FrCgytWxzHf6TPjc")
    .then(function(response) {
        typeWriter("Message sent successfully!\n\n");
    }, function(error) {
        typeWriter("Failed to send message. Please try again later.\n\n");
        console.error("EmailJS error:", error);
    })
    .finally(() => {
        isContactFormActive = false;
        contactFormStep = 0;
        contactFormData = { name: '', email: '', message: '' };
        isExecuting = false;
        executeNextCommand();
    });
}

function downloadPGPMsg() {
    const blob = new Blob([encryptedMessage], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BIOS.update.pgp";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    typeWriter("PGP message downloaded as 'BIOS.update.pgp'.\n\n");
}

function processPGPMessage(message) {
    if (message.toLowerCase() === "cancel") {
        isOrderingBIOSUpdate = false;
        typeWriter("Order cancelled. Returning to main terminal.\n\n");
    } else if (message.includes("-----BEGIN PGP MESSAGE-----") && message.includes("-----END PGP MESSAGE-----")) {
        typeWriter("Valid PGP message detected. Sending order to therum.music@gmail.com...\n\n");
        
        var data = {
            service_id: 'service_therummusic',
            template_id: 'bu.pgp.template',
            user_id: '6FrCgytWxzHf6TPjc',
            template_params: {
                'pgp_message': message,
            }
        };
         
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(data => {
            typeWriter("Order sent successfully. Thank you for your interest in BIOS.update.\n\n");
        })
        .catch((error) => {
            typeWriter("An error occurred while sending the order. Please try again later.\n\n");
            console.error('Error:', error);
        })
        .finally(() => {
            isOrderingBIOSUpdate = false;
            isExecuting = false;
            executeNextCommand();
        });
    } else {
        typeWriter("Invalid PGP message format. Please try again or type 'cancel' to abort.\n\n");
    }
}

function downloadFile(fileUrl, fileName) {
    // Create a new anchor element (not yet added to the DOM)
    const anchor = document.createElement('a');

    // Set the href attribute to the file URL
    anchor.href = fileUrl;

    // Specify the desired file name
    anchor.download = fileName;

    // Append the anchor to the body (this won't make it visually appear)
    document.body.appendChild(anchor);

    // Programmatically trigger a click on the anchor element
    anchor.click();

    // Remove the anchor from the body after clicking it
    document.body.removeChild(anchor);
}
