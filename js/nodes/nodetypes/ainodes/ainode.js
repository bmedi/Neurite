
function createLLMNode(name = '', sx = undefined, sy = undefined, x = undefined, y = undefined) {
    // Create the AI response textarea
    let aiResponseTextArea = document.createElement("textarea");
    aiResponseTextArea.id = `LLMnoderesponse-${llmNodeCount}`;
    aiResponseTextArea.style.display = 'none';

    // Create the AI response container
    let aiResponseDiv = document.createElement("div");
    aiResponseDiv.id = `LLMnoderesponseDiv-${llmNodeCount}`;
    aiResponseDiv.classList.add('custom-scrollbar', 'ai-response-div');

    // Create the user prompt textarea
    let promptTextArea = document.createElement("textarea");
    promptTextArea.id = `nodeprompt-${llmNodeCount}`;
    promptTextArea.classList.add('custom-scrollbar', 'custom-textarea');

    // Create the send button (keeping inline styles)
    let sendButton = document.createElement("button");
    sendButton.type = "submit";
    sendButton.id = `prompt-form-${llmNodeCount}`;
    sendButton.style.cssText = "display: flex; justify-content: center; align-items: center; padding: 3px; z-index: 1; font-size: 14px; cursor: pointer; background-color: #222226; transition: background-color 0.3s; border: inset; border-color: #8882; width: 30px; height: 30px;";
    sendButton.innerHTML = `<svg width="24" height="24"><use xlink:href="#play-icon"></use></svg>`;

    // Create the regenerate button (keeping inline styles)
    let regenerateButton = document.createElement("button");
    regenerateButton.type = "button";
    regenerateButton.id = "prompt-form";
    regenerateButton.style.cssText = "display: flex; justify-content: center; align-items: center; padding: 3px; z-index: 1; font-size: 14px; cursor: pointer; background-color: #222226; transition: background-color 0.3s; border: inset; border-color: #8882; width: 30px; height: 30px;";
    regenerateButton.innerHTML = `<svg width="24" height="24"><use xlink:href="#refresh-icon"></use></svg>`;

    // Create settings button (keeping inline styles)
    const aiNodeSettingsButton = document.createElement('button');
    aiNodeSettingsButton.type = "button";
    aiNodeSettingsButton.id = 'aiNodeSettingsButton';
    aiNodeSettingsButton.style.cssText = "display: flex; justify-content: center; align-items: center; padding: 3px; z-index: 1; font-size: 14px; cursor: pointer; background-color: #222226; transition: background-color 0.3s; border: inset; border-color: #8882; width: 30px; height: 30px;";
    const settingsIcon = document.getElementById('aiNodeSettingsIcon').cloneNode(true);
    settingsIcon.style.display = 'inline-block';
    aiNodeSettingsButton.appendChild(settingsIcon);
    aiNodeSettingsButton.isActive = false;

    // Create the loader and error icons container (keeping inline styles)
    let statusIconsContainer = document.createElement("div");
    statusIconsContainer.className = 'status-icons-container';
    statusIconsContainer.style.cssText = 'position: absolute; top: 42px; right: 90px; width: 20px; height: 20px;';

    // Create the loader icon
    let aiLoadingIcon = document.createElement("div");
    aiLoadingIcon.className = 'loader';
    aiLoadingIcon.id = `aiLoadingIcon-${llmNodeCount}`;
    aiLoadingIcon.style.display = 'none';

    // Create the error icon
    let aiErrorIcon = document.createElement("div");
    aiErrorIcon.className = 'error-icon-css';
    aiErrorIcon.id = `aiErrorIcon-${llmNodeCount}`;
    aiErrorIcon.style.display = 'none';

    // Create the 'X' mark inside the error icon
    let xMark = document.createElement("div");
    xMark.className = 'error-x-mark';
    let xMarkLeft = document.createElement("div");
    xMarkLeft.className = 'error-x-mark-left';
    let xMarkRight = document.createElement("div");
    xMarkRight.className = 'error-x-mark-right';
    xMark.appendChild(xMarkLeft);
    xMark.appendChild(xMarkRight);
    aiErrorIcon.appendChild(xMark);

    // Append loader and error icons to container
    statusIconsContainer.appendChild(aiLoadingIcon);
    statusIconsContainer.appendChild(aiErrorIcon);

    // Create a div to wrap prompt textarea and buttons
    let buttonDiv = document.createElement("div");
    buttonDiv.className = 'button-container';
    buttonDiv.appendChild(sendButton);
    buttonDiv.appendChild(regenerateButton);
    buttonDiv.appendChild(aiNodeSettingsButton);

    // Create the promptDiv
    let promptDiv = document.createElement("div");
    promptDiv.className = 'prompt-container';
    promptDiv.appendChild(statusIconsContainer);
    promptDiv.appendChild(promptTextArea);
    promptDiv.appendChild(buttonDiv);

    // Wrap elements in a div
    let ainodewrapperDiv = document.createElement("div");
    ainodewrapperDiv.className = 'ainodewrapperDiv';

    ainodewrapperDiv.appendChild(aiResponseTextArea);
    ainodewrapperDiv.appendChild(aiResponseDiv);
    ainodewrapperDiv.appendChild(promptDiv);

    const initialTemperature = document.getElementById('model-temperature').value;
    const initialMaxTokens = document.getElementById('max-tokens-slider').value;
    const initialMaxContextSize = document.getElementById('max-context-size-slider').value;

    // Create and configure the settings
    const aiNodeDropdownContainer = createAndConfigureLocalLLMDropdown(llmNodeCount);

    const temperatureSliderContainer = createSlider(`node-temperature-${llmNodeCount}`, 'Temperature', initialTemperature, 0, 1, 0.1);
    const maxTokensSliderContainer = createSlider(`node-max-tokens-${llmNodeCount}`, 'Max Tokens', initialMaxTokens, 10, 16000, 1);
    const maxContextSizeSliderContainer = createSlider(`node-max-context-${llmNodeCount}`, 'Max Context', initialMaxContextSize, 1, initialMaxTokens, 1);


    // Create settings container
    const aiNodeSettingsContainer = createSettingsContainer();


    // Add the dropdown (LocalLLMSelect) into settings container
    aiNodeSettingsContainer.appendChild(aiNodeDropdownContainer);  // LocalLLMSelect is the existing dropdown
    aiNodeSettingsContainer.appendChild(temperatureSliderContainer);
    aiNodeSettingsContainer.appendChild(maxTokensSliderContainer);
    aiNodeSettingsContainer.appendChild(maxContextSizeSliderContainer);

    const firstSixOptions = allOptions.slice(0, 6);
    const checkboxArray1 = createCheckboxArray(llmNodeCount, firstSixOptions);
    aiNodeSettingsContainer.appendChild(checkboxArray1);

    const { containerDiv, textarea: customInstructionsTextarea } = createCustomInstructionsTextarea(llmNodeCount);
    aiNodeSettingsContainer.appendChild(containerDiv);

    // Add settings container to the ainodewrapperDiv
    ainodewrapperDiv.appendChild(aiNodeSettingsContainer);

    // Pass this div to addNodeAtNaturalScale
    let node = addNodeAtNaturalScale(name, []);

    let windowDiv = node.windowDiv;
    windowDiv.style.resize = 'both';
    windowDiv.style.minWidth = `450px`;
    windowDiv.style.minHeight = `535px`;

    // Append the ainodewrapperDiv to windowDiv of the node
    windowDiv.appendChild(ainodewrapperDiv);
    // Additional configurations
    node.id = aiResponseTextArea.id;  // Store the id in the node object
    node.index = llmNodeCount;
    node.aiResponding = false;
    node.localAiResponding = false;
    node.latestUserMessage = null;
    node.shouldContinue = true;

    node.isLLMNode = true;
    node.shouldAppendQuestion = false;
    node.aiResponseHalted = false;
    node.savedLLMSelection = '';

    node.currentTopNChunks = null;

    node.push_extra_cb((node) => {
        return {
            f: "textarea",
            a: {
                p: [0, 0, 1],
                v: node.titleInput.value
            }
        };
    });

    node.push_extra_cb((node) => {
        return {
            f: "textareaId",
            a: {
                p: customInstructionsTextarea.id,
                v: customInstructionsTextarea.value
            }
        };
    });

    node.push_extra_cb((node) => {
        return {
            f: "textareaId",
            a: {
                p: promptTextArea.id,
                v: promptTextArea.value
            }
        };
    });

    node.push_extra_cb((node) => {
        return {
            f: "textareaId",
            a: {
                p: aiResponseTextArea.id,
                v: aiResponseTextArea.value
            }
        };
    });

    const checkboxes = node.content.querySelectorAll('.checkboxarray input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        node.push_extra_cb((node) => {
            return {
                f: "checkboxId",
                a: {
                    p: checkbox.id,
                    v: checkbox.checked
                }
            };
        });
    });

    // Fetch default values from DOM elements and sliders
    const defaultTemperature = document.getElementById('model-temperature').value;
    const defaultMaxTokens = document.getElementById('max-tokens-slider').value;
    const defaultMaxContextSize = document.getElementById('max-context-size-slider').value;

    // Set initial values for sliders using node.push_extra_cb
    node.push_extra_cb((node) => {
        return {
            f: "sliderId",
            a: {
                p: 'node-temperature-' + node.index,
                v: node.temperature,
                d: defaultTemperature
            }
        };
    });

    node.push_extra_cb((node) => {
        return {
            f: "sliderId",
            a: {
                p: 'node-max-tokens-' + node.index,
                v: node.maxTokens,
                d: defaultMaxTokens
            }
        };
    });

    node.push_extra_cb((node) => {
        return {
            f: "sliderId",
            a: {
                p: 'node-max-context-' + node.index,
                v: node.maxContextSize,
                d: defaultMaxContextSize
            }
        };
    });


    node.isLLM = true;

    initAiNode(node);


    return node;
}

function initAiNode(node) {
    llmNodeCount++;

    let ainodewrapperDiv = node.content.querySelector('.ainodewrapperDiv')
    node.ainodewrapperDiv = ainodewrapperDiv;

    let aiResponseDiv = node.content.querySelector('[id^="LLMnoderesponseDiv-"]');
    node.aiResponseDiv = aiResponseDiv;

    let aiResponseTextArea = node.content.querySelector('[id^="LLMnoderesponse-"]');
    node.aiResponseTextArea = aiResponseTextArea;

    let promptTextArea = node.content.querySelector('[id^="nodeprompt-"]');
    node.promptTextArea = promptTextArea;

    let sendButton = node.content.querySelector('[id^="prompt-form-"]');
    node.sendButton = sendButton;

    let haltCheckbox = node.content.querySelector('input[id^="halt-questions-checkbox"]');
    node.haltCheckbox = haltCheckbox;

    let regenerateButton = node.content.querySelector('#prompt-form');
    node.regenerateButton = regenerateButton;

    //This is now the container for our inferenence select dropdown.
    let localLLMSelect = node.content.querySelector(`.local-llm-dropdown-container-${node.index}`);
    node.localLLMSelect = localLLMSelect;


    let customInstructionsTextarea = node.content.querySelector('.custom-instructions-textarea');
    node.customInstructionsTextarea = customInstructionsTextarea;

    // Initialize inference dropdowns
    initInferenceDropdown(node);

    // Setup event listeners
    setupAiNodeResponseDivListeners(node);
    setupAiNodePromptTextAreaListeners(node);
    setupAiNodeSendButtonListeners(node);
    setupAiNodeRegenerateButtonListeners(node);
    setupAiNodeSettingsButtonListeners(node);
    setupAiNodeLocalLLMDropdownListeners(node);
    setupAiNodeSliderListeners(node);
    setupCustomInstructionsListeners(node);

    // Functions

    node.controller = new AbortController();

    //Handles parsing of conversation divs.
    let responseHandler = new ResponseHandler(node);
    nodeResponseHandlers.set(node, responseHandler); // map response handler to node

    node.removeLastResponse = responseHandler.removeLastResponse.bind(responseHandler);
    responseHandler.restoreAiResponseDiv()


    node.haltResponse = () => aiNodeHaltResponse(node);
}

function aiNodeHaltResponse(node) {
    if (node.aiResponding) {
        // AI is responding, so we want to stop it
        node.controller.abort(); // Send the abort signal to the fetch request
        node.aiResponding = false;
        node.shouldContinue = false;
        node.regenerateButton.innerHTML = `
            <svg width="24" height="24" class="icon">
                <use xlink:href="#refresh-icon"></use>
            </svg>`;
        node.promptTextArea.value = node.latestUserMessage; // Add the last user message to the prompt input

        // Access the responseHandler from the nodeResponseHandlers map
        let responseHandler = nodeResponseHandlers.get(node);

        // If currently in a code block
        if (responseHandler && responseHandler.inCodeBlock) {
            // Add closing backticks to the current code block content
            responseHandler.codeBlockContent += '```\n';

            // Render the final code block
            responseHandler.renderCodeBlock(responseHandler.codeBlockContent, true);

            // Reset the code block state
            responseHandler.codeBlockContent = '';
            responseHandler.codeBlockStartIndex = -1;
            responseHandler.inCodeBlock = false;

            // Clear the textarea value to avoid reprocessing
            node.aiResponseTextArea.value = responseHandler.previousContent + responseHandler.codeBlockContent;

            // Update the previous content length
            responseHandler.previousContentLength = node.aiResponseTextArea.value.length;
            node.aiResponseTextArea.dispatchEvent(new Event('input'));
        }
        node.aiResponseHalted = true;
    }

    // Update the halt checkbox to reflect the halted state
    const haltCheckbox = node.haltCheckbox;
    if (haltCheckbox) {
        haltCheckbox.checked = true;
    }

    // Reinitialize the controller for future use
    node.controller = new AbortController();

    // Remove the node's request from activeRequests
    for (const [requestId, requestInfo] of activeRequests.entries()) {
        if (requestInfo.type === 'node' && requestInfo.node === node) {
            activeRequests.delete(requestId);
            break;
        }
    }
}

function setupAiNodeResponseDivListeners(node) {
    let aiResponseDiv = node.aiResponseDiv;
    let aiResponseTextArea = node.aiResponseTextArea;
    aiResponseDiv.onmousedown = function (event) {
        if (!event.altKey) {
            cancel(event);
        }
    };

    aiResponseDiv.addEventListener('mouseenter', function () {
        aiResponseDiv.style.userSelect = "text";
    });
    aiResponseDiv.addEventListener('mouseleave', function () {
        aiResponseDiv.style.userSelect = "none";
    });

    // Add a 'wheel' event listener
    aiResponseDiv.addEventListener('wheel', function (event) {
        // If the Shift key is not being held down, stop the event propagation
        if (!nodeMode) {
            event.stopPropagation();
        }
    }, { passive: false });

    let userHasScrolled = false;

    // Function to scroll to bottom
    const scrollToBottom = () => {
        if (!userHasScrolled) {
            setTimeout(() => {
                aiResponseDiv.scrollTo({
                    top: aiResponseDiv.scrollHeight,
                    behavior: 'smooth'
                });
            }, 0);
        }
    };

    // Call scrollToBottom whenever there's an input
    aiResponseTextArea.addEventListener('input', scrollToBottom);


    // Tolerance in pixels
    const epsilon = 5;

    // Function to handle scrolling
    const handleScroll = () => {
        if (Math.abs(aiResponseDiv.scrollTop + aiResponseDiv.clientHeight - aiResponseDiv.scrollHeight) > epsilon) {
            userHasScrolled = true;
        } else {
            userHasScrolled = false;
        }
    };

    // Event listener for scrolling
    aiResponseDiv.addEventListener('scroll', handleScroll);

    // Disable text highlighting when Alt key is down and re-enable when it's up
    document.addEventListener('keydown', function (event) {
        if (event.altKey) {
            aiResponseDiv.style.userSelect = 'none';
        }
    });

    document.addEventListener('keyup', function (event) {
        if (!event.altKey) {
            aiResponseDiv.style.userSelect = 'text';
        }
    });

    // ... other event listeners for aiResponseDiv ...
}


function setupAiNodePromptTextAreaListeners(node) {
    let promptTextArea = node.promptTextArea

    promptTextArea.onmousedown = cancel;  // Prevent dragging
    promptTextArea.addEventListener('input', autoGrow);
    promptTextArea.addEventListener('focus', autoGrow);
    promptTextArea.addEventListener('mouseenter', function () {
        promptTextArea.style.userSelect = "text";
    });
    promptTextArea.addEventListener('mouseleave', function () {
        promptTextArea.style.userSelect = "none";
    });
    promptTextArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendLLMNodeMessage(node);
        }
    });
    // ... other event listeners for promptTextArea ...
}

function setupAiNodeSendButtonListeners(node) {
    let sendButton = node.sendButton;

    let haltCheckbox = node.haltCheckbox;

    sendButton.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#293e34';
        this.style.color = '#222226';
    });

    sendButton.addEventListener('mouseout', function () {
        this.style.backgroundColor = '#222226';
        this.style.color = '#ddd';
    });
    sendButton.addEventListener('mousedown', function () {
        this.style.backgroundColor = '#45a049';
    });
    sendButton.addEventListener('mouseup', function () {
        this.style.backgroundColor = '#ddd';
    });

    sendButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Reset the flag and uncheck the checkbox
        node.aiResponseHalted = false;
        node.shouldContinue = true;

        if (haltCheckbox) {
            haltCheckbox.checked = false;
        }

        sendLLMNodeMessage(node);
    });

    if (haltCheckbox) {
        haltCheckbox.addEventListener('change', function () {
            node.aiResponseHalted = this.checked;
            if (this.checked) {
                node.haltResponse();
            }
        });
    }
}

function setupAiNodeRegenerateButtonListeners(node) {
    let regenerateButton = node.regenerateButton;

    regenerateButton.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#333';
    });
    regenerateButton.addEventListener('mouseout', function () {
        this.style.backgroundColor = '#222226';
    });
    regenerateButton.addEventListener('mousedown', function () {
        this.style.backgroundColor = '#45a049';
    });
    regenerateButton.addEventListener('mouseup', function () {
        this.style.backgroundColor = '#222226';
    });


    node.regenerateResponse = function () {
        if (!this.aiResponding) {
            // AI is not responding, so we want to regenerate
            this.removeLastResponse(); // Remove the last AI response
            this.promptTextArea.value = this.latestUserMessage; // Restore the last user message into the input prompt
            this.regenerateButton.innerHTML = `
    <svg width="24" height="24" class="icon">
        <use xlink:href="#refresh-icon"></use>
    </svg>`;
        }
    };

    regenerateButton.addEventListener("click", function () {
        if (node.aiResponding) {
            // If the AI is currently responding, halt the response
            node.haltResponse();
        } else {
            // Otherwise, regenerate the response
            node.regenerateResponse();
        }
    });
}

function setupAiNodeSettingsButtonListeners(node) {
    let aiNodeSettingsButton = node.content.querySelector('#aiNodeSettingsButton');
    let aiNodeSettingsContainer = node.content.querySelector('.ainode-settings-container');

    aiNodeSettingsButton.addEventListener('mouseover', function () {
        this.style.backgroundColor = this.isActive ? '#1e3751' : '#333';
    });
    aiNodeSettingsButton.addEventListener('mouseout', function () {
        this.style.backgroundColor = this.isActive ? '#1e3751' : '#222226';
    });
    aiNodeSettingsButton.addEventListener('mousedown', function () {
        this.style.backgroundColor = '#1e3751';
    });
    aiNodeSettingsButton.addEventListener('mouseup', function () {
        this.style.backgroundColor = this.isActive ? '#1e3751' : '#333';
    });
    aiNodeSettingsButton.addEventListener('click', function (event) {
        this.isActive = !this.isActive;  // Toggle the active state
        toggleSettings(event, aiNodeSettingsContainer);  // Call your existing function
        // Set the background color based on the new active state
        this.style.backgroundColor = this.isActive ? '#1e3751' : '#333';
    });

    // Add the listener for mousedown event
    aiNodeSettingsContainer.addEventListener('mousedown', conditionalStopPropagation, false);

    // Add the listener for dblclick event
    aiNodeSettingsContainer.addEventListener('dblclick', conditionalStopPropagation, false);
}

function conditionalStopPropagation(event) {
    if (!event.getModifierState(controls.altKey.value)) {
        event.stopPropagation();
    }
}

function createSettingsContainer() {
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'ainode-settings-container';
    settingsContainer.style.display = 'none';  // Initially hidden

    return settingsContainer;
}

// Function to toggle the settings container
function toggleSettings(event, settingsContainer) {
    event.stopPropagation();
    const display = settingsContainer.style.display;
    settingsContainer.style.display = display === 'none' || display === '' ? 'grid' : 'none';
}


function createSlider(id, label, initialValue, min, max, step) {
    const sliderDiv = document.createElement('div');
    sliderDiv.classList.add('slider-container');

    const sliderLabel = document.createElement('label');
    sliderLabel.setAttribute('for', id);
    sliderLabel.innerText = `${label}: ${initialValue}`;

    const sliderInput = document.createElement('input');
    sliderInput.type = 'range';
    sliderInput.id = id;

    // First, set the min and max
    sliderInput.min = min;
    sliderInput.max = max;

    // Then, set the step and initial value
    sliderInput.step = step;
    sliderInput.value = initialValue;

    sliderDiv.appendChild(sliderLabel);
    sliderDiv.appendChild(sliderInput);

    return sliderDiv;
}

function setupAiNodeSliderListeners(node) {
    const sliders = node.content.querySelectorAll('input[type=range]');

    sliders.forEach(slider => {
        // Attach event listener to each slider
        slider.addEventListener('input', function () {
            // Retrieve the associated label within the node
            const label = node.content.querySelector(`label[for='${slider.id}']`);
            if (label) {
                // Extract the base label text (part before the colon)
                const baseLabelText = label.innerText.split(':')[0];
                label.innerText = `${baseLabelText}: ${slider.value}`;

                setSliderBackground(slider);  // Assuming this is a predefined function
            }
            // Additional logic for each slider, if needed
        });

        // Trigger the input event to set initial state
        slider.dispatchEvent(new Event('input'));
    });

    setupContextSpecificSliderListeners(node);
}

function setupContextSpecificSliderListeners(node) {
    // Event listener for maxContextSizeSlider
    const maxContextSizeSlider = node.content.querySelector('#node-max-context-' + node.index);
    if (maxContextSizeSlider) {
        maxContextSizeSlider.addEventListener('input', function () {
            const maxContextSizeLabel = node.content.querySelector(`label[for='node-max-context-${node.index}']`);
            if (maxContextSizeLabel) {
                const maxContextValue = parseInt(this.value, 10);
                const maxContextMax = parseInt(this.max, 10);
                const ratio = Math.round((maxContextValue / maxContextMax) * 100);
                maxContextSizeLabel.innerText = `Context: ${ratio}% (${maxContextValue} tokens)`;
            }
        });
    }

    // Handle synchronization if both sliders are present
    const maxTokensSlider = node.content.querySelector('#node-max-tokens-' + node.index);
    if (maxTokensSlider && maxContextSizeSlider) {
        aiTab.autoContextTokenSync(maxTokensSlider, maxContextSizeSlider);
    }

    // Additional specific behaviors for other sliders can be added here
}

function initInferenceDropdown(node) {
    const nodeIndex = node.index;

    // Query and assign dropdowns to the node
    node.inferenceSelect = node.content.querySelector(`#inference-select-${nodeIndex}`);
    node.openAiSelect = node.content.querySelector(`#open-ai-select-${nodeIndex}`);
    node.anthropicSelect = node.content.querySelector(`#anthropic-select-${nodeIndex}`);
    node.groqSelect = node.content.querySelector(`#groq-select-${nodeIndex}`);
    node.localModelSelect = node.content.querySelector(`#local-model-select-${nodeIndex}`);
    node.customModelSelect = node.content.querySelector(`#custom-model-select-${nodeIndex}`);
    node.neuriteSelect = node.content.querySelector(`#neurite-model-select-${nodeIndex}`);
}

function setupAiNodeLocalLLMDropdownListeners(node) {
    // Setup custom dropdown for each dropdown in the node
    const dropdowns = node.localLLMSelect.querySelectorAll('.model-selector.custom-select');
    dropdowns.forEach(dropdown => {
        if (!dropdown.dataset.initialized) {
            // Set the options for the dropdowns within the node
            refreshAiNodeOptions(node, true); // setOptions to true
            setupCustomDropdown(dropdown, true); // Set delayListeners to true
            dropdown.dataset.initialized = 'true'; // Mark this dropdown as initialized
        } else {
            restoreDropdownState(dropdown);
        }
        addEventListenersToCustomDropdown(dropdown);

        dropdown.addEventListener('change', () => {
            refreshAiNodeOptions(node);
        });

        // Add click event listener to the dropdown container
        const dropdownContainer = dropdown.closest('.dropdown-container');
        dropdownContainer.addEventListener('click', () => {
            refreshAiNodeOptions(node);
        });
    });

    const templateDropdownsContainer = node.localLLMSelect;
    setupInferenceDropdowns(templateDropdownsContainer);
}

function createAndConfigureLocalLLMDropdown(nodeIndex) {
    const inferenceTemplate = document.createElement('div');
    inferenceTemplate.className = `local-llm-dropdown-container-${nodeIndex}`; // Add a class for easier selection
    inferenceTemplate.classList.add('inference-template-wrapper');

    // Create dropdown elements without options
    const inferenceSelect = createDropdown(`inference-select-${nodeIndex}`);
    const openAiSelect = createDropdown(`open-ai-select-${nodeIndex}`);
    const anthropicSelect = createDropdown(`anthropic-select-${nodeIndex}`);
    const groqSelect = createDropdown(`groq-select-${nodeIndex}`);
    const ollamaSelect = createDropdown(`local-model-select-${nodeIndex}`);
    const customSelect = createDropdown(`custom-model-select-${nodeIndex}`);
    const neuriteSelect = createDropdown(`neurite-model-select-${nodeIndex}`);

    // Append Inference
    inferenceTemplate.appendChild(createDropdownWrapper(inferenceSelect, 'wrapper-inference', nodeIndex));

    // Append dropdowns to the node element
    inferenceTemplate.appendChild(createDropdownWrapper(openAiSelect, 'wrapper-openai', nodeIndex));
    inferenceTemplate.appendChild(createDropdownWrapper(anthropicSelect, 'wrapper-anthropic', nodeIndex));
    inferenceTemplate.appendChild(createDropdownWrapper(groqSelect, 'wrapper-groq', nodeIndex));
    inferenceTemplate.appendChild(createDropdownWrapper(ollamaSelect, 'wrapper-ollama', nodeIndex));
    inferenceTemplate.appendChild(createDropdownWrapper(customSelect, 'wrapper-custom', nodeIndex));
    inferenceTemplate.appendChild(createDropdownWrapper(neuriteSelect, 'wrapper-neurite', nodeIndex));

    return inferenceTemplate;
}

function syncOptions(sourceId, target, storageKey) {
    const sourceSelect = document.getElementById(sourceId);
    const targetSelect = target;

    // Extract existing values from the source select
    const sourceValues = new Set(Array.from(sourceSelect.options).map(option => option.value));

    // Remove options from targetSelect that do not exist in sourceSelect
    Array.from(targetSelect.options).forEach(option => {
        if (!sourceValues.has(option.value)) {
            targetSelect.removeChild(option);
            refreshCustomDropdownDisplay(targetSelect);
        }
    });

    // Extract existing values from the target select after removal
    const existingValues = new Set(Array.from(targetSelect.options).map(option => option.value));

    // Add options from sourceSelect to targetSelect if they do not already exist
    Array.from(sourceSelect.options).forEach(option => {
        const optionValue = option.value;
        if (!existingValues.has(optionValue)) {
            const optionData = { text: option.text, value: option.value, key: option.getAttribute('data-key') };
            addOptionToCustomDropdown(targetSelect, optionData);
            existingValues.add(optionValue);
        }
    });
}

function refreshAiNodeOptions(node, setValues = false) {
    // Sync options from global dropdowns to node-specific dropdowns
    syncOptions('inference-select', node.inferenceSelect, 'inference-select-storage');
    syncOptions('open-ai-select', node.openAiSelect, 'open-ai-select-storage');
    syncOptions('anthropic-select', node.anthropicSelect, 'anthropic-select-storage');
    syncOptions('groq-select', node.groqSelect, 'groq-select-storage');
    syncOptions('local-model-select', node.localModelSelect, 'local-model-select-storage');
    syncOptions('custom-model-select', node.customModelSelect, 'custom-model-select-storage');
    syncOptions('neurite-model-select', node.neuriteSelect, 'neurite-model-select-storage');

    if (setValues) {
        // Set the selected value of the target dropdowns based on the selected value of the source dropdowns
        setSelectedValue('inference-select', node.inferenceSelect);
        setSelectedValue('open-ai-select', node.openAiSelect);
        setSelectedValue('anthropic-select', node.anthropicSelect);
        setSelectedValue('groq-select', node.groqSelect);
        setSelectedValue('local-model-select', node.localModelSelect);
        setSelectedValue('custom-model-select', node.customModelSelect);
        setSelectedValue('neurite-model-select', node.neuriteSelect);
    }
}

function setSelectedValue(sourceId, targetSelect) {
    const sourceSelect = document.getElementById(sourceId);
    const selectedValue = sourceSelect.value;

    // Set the selected value of the target select element
    targetSelect.value = selectedValue;
}

const allOptions = [
    { id: 'google-search', label: 'Search' },
    { id: 'code', label: 'Code' },
    { id: 'halt-questions', label: 'Halt' },
    { id: 'embed', label: 'Data' },
    { id: 'enable-wolfram-alpha', label: 'Wolfram' },
    { id: 'wiki', label: 'Wiki' }
];

// Function to create a checkbox array with a subset of options
function createCheckboxArray(llmNodeCount, subsetOptions) {
    const checkboxArrayDiv = document.createElement('div');
    checkboxArrayDiv.className = 'checkboxarray';

    for (const option of subsetOptions) {
        const checkboxDiv = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${option.id}-checkbox-${llmNodeCount}`;
        checkbox.name = `${option.id}-checkbox-${llmNodeCount}`;

        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.innerText = option.label;

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        checkboxArrayDiv.appendChild(checkboxDiv);
    }

    return checkboxArrayDiv;
}

function createCustomInstructionsTextarea(llmNodeCount) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'custom-instructions-container';

    const promptLibraryButton = document.createElement('button');
    promptLibraryButton.textContent = 'Prompt Library';
    promptLibraryButton.className = 'prompt-library-button';

    const textarea = document.createElement('textarea');
    textarea.className = 'custom-instructions-textarea custom-scrollbar';
    textarea.placeholder = 'Enter custom instructions here...';
    textarea.id = `custom-instructions-textarea`; // Add a unique id

    containerDiv.appendChild(promptLibraryButton);
    containerDiv.appendChild(textarea);

    return { containerDiv, textarea };
}

function setupCustomInstructionsListeners(node) {
    const promptLibraryButton = node.content.querySelector('.prompt-library-button');

    if (!promptLibraryButton || !node.customInstructionsTextarea) {
        //console.error('Custom instructions elements not found for node:', node);
        return;
    }

    promptLibraryButton.onclick = () => openPromptLibrary(node);
}