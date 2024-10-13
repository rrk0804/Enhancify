import getMultiTrackAudioFeatures from "../services/multiTrackAudioFeaturesService";
import getPlaylistTrackIDs from "../services/playlistTrackIDService";
import reorderPlaylist from "../services/reorderPlaylistService";

// --- Global Logic to affect Spotify's UI ---
const initPlaylistPageLogic = () => {
    let currentPlaylistID: string | null = null;

    // Wait for Spicetify to be ready
    const waitForSpicetify = (callback: () => void, retryCount = 0) => {
        if (retryCount > 10) {
            console.error("Spicetify is not ready after multiple attempts.");
            return;
        }
        if (typeof Spicetify !== "undefined" && Spicetify.Player && Spicetify.Player.data) {
            callback();
        } else {
            console.log(`Spicetify not ready, retrying... (${retryCount + 1})`);
            setTimeout(() => waitForSpicetify(callback, retryCount + 1), 500); // Retry after 500ms
        }
    };

    // Function to detect if the current page is a playlist page
    function isPlaylistPage() {
        const pathname = Spicetify.Platform.History.location.pathname;
        const matches = pathname.match(/playlist\/(.*)/);
        if (!matches) return null;
        return matches[1];  // Returns the playlist ID if it's a playlist page
    }

    // Retry logic for DOM element selection
    const waitForElement = (selector: string, callback: (element: Element) => void, retryCount = 0) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else if (retryCount < 10) {
            console.log(`Element ${selector} not found, retrying... (${retryCount + 1})`);
            setTimeout(() => waitForElement(selector, callback, retryCount + 1), 500);
        } else {
            console.error(`Element ${selector} not found after multiple attempts.`);
        }
    };

    // Programmatically click the custom order button and inject sorting options
    const clickCustomOrderButtonAndInject = (playlistID: string) => {
        console.log("Attempting to click custom order button...");
        waitForElement('.x-sortBox-sortDropdown', (customOrderButton) => {
            console.log("Custom order button found:", customOrderButton);

            // Simulate a click to open the dropdown
            (customOrderButton as HTMLElement).click();

            // Inject sorting options after the dropdown opens
            setTimeout(() => injectSortingOptions(playlistID), 500); // Delay to allow dropdown to expand
        });
    };

    // Add sorting options to the custom order dropdown
    const injectSortingOptions = (playlistID: string) => {
        console.log("Injecting sorting options...");
        waitForElement('.main-contextMenu-menu', (customOrderDropdown) => {
            console.log("Custom order dropdown element:", customOrderDropdown);

            if (!document.querySelector('.custom-sorting')) {
                const newSortingOptions = `
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto">Tempo</span>
                        </button>
                    </li>
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto">Danceability</span>
                        </button>
                    </li>
                    <li role="presentation" class="main-contextMenu-menuItem custom-sorting">
                        <button class="main-contextMenu-menuItemButton" role="menuitemradio">
                            <span class="Type__TypeElement-sc-goli3j-0 TypeElement-type-mesto">Energy</span>
                        </button>
                    </li>
                `;

                customOrderDropdown.insertAdjacentHTML("beforeend", newSortingOptions);

                document.querySelectorAll(".custom-sorting button").forEach((button, index) => {
                    const sortingFeature = ["tempo", "danceability", "energy"][index];
                    button.addEventListener("click", () => sortPlaylistByFeature(playlistID, sortingFeature));
                });
            } else {
                console.log("Sorting options already injected.");
            }
        });
    };

    // Sorting functionality for selected feature
    const sortPlaylistByFeature = async (playlistID: string, feature: string) => {
        console.log(`Sorting playlist by feature: ${feature}`);
        
        // Fetch the track IDs from the playlist
        const ids = await getPlaylistTrackIDs(playlistID);
        console.log(`Track IDs: ${ids}`);
        
        // Fetch the audio features for each track
        const features = await getMultiTrackAudioFeatures(ids);
        console.log(`Audio Features:`, features);
        
        // Ensure the feature exists and sort by the feature value
        const sortedTracks = features
            .filter((track) => track && track[feature] !== undefined)  // Filter tracks that have the desired feature
            .sort((a, b) => a[feature] - b[feature]);  // Sort based on the feature value
        
        console.log(`Sorted Tracks:`, sortedTracks);
        
        // Extract the URIs for the sorted tracks
        const sortedTrackURIs = sortedTracks.map((track) => `spotify:track:${track.id}`);
        console.log(`Sorted Track URIs: ${sortedTrackURIs}`);
        
        // Call reorderPlaylist to apply the new order
        const result = await reorderPlaylist(playlistID, sortedTrackURIs);
        console.log(`Reorder result:`, result);
    };

    // Inject buttons for preset management and undo into the specified action bar
    const injectPresetButtons = (playlistID: string) => {
		console.log("Injecting preset buttons...");
		waitForElement(".main-actionBar-ActionBarRow", (container) => {
			console.log("Action bar element:", container);
	
			// Find the custom order button to insert the preset buttons before it
			const customOrderButton = container.querySelector('.x-sortBox-sortDropdown');
			console.log("Custom order button element:", customOrderButton);
	
			if (customOrderButton && !document.querySelector(".preset-buttons")) {
				const buttonHTML = `
					<div class="preset-buttons settingContainer" style="display: flex; margin-right: 20px;">
						<input id="presetNameInput" class="settingLabel" type="text" placeholder="Preset Name" style="color: white; background-color: rgb(43, 43, 43); border: none; border-radius: 5px; padding: 5px;"/>
						<button id="savePresetBtn" class="Button-sc-qlcn5g-0 Button-buttonPrimary-useBrowserDefaultFocusStyle-data-is-icon-only settingLabel">Save Preset</button>
						<button id="loadPresetBtn" class="Button-sc-qlcn5g-0 Button-buttonPrimary-useBrowserDefaultFocusStyle-data-is-icon-only settingLabel">Load Preset</button>
						<button id="undoBtn" class="Button-sc-qlcn5g-0 Button-buttonPrimary-useBrowserDefaultFocusStyle-data-is-icon-only settingLabel">Undo</button>
					</div>
				`;
				
				// Insert the preset buttons before the Custom Order button
				customOrderButton.insertAdjacentHTML('beforebegin', buttonHTML);
	
				let presetName = "";
				document.getElementById("savePresetBtn").addEventListener("click", () => savePreset(presetName, playlistID));
				document.getElementById("loadPresetBtn").addEventListener("click", () => loadPreset(presetName, playlistID));
				document.getElementById("undoBtn").addEventListener("click", () => undoOrder(playlistID));
				document.getElementById("presetNameInput").addEventListener("input", (e) => {
					presetName = (e.target as HTMLInputElement).value;
				});
			} else {
				console.log("Preset buttons already injected or Custom order button not found.");
			}
		});
	};		

    // Preset saving/loading
    const savePreset = (name: string, playlistID: string) => {
        const preset = {
            name,
            trackOrder: [],  // We will add the real track order when we save it
        };
        localStorage.setItem(`preset-${name}`, JSON.stringify(preset));
        alert(`Preset '${name}' saved.`);
    };

    const loadPreset = (name: string, playlistID: string) => {
        const preset = JSON.parse(localStorage.getItem(`preset-${name}`) || "{}");
        if (preset && preset.trackOrder) {
            reorderPlaylist(playlistID, preset.trackOrder);
        } else {
            alert(`Preset '${name}' not found.`);
        }
    };

    const undoOrder = (playlistID: string) => {
        // Restore the original order here (assuming we stored it earlier)
        alert(`Undoing the order for playlist ID: ${playlistID}`);
    };

    // Initialization Logic
    waitForSpicetify(() => {
        console.log("Spicetify is ready, checking if it's a playlist page...");

        const playlistID = isPlaylistPage();
        if (playlistID) {
            console.log("Valid playlist page detected, playlist ID:", playlistID);

            clickCustomOrderButtonAndInject(playlistID);
            injectPresetButtons(playlistID);
        } else {
            console.log("Not a playlist page.");
        }

        // Listen for page changes to detect when a playlist page is loaded
        Spicetify.Platform.History.listen(() => {
            const newPlaylistID = isPlaylistPage();
            if (newPlaylistID && newPlaylistID !== currentPlaylistID) {
                console.log("Navigated to a new playlist page, playlist ID:", newPlaylistID);
                currentPlaylistID = newPlaylistID;
                clickCustomOrderButtonAndInject(newPlaylistID);
                injectPresetButtons(newPlaylistID);
            }
        });
    });
};

// Execute the logic on load
initPlaylistPageLogic();

