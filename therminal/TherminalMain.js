const output = document.getElementById("output");
const input = document.getElementById("input");
const prompt = document.getElementById("prompt");

const isInIframe = window.self !== window.top;

let encryptedMessage = "";
const correctPassword = "authorized-4155-&4&389";

let isCompletingPGPPuzzle = false;
let isExecuting = false;
let isOrderingBIOSUpdate = false;
const commandQueue = [];

function scrollToBottom() {
    // Create a new element to scroll to
    const dummy = document.createElement("div");
    prompt.appendChild(dummy);
    // Use setTimeout to ensure the scroll happens after rendering
    setTimeout(() => {
        dummy.scrollIntoView({ behavior: 'smooth', block: 'end' });
        dummy.remove();
    }, 0);
}

function typeWriter(text, callback, index = 0) {
    if (index < text.length) {
        output.innerHTML += text.charAt(index);
        if (index % 10 === 0) { // Scroll every 10 characters
            scrollToBottom();
        }
        setTimeout(() => typeWriter(text, callback, index + 1), 5);
    } else {
        scrollToBottom();
        isExecuting = false;
        if (callback) callback();
        executeNextCommand();
    }
}

function executeNextCommand() {
    if (commandQueue.length > 0 && !isExecuting) {
        const nextCommand = commandQueue.shift();
        processCommand(nextCommand);
    } else {
        input.disabled = false;
        input.focus();
    }
}

function processCommand(userInput, printCommand = true) {
    isExecuting = true;
    if(printCommand === true){
        output.innerHTML += `> ${userInput}\n\n`;
    }
    scrollToBottom();

    if (isCompletingPGPPuzzle) {
        handlePGPPuzzle(userInput);
    } else if (isOrderingBIOSUpdate) {
        processPGPMessage(userInput);
    } else if (isContactFormActive) {
        handleContactForm(userInput);
    } else {
        const [command, ...args] = userInput.toLowerCase().split(" ");
        if (command in commands) {
            if (command === 'exit' && !isInIframe || (command === 'maximize' && !isInIframe)) {
                typeWriter(`The '${command}' command is not available in this mode.\n\n`);
            } else {
                commands[command](args);
            }
        } else {
            typeWriter(`Command not recognized: ${command}\nType 'help' for a list of available commands.\n\n`);
        }
    }
}

input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const userInput = input.value.trim();
        input.value = "";
        if (isExecuting) {
            commandQueue.push(userInput);
        } else {
            processCommand(userInput);
        }
    }
});

const initialMessage = `Welcome to the Therminal.
Type 'help' for a list of available commands.\n\n`;

typeWriter(initialMessage);

// Ensure scrolling works on mobile devices
output.addEventListener('touchstart', function(e) {
    if (e.target.scrollTop === 0) {
        e.target.scrollTop = 1;
    } else if (e.target.scrollHeight === e.target.scrollTop + e.target.offsetHeight) {
        e.target.scrollTop -= 1;
    }
});

// Prevent default touch behavior to allow scrolling
output.addEventListener('touchmove', function(e) {
    e.stopPropagation();
}, { passive: false });

// Ensure scrolling works when the iframe is resized
window.addEventListener('resize', scrollToBottom);

// Function to get URL parameters
function getUrlParameters() {
    return new URLSearchParams(window.location.search);
}

// Process URL parameters as commands
function processUrlCommands() {
    const params = getUrlParameters();
    params.forEach((value, key) => {
        processCommand(`${key} ${value}`, false);
    });
}

// Call the function to process URL commands on page load
setTimeout(() => { processUrlCommands(); }, 2000);


