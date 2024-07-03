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
    - contact info: Display Therum's contact email`;
        
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
            const page = args.join(" ").toLowerCase();
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
            } else {
                typeWriter(`Error: Page '${page}' not found. Use 'ls' to see available pages.\n\n`);
            }
        }
    },

    "bios.update": () => {
            isCompletingPGPPuzzle = true;
            fetch("therminal/pgpmsg.txt")
                .then((response) => response.text())
                .then((data) => {
                    encryptedMessage = data;
                    typeWriter(`Initiating BIOS.update process...
Worthiness demonstration required.
Please decrypt the following PGP message to proceed:

${encryptedMessage}

Enter the decrypted password or type 'dl pgp' to download the PGP encrypted file:
`);
                })
                .catch((error) => {
                    typeWriter(`Failed to load the encrypted message. Please try again later.\n\n`);
                    isCompletingPGPPuzzle = false;
                    isExecuting = false;
                    executeNextCommand();
                });
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
    const fileUrls = [
        "https://www.dropbox.com/scl/fi/z10d9r3ruegbukuzhnf3p/1.4155_tizm.wav?rlkey=66209ptct2ianl061rmx13sq9&dl=1",
        "https://www.dropbox.com/scl/fi/itcpp85ppjc1d97hlr0v8/2.lim1n.wav?rlkey=3zslgb3r1eozo69wpzc9aqkhf&dl=1",
        "https://www.dropbox.com/scl/fi/2raemgdrsoj11amwtmk9b/3.Uf0_grnd.wav?rlkey=q0bz9wzqo50u6zpqlj2nuruqe&dl=1",
        "https://www.dropbox.com/scl/fi/m7v9g5gq027b19wddoct2/4.NOLsta3.wav?rlkey=07qo0vcz89wdzm6e7yzqo8qnn&dl=1",
        "https://www.dropbox.com/scl/fi/jqqcaowp0gbse8i4p3t4v/5.reNolution.wav?rlkey=25eqlf3cfucrau20hzc25gnm0&dl=1", 
        "https://www.dropbox.com/scl/fi/l96hz1jrnhyzf4b0huqvx/6.sovieT1.wav?rlkey=fsmicr48u8mmzjnxw8k8bwk3v&dl=1",
        "https://www.dropbox.com/scl/fi/fantn5z933qdo700u6q8l/7.REM_fuel.wav?rlkey=kj4ncb3pfpipo6ci263sjaxpp&dl=1",
        "https://www.dropbox.com/scl/fi/aiheb4innwvb2gpqdln7d/8.wynesellr007.wav?rlkey=r605jpymnrcwslq6m8imn3moj&dl=1",
        "https://www.dropbox.com/scl/fi/4t2wru1ng1rxs1krhv2ue/9.9flatten.wav?rlkey=fwzihkrl9ig15aqkbcsi9vzz8&dl=1",
        "https://www.dropbox.com/scl/fi/dj29w41ohykw2bb9e5r9c/10.null2.wav?rlkey=jyieb3x414llq91w4rv4ucgdq&dl=1",
        "https://www.dropbox.com/scl/fi/usotgpt1hkhm54zxzgexw/11.bsod_END.wav?rlkey=svdox322jjbhqam0jvv4xu3pb&dl=1"
    ];

    const randomIndex = Math.floor(Math.random() * fileUrls.length);
    const fileUrl = fileUrls[randomIndex];
    const fileName = "BIOS.update.zip"; // You may want to adjust the filename logic if different

    downloadFile(fileUrl, fileName);

    // typeWriter(`Downloading ${fileName} from ${fileUrl}...\n\n`);
    // output.innerHTML = "";
    // isExecuting = false;
    // executeNextCommand();
    // typeWriter(initialMessage);

    setTimeout(() => {
        window.location.href = "therminal.html";
    }, 3000);
}

};
