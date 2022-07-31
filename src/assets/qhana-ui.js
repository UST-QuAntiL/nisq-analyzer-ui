// Copyright 2021 QHAna plugin runner contributors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Register the main message event listener on the current window.
 */
 function registerMessageListener() {
    // main event listener, delegates events to dedicated listeners
    window.addEventListener("message", (event) => {
        var data = event.data;
        if (typeof data !== "string") {
            if (data != null && data.type === "load-css") {
                onLoadCssMessage(data, window._qhana_microfrontend_state);
            }
        }
    });
}

/**
 * Handle css load messages that request the micro frontend to load additional css files.
 *
 * @param {{type: 'load-css', urls: string[]}} data 
 * @param {{lastHeight: number, heightUnchangedCount: number}} state 
 */
function onLoadCssMessage(data, state) {
    var head = document.querySelector("head");
    data.urls.forEach((url) => {
        var styleLink = document.createElement("link");
        styleLink.href = url;
        styleLink.rel = "stylesheet";
        head.appendChild(styleLink);
    });
    state.heightUnchangedCount = 0;
    document.body.style.background = "transparent";
    monitorHeightChanges(state);
}


/**
 * Send a message to the parent window.
 *
 * @param {string|object} message the data attribute of the created message event
 */
function sendMessage(message) {
    var targetWindow = window.opener || window.parent;
    if (targetWindow) {
        targetWindow.postMessage(message, "*");
    } else {
        console.warn("Failed to message parent window. Is this page loaded outside of an iframe?");
    }
}

/**
 * Monitor height changes for a certain time and inform the parent window if the height has changed.
 *
 * @param {{lastHeight: number, heightUnchangedCount: number}} state 
 */
function monitorHeightChanges(state) {
    var newHeight = notifyParentWindowOnHeightChange(state.height);
    if (state.height === newHeight) {
        if (state.heightUnchangedCount > 60) { // allow for 60*50ms for height to settle
            return;
        }
        state.heightUnchangedCount = (state.heightUnchangedCount || 0) + 1;
    } else {
        state.heightUnchangedCount = 0;
        state.height = newHeight;
    }
    window.setTimeout(() => monitorHeightChanges(state), 50);
}

/**
 * Measure the current height and inform the parent window if the height has changed compared to `lastHeight`.
 *
 * @param {number} lastHeight the last measured height returned by this method (default: 0)
 * @returns the current measured height
 */
function notifyParentWindowOnHeightChange(lastHeight = 0) {
    var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (height !== lastHeight) {
        sendMessage({ type: "ui-resize", height: height });
    }
    return height;
}

/**
 * Notify the parent window that a micro frontend was successfully loaded and is available to receive messages.
 * 
 * Must be called **after** the message listener was attached to the window!
 */
function notifyParentWindowOnLoad() {
    sendMessage("ui-loaded");
    notifyParentWindowOnHeightChange();
}


// Main script entry point /////////////////////////////////////////////////////


// only execute functions if loaded from a parent window (e.g. inside an iframe)
if (window.top !== window.self) {
    if (window._qhana_microfrontend_state == null) {
        // prevent double execution if script is already loaded in the current window
        window._qhana_microfrontend_state = {
            href: window.location.href,
            lastHeight: 0,
            heightUnchangedCount: 0,
            preventSubmit: false,
        }
        registerMessageListener();
        notifyParentWindowOnLoad();
    }
}
