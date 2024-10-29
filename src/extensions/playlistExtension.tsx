import getMultiTrackAudioFeatures from "../services/multiTrackAudioFeaturesService";
import getPlaylistTrackIDs from "../services/playlistTrackIDService";
import reorderPlaylist from "../services/reorderPlaylistService";

// --- Global Logic to affect Spotify's UI ---
const initPlaylistPageLogic = () => {
    let currentPlaylistID: string | null = null;

    const addStyles = () => {
        const style = document.createElement("style");
        style.innerHTML = `
            .preset-buttons input, .preset-buttons button, #savePresetBtn, #loadPresetBtn, #undoBtn {
                margin-left: 5px;
                margin-right: 5px;
                padding: 10px;
                color: rgba(241, 241, 241, 0.7);
                font-size: var(--encore-text-size-smaller);
                height: 32px;
            }
            .preset-buttons, #savePresetBtn, #loadPresetBtn, #undoBtn {
                display: flex;
                align-items: center;
            }
            .preset-buttons button, #savePresetBtn, #loadPresetBtn, #undoBtn {
                font-size: var(--encore-text-size-smaller);
                border-radius: 5px;
                cursor: pointer;
                border: none;
                margin-right: 5px;
            }
            .preset-buttons button:hover, #savePresetBtn:hover, #loadPresetBtn:hover, #undoBtn:hover {
                color: white;
            }
            .preset-buttons input, #savePresetBtn, #loadPresetBtn, #undoBtn {
                position: relative;
                font-size: var(--encore-text-size-smaller);
                color: rgba(241, 241, 241, 0.7);
                background-color: rgba(var(--spice-rgb-shadow), 0.7);
                border-radius: 8px;
                padding: 5px;
                margin-right: 10px;
                border: none;
            }
        `;
        document.head.appendChild(style);
    };

    // Call addStyles once to inject the CSS
    addStyles();

    // Function to detect if the current page is a playlist page
    function isPlaylistPage() {
        const pathname = Spicetify.Platform.History.location.pathname;
        const matches = pathname.match(/playlist\/(.*)/);
        return matches ? matches[1] : null;
    }

    // Retry logic for DOM element selection
    const waitForElement = (selector: string, callback: (element: Element) => void, retryCount = 0) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else if (retryCount < 10) {
            setTimeout(() => waitForElement(selector, callback, retryCount + 1), 500);
        }
    };

    const svgIconMarkup = `
        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 Svg-img-icon-small">
            <path d="M15.53 2.47a.75.75 0 0 1 0 1.06L4.907 14.153.47 9.716a.75.75 0 0 1 1.06-1.06l3.377 3.376L14.47 2.47a.75.75 0 0 1 1.06 0z"></path>
        </svg>
    `;

    const updateDropdownButtonText = (text: string) => {
        const dropdownButton = document.querySelector('.x-sortBox-sortDropdown');
        if (dropdownButton) {
            const labelSpan = dropdownButton.querySelector('[data-sortbox-label="true"]');
            if (labelSpan) {
                labelSpan.textContent = text;
            }
        }
    };

    // Add sorting options to the custom order dropdown
    const injectSortingOptions = (playlistID: string) => {
        waitForElement('.main-contextMenu-menu', (customOrderDropdown) => {
            if (!document.querySelector('.custom-sorting')) {
                const sortingOptions = `
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio" aria-checked="false" tabindex="-1" data-roving-interactive="0">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto ellipsis-one-line htqz7Vb8mLJvGKTi1vrs" data-encore-id="type">Tempo</span>
                        </button>
                    </li>
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio" aria-checked="false" tabindex="-1" data-roving-interactive="0">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto ellipsis-one-line htqz7Vb8mLJvGKTi1vrs" data-encore-id="type">Danceability</span>
                        </button>
                    </li>
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio" aria-checked="false" tabindex="-1" data-roving-interactive="0">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto ellipsis-one-line htqz7Vb8mLJvGKTi1vrs" data-encore-id="type">Energy</span>
                        </button>
                    </li>
                `;
                const insertPosition = customOrderDropdown.children[7]; 

                if (insertPosition) {
                    insertPosition.insertAdjacentHTML("beforebegin", sortingOptions);
                } else {
                    customOrderDropdown.insertAdjacentHTML("beforeend", sortingOptions);
                }

                document.querySelectorAll(".custom-sorting button").forEach((button, index) => {
                    const sortingFeature = ["tempo", "danceability", "energy"][index];
                    button.addEventListener("click", () => {
                        sortPlaylistByFeature(playlistID, sortingFeature);
                        document.querySelectorAll(".main-contextMenu-menuItemButton").forEach((btn, i, btns) => {
                            if (i < btns.length - 2) {
                                const svg = btn.querySelector("svg");
                                if (svg) svg.remove();
                            }
                        });
                        document.querySelectorAll(".main-contextMenu-menuItemButton[aria-checked='true']").forEach(btn => {
                            btn.setAttribute("aria-checked", "false");
                            btn.setAttribute("tabindex", "-1");
                            btn.setAttribute("data-roving-interactive", "0");
                        });
                        button.setAttribute("aria-checked", "true");
                        button.setAttribute("tabindex", "0");
                        button.setAttribute("data-roving-interactive", "1");
                        button.insertAdjacentHTML("beforeend", svgIconMarkup);
                        updateDropdownButtonText(sortingFeature);
                    });
                });
            }
        });
    };

    // Sorting functionality for selected feature
    const sortPlaylistByFeature = async (playlistID: string, feature: string) => {
        const ids = await getPlaylistTrackIDs(playlistID);
        const features = await getMultiTrackAudioFeatures(ids);
        const sortedTracks = features
            .filter((track) => track && track[feature] !== undefined)
            .sort((a, b) => a[feature] - b[feature]);
        const sortedTrackURIs = sortedTracks.map((track) => `spotify:track:${track.id}`);
        await reorderPlaylist(playlistID, sortedTrackURIs);
    };

    const getSavedPresets = () => {
        return Object.keys(localStorage)
            .filter(key => key.startsWith("preset-"))
            .map(key => key.replace("preset-", ""));
    };

    const setupPresetDropdown = () => {
        const inputElement = document.getElementById("presetNameInput") as HTMLInputElement;
        const dropdownContainer = document.getElementById("presetDropdown");

        if (!inputElement || !dropdownContainer) return;

        // Show dropdown on focus
        inputElement.addEventListener("focus", () => {
            dropdownContainer.innerHTML = "";
            dropdownContainer.style.position = "absolute";
            dropdownContainer.style.zIndex = "999";
            const savedPresets = getSavedPresets();
            savedPresets.forEach(preset => {
                const presetItem = document.createElement("div");
                presetItem.textContent = preset;
                presetItem.style.padding = "5px";
                presetItem.style.cursor = "pointer";
                presetItem.style.position = "relative";
                presetItem.style.zIndex = "999";
                presetItem.addEventListener("click", () => {
                    inputElement.value = preset;
                    dropdownContainer.style.display = "none";
                });
                dropdownContainer.appendChild(presetItem);
            });
            dropdownContainer.style.display = savedPresets.length > 0 ? "block" : "none";
        });

        // Hide dropdown on blur
        inputElement.addEventListener("blur", () => {
            setTimeout(() => {
                dropdownContainer.style.display = "none";
            }, 150); // Timeout to allow click events to register
        });
    };

    // Inject buttons for preset management and undo into the specified action bar
    const injectPresetButtons = (playlistID: string) => {
        waitForElement(".main-actionBar-ActionBarRow", (container) => {
            const customOrderButton = container.querySelector('.x-sortBox-sortDropdown');

            if (customOrderButton && !document.querySelector(".preset-buttons")) {
                const buttonHTML = `
                    <div class="preset-buttons settingContainer" style="display: flex; position: relative;">
                        <input id="presetNameInput" class="settingLabel" type="text" placeholder="Preset Name" style="color: white; background-color: rgb(43, 43, 43); border: none; border-radius: 5px; padding: 5px;"/>
                        <div id="presetDropdown" class="preset-dropdown" style="display: none; position: absolute; top: 35px; background-color: rgba(43, 43, 43, 0.9); border: 1px solid rgba(81, 126, 97, 0.8); border-radius: 5px; z-index: 10;"></div>
                        <button id="savePresetBtn">Save Preset</button>
                        <button id="loadPresetBtn">Load Preset</button>
                        <button id="undoBtn">Undo</button>
                    </div>
                `;
                customOrderButton.insertAdjacentHTML('beforebegin', buttonHTML);

                setupPresetDropdown();
                let presetName = "";
                document.getElementById("presetNameInput").addEventListener("input", (e) => {
                    presetName = (e.target as HTMLInputElement).value;
                });
                document.getElementById("savePresetBtn").addEventListener("click", () => savePreset(presetName, playlistID));
                document.getElementById("loadPresetBtn").addEventListener("click", () => loadPreset(presetName, playlistID));
                document.getElementById("undoBtn").addEventListener("click", () => undoOrder(playlistID));
            }
        });
    };

    const savePreset = async (name: string, playlistID: string) => {
        const ids = await getPlaylistTrackIDs(playlistID);
        const prefixedTrackOrder = ids.map(id => `spotify:track:${id}`);
        const preset = {
            name,
            trackOrder: prefixedTrackOrder,
        };
        localStorage.setItem(`preset-${name}`, JSON.stringify(preset));
        Spicetify.showNotification(`Preset '${name}' saved.`);
    };

    const loadPreset = async (name: string, playlistID: string) => {
        const preset = JSON.parse(localStorage.getItem(`preset-${name}`) || "{}");
        if (preset && preset.trackOrder) {
            await reorderPlaylist(playlistID, preset.trackOrder);
        } else {
            Spicetify.showNotification(`Preset '${name}' not found.`);
        }
    };

    const undoOrder = (playlistID: string) => {
        Spicetify.showNotification(`Undoing the order for playlist ID: ${playlistID}`);
    };

    const observeDropdownOpen = () => {
        waitForElement('.x-sortBox-sortDropdown', (dropdownButton) => {
            const dropdownObserver = new MutationObserver(() => {
                const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
                const isContextMenuOpen = dropdownButton.getAttribute('data-context-menu-open') === 'true';

                if (isExpanded && isContextMenuOpen && currentPlaylistID) {
                    injectSortingOptions(currentPlaylistID);
                }
            });

            dropdownObserver.observe(dropdownButton, {
                attributes: true,
                attributeFilter: ['aria-expanded', 'data-context-menu-open'],
            });
        });
    };

    const observer = new MutationObserver(() => {
        const playlistID = isPlaylistPage();
        if (playlistID && playlistID !== currentPlaylistID) {
            currentPlaylistID = playlistID;
            observeDropdownOpen();
            injectPresetButtons(playlistID);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

initPlaylistPageLogic();