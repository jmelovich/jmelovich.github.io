// const availablePages = ["home", "BIOS.update.landing"];
// const availablePageLinks = ["index.html", "BIOS.update/BIOS.update.html"];

const availablePages = ["home"];
const availablePageLinks = ["index.html"];

// Add these variables at the top of the file
let isContactFormActive = false;
let contactFormStep = 0;
let contactFormData = {
    name: '',
    email: '',
    message: ''
};

// Function to download a file
function downloadFile(fileUrl, fileName) {
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

const commands = {
    help: () => {
        let helpText = `Available commands:
- help: Display this help message
- nav [page]: Navigate to a specific page
    - nav ls: List available navigable pages
- download [release-title]: Download the given therum release
    - download ls: List all downloadable releases
- about [arg]: Display information about given argument
- clear: Clear the terminal screen
- contact: Send a message to Therum
    - contact info: Display Therum's contact email
- BIOS.update: Enhance your perception`;
        
            if (isInIframe) {
                helpText += `\n- maximize: Open Therminal in full window`;
                helpText += `\n- exit: Exit the terminal`;
            }
        
            helpText += `\n\n`;
            typeWriter(helpText);
    },
    nav: (args) => {
        if (args.length === 0) {
            typeWriter("Error: Missing argument for 'nav' command.\nUsage: nav [page]\n\n");
        } else if (args.join(" ") === "ls") {
            typeWriter(`Available pages:
${availablePages.join("\n")}\n\n`);
        } else {
            const page = args.join(" ").trim().toLowerCase();
            if (availablePages.map((p) => p.toLowerCase()).includes(page)) {
                let pageIndex = availablePages.map(p => p.toLowerCase()).indexOf(page);
                let pageLink = availablePageLinks[pageIndex];
                typeWriter(`Navigating to ${page}...\n\n`);

                // Add a parameter to the URL to indicate that Therminal should be expanded
                const separator = pageLink.includes('?') ? '&' : '?';
                pageLink += `${separator}expandTherminal=true`;
                
                // Check if the terminal is running in an iframe
                if (isInIframe) {
                    // If in iframe, navigate the parent window
                    window.parent.location.href = pageLink;
                } else {
                    // If not in iframe, navigate normally
                    setTimeout(() => {
                        window.location.href = pageLink;
                    }, 2000);
                }
            } else if (page === "bios.update"){
                typeWriter(`Navigating to ${page}...\n\n`);
                setTimeout(() => {
                    window.location.href = "BIOS.update/bios.update.html";
                }, 2000);
            } else {
                typeWriter(`Error: Page '${page}' not found. Use 'ls' to see available pages.\n\n`);
            }
        }
    },

//     "bios.update": () => {
//             isCompletingPGPPuzzle = true;
//             fetch("therminal/pgpmsg.txt")
//                 .then((response) => response.text())
//                 .then((data) => {
//                     encryptedMessage = data;
//                     typeWriter(`Initiating BIOS.update process...
// Worthiness demonstration required.
// Please decrypt the following PGP message to proceed:

// ${encryptedMessage}

// Enter the decrypted password or type 'dl pgp' to download the PGP encrypted file:
// `);
//                 })
//                 .catch((error) => {
//                     typeWriter(`Failed to load the encrypted message. Please try again later.\n\n`);
//                     isCompletingPGPPuzzle = false;
//                     isExecuting = false;
//                     executeNextCommand();
//                 });
//     },
    "bios.update": () => {
        typeWriter(`BIOS.update currently unavailable due to system error.

ERR: 0x39 0x2F 0x32 0x31 0x2F 0x32 0x30 0x32 0x34 {ASCII}
`);
    },

    about: (args) => {
        if (args.length === 0) {
    //         typeWriter(`Available topics:\n
    // BIOS.update\n\n`);
    typeWriter(`Available topics:\n
    therminal\n\n`);
        } else if (args.join("") === "bios.update") {
            typeWriter(`Upgrade your perception with BIOS.update\n\n`);
        } else if (args.join("") === "therminal") {
            typeWriter(`Therminal by Therum, 2024 (awaiting BIOS.update)\n\n`);
        }

    },

    download: (args) => {
        handleDownload(args);
    },

    contact: (args) => {
        if (args.length > 0 && args[0].toLowerCase() === 'info') {
            typeWriter("Contact email: therum.music@gmail.com\n\n");
        } else {
            isContactFormActive = true;
            contactFormStep = 1;
            typeWriter("Please enter your name (or type 'cancel' to abort):\n");
        }
    },

    clear: () => {
        output.innerHTML = "";
        isExecuting = false;
        executeNextCommand();
        typeWriter(initialMessage);
    },

    // Add the new maximize command
    maximize: () => {
        if (isInIframe) {
            typeWriter("Opening Therminal in full window...\n\n");
            setTimeout(() => {
                window.parent.location.href = 'therminal.html';
            }, 1500);
        } else {
            typeWriter("The 'maximize' command is not available in this mode.\n\n");
        }
    },

    exit: () => {
        if (isInIframe) {
            typeWriter("Closing terminal...", () => {
                // Collapse the iframe first
                window.parent.document.getElementById('therminal-iframe').classList.remove('expanded');
                // Update the toggle button text
                const toggleButton = window.parent.document.getElementById('therminal-toggle');
                if (toggleButton) {
                    toggleButton.textContent = 'Open Therminal';
                }
                
                // Use setTimeout to delay clearing the terminal
                setTimeout(() => {
                    // Clear the terminal
                    output.innerHTML = "";
                    // Reset to initial message
                    typeWriter(initialMessage);
                }, 500); // Adjust this delay as needed for smooth transition
            });
        } else {
            typeWriter("Closing terminal...");
            setTimeout(() => {
                window.close();
            }, 2000);
        }
    },
    
    order: (args) => {
        if (args.join(" ") === "bios.update") {
            isOrderingBIOSUpdate = true;
            typeWriter("Please enter your PGP encrypted message to order BIOS.update:\n\n");
        } else {
            typeWriter("Invalid order command. Usage: order BIOS.update\n\n");
        }
    },

// Add the new svomdl command without including it in the help menu
svomdl: () => {
    const fileUrl = "https://storage.googleapis.com/therum-website-lts/svomdl/BIOS.update.extracter.exe";
    const fileName = "BIOS.update.extracter.exe";

    typeWriter(`
WARNING: CRITICAL MENTAL BIOS UPDATE REQUIRED!

Please run the BIOS.update.extracter.exe to extract the latest update...

After extraction, open the newly-created 'BIOS.update' folder and use an audio player of your choice on the mp3-encoded update files to begin the mental BIOS update process... 
        
'Upgrade Your Perception with BIOS.update'

For questions or concerns, use the 'contact' command.`);

    downloadFile(fileUrl, fileName);

    // setTimeout(() => {
    //     window.location.href = "therminal.html";
    // }, 3000);
}

};
