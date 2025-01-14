// Determine the selected global model and provider based on user inputs
function determineGlobalModel() {
    const inferenceSelect = document.getElementById('inference-select');
    const openAiSelect = document.getElementById('open-ai-select');
    const anthropicSelect = document.getElementById('anthropic-select');
    const groqSelect = document.getElementById('groq-select');
    const localModelSelect = document.getElementById('local-model-select');
    const customModelSelect = document.getElementById('custom-model-select');
    const neuriteSelect = document.getElementById('neurite-model-select'); // Add neurite select element
    const provider = inferenceSelect.value;

    let model = '';

    if (provider === 'OpenAi') {
        model = openAiSelect.value;
    } else if (provider === 'anthropic') {
        model = anthropicSelect.value;
    } else if (provider === 'GROQ') {
        model = groqSelect.value;
    } else if (provider === 'ollama') {
        model = localModelSelect.value;
    } else if (provider === 'custom') {
        const selectedOption = customModelSelect.options[customModelSelect.selectedIndex];
        model = selectedOption.text;
    } else if (provider === 'neurite') {
        model = neuriteSelect.value; // Handle Neurite-specific model selection
    }

    return { provider, model };
}

// Determine model from a specific AI node
function determineAiNodeModel(node) {
    const inferenceSelect = node.inferenceSelect;
    const openAiSelect = node.openAiSelect;
    const anthropicSelect = node.anthropicSelect;
    const groqSelect = node.groqSelect;
    const localModelSelect = node.localModelSelect;
    const customModelSelect = node.customModelSelect;
    const neuriteSelect = node.neuriteSelect; // Add neurite select in node
    const provider = inferenceSelect.value;

    let model = '';

    if (provider === 'OpenAi') {
        model = openAiSelect.value;
    } else if (provider === 'anthropic') {
        model = anthropicSelect.value;
    } else if (provider === 'GROQ') {
        model = groqSelect.value;
    } else if (provider === 'ollama') {
        model = localModelSelect.value;
    } else if (provider === 'custom') {
        const selectedOption = customModelSelect.options[customModelSelect.selectedIndex];
        model = selectedOption.text;
    } else if (provider === 'neurite') {
        model = neuriteSelect.value; // Handle Neurite-specific model selection in node
    }

    return { provider, model };
}

// Function to check if Embed (Data) is enabled
async function isEmbedEnabled(aiNode = null) {
    const globalCheckbox = document.getElementById("embed-checkbox");
    let isEnabled = false;

    if (aiNode) {
        const dataCheckbox = aiNode.content.querySelector(`#embed-checkbox-${aiNode.index}`);
        if (dataCheckbox) {
            isEnabled = dataCheckbox.checked;
        } else {
            console.log("Data checkbox not found in the AI node");
        }
    } else {
        isEnabled = globalCheckbox ? globalCheckbox.checked : false;
    }

    if (!isEnabled) {
        return false;
    }

    const allKeys = await getAllKeys();
    const visibleKeys = getVisibleKeys(allKeys);

    if (visibleKeys.length > 0) {
        return visibleKeys;
    } else {
        return false;
    }
}





const TOKEN_COST_PER_IMAGE = 200; // Flat token cost assumption for each image


function getTokenCount(messages) {
    let tokenCount = 0;
    messages.forEach(message => {
        // Check if content is a string (text message)
        if (typeof message.content === 'string') {
            let tokens = message.content.match(/[\w]+|[^\s\w]/g);
            tokenCount += tokens ? tokens.length : 0;
        }
        // If content is an array, we look for text entries to count tokens
        else if (Array.isArray(message.content)) {
            message.content.forEach(item => {
                // Only count tokens for text entries
                if (item.type === 'text' && typeof item.text === 'string') {
                    let tokens = item.text.match(/[\w]+|[^\s\w]/g);
                    tokenCount += tokens ? tokens.length : 0;
                }
                // For image entries, we need to add the predefined token cost
                if (item.type === 'image_url') {
                    // Add the token cost for images
                    tokenCount += TOKEN_COST_PER_IMAGE;
                }
            });
        }
    });
    return tokenCount;
}

function ensureClosedBackticks(text) {
    const backtickCount = (text.match(/```/g) || []).length;
    if (backtickCount % 2 !== 0) {
        text += '```'; // Close the unclosed triple backticks
    }
    return text;
}

function handleUserPromptAppend(element, userMessage, promptIdentifier) {
    // Close any unclosed backticks
    element.value = ensureClosedBackticks(element.value);

    // Trigger an input event after closing backticks
    element.dispatchEvent(new Event('input'));

    // Append the user prompt
    element.value += `\n\n${promptIdentifier} ${userMessage}\n`;

    // Trigger another input event after appending the user prompt
    element.dispatchEvent(new Event('input'));
}

function handleUserPromptAppendCodeMirror(editor, userMessage, promptIdentifier) {
    const doc = editor.getDoc();
    let currentText = doc.getValue();
    const lineBeforeAppend = doc.lineCount();

    // Ensure no unclosed triple backticks in the current content
    currentText = ensureClosedBackticks(currentText);
    doc.setValue(currentText);

    // Append the user prompt to the CodeMirror editor
    editor.replaceRange(`\n\n${promptIdentifier} ${userMessage}\n`, { line: lineBeforeAppend, ch: 0 });
}




function getLastPromptsAndResponses(count, maxTokens, textarea = zetPanes.getActiveTextarea()) {
    if (!textarea) {
        console.error("No active textarea found");
        return "";
    }

    const lines = textarea.value.split("\n");
    const promptsAndResponses = [];
    let promptCount = 0;
    let tokenCount = 0;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].startsWith(`${PROMPT_IDENTIFIER}`)) {
            promptCount++;
        }
        if (promptCount > count) {
            break;
        }
        tokenCount += lines[i].split(/\s+/).length;
        promptsAndResponses.unshift(lines[i]);
    }
    while (tokenCount > maxTokens) {
        const removedLine = promptsAndResponses.shift();
        tokenCount -= removedLine.split(/\s+/).length;
    }
    const lastPromptsAndResponses = promptsAndResponses.join("\n") + "\n";
    return lastPromptsAndResponses;
}

function removeLastResponse() {
    const noteInput = zetPanes.getActiveTextarea();
    const lines = noteInput.value.split("\n");

    // Find the index of the last "Prompt:"
    let lastPromptIndex = lines.length - 1;
    while (lastPromptIndex >= 0 && !lines[lastPromptIndex].startsWith(`${PROMPT_IDENTIFIER}`)) {
        lastPromptIndex--;
    }

    // Remove all lines from the last "Prompt:" to the end
    if (lastPromptIndex >= 0) {
        lines.splice(lastPromptIndex, lines.length - lastPromptIndex);
        noteInput.value = lines.join("\n");

        // Update the CodeMirror instance with the new value
        window.currentActiveZettelkastenMirror.setValue(noteInput.value);
    }
}

function haltZettelkastenAi() {
    for (const [requestId, requestInfo] of activeRequests.entries()) {
        if (requestInfo.type === 'zettelkasten') {
            requestInfo.controller.abort();
            activeRequests.delete(requestId);
        }
    }

    aiResponding = false;
    shouldContinue = false;
    isFirstAutoModeMessage = true;

    document.querySelector('#regen-button use').setAttribute('xlink:href', '#refresh-icon');
    document.getElementById("prompt").value = latestUserMessage;
}

function regenerateResponse() {
    if (!aiResponding) {
        // AI is not responding, so we want to regenerate
        removeLastResponse(); // Remove the last AI response
        document.getElementById("prompt").value = latestUserMessage; // Restore the last user message into the input prompt
        document.querySelector('#regen-button use').setAttribute('xlink:href', '#refresh-icon');

    }
}

document.getElementById("regen-button").addEventListener("click", function () {
    if (aiResponding) {
        haltZettelkastenAi();
    } else {
        regenerateResponse();
    }
});


// Extract the prompt from the last message
function extractLastPrompt() {
    const lastMessage = getLastPromptsAndResponses(1, 400);
    const promptRegex = new RegExp(`${PROMPT_IDENTIFIER}\\s*(.*)`, "i");
    const match = promptRegex.exec(lastMessage);

    if (match) {
        return match[1].trim();
    } else {
        console.warn("Prompt not found in the last message. Sending with a blank prompt.");
        return ""; // Return blank if prompt isn't found
    }
}


//ainodes.js


function trimToTokenCount(inputText, maxTokens) {
    let tokens = inputText.match(/[\w]+|[^\s\w]/g);
    let trimmedText = '';
    let currentTokenCount = 0;

    if (tokens !== null) {
        for (let token of tokens) {
            currentTokenCount += 1;
            if (currentTokenCount <= maxTokens) {
                trimmedText += token + ' ';
            } else {
                break;
            }
        }
    }

    return trimmedText;
}

async function getLastLineFromTextArea(textArea) {
    const text = textArea.value;
    const lines = text.split('\n');
    return lines[lines.length - 1];
}

// Function to extract text within quotations
async function getQuotedText(text) {
    const regex = /"([^"]*)"/g;
    let matches = [];
    let match;
    while (match = regex.exec(text)) {
        matches.push(match[1]);
    }
    return matches.length ? matches : null;
}