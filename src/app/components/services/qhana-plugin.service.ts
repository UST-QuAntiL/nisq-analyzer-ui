import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QhanaPluginService {
  isPlugin: boolean = false;

  constructor(private http: HttpClient) {
    this.isPlugin = window.top !== window.self;
  }

  /**
   * Register the main message event listener on the current window.
   */
  registerMessageListener() {
    // main event listener, delegates events to dedicated listeners
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (typeof data !== 'string') {
        if (data != null && data.type === 'load-css') {
          // @ts-expect-error _qhana_microfrontend_state does not exist
          this.onLoadCssMessage(data, window._qhana_microfrontend_state);
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
  onLoadCssMessage(data, state) {
    // TODO: add types ^
    const head = document.querySelector('head');
    data.urls.forEach((url) => {
      const styleLink = document.createElement('link');
      styleLink.href = url;
      styleLink.rel = 'stylesheet';
      head.appendChild(styleLink);
    });
    state.heightUnchangedCount = 0;
    document.body.style.background = 'transparent';
    this.monitorHeightChanges(state);
  }

  /**
   * Send a message to the parent window.
   *
   * @param {string|object} message the data attribute of the created message event
   */
  sendMessage(message: string | object) {
    const targetWindow = window.opener || window.parent;
    if (targetWindow) {
      targetWindow.postMessage(message, '*');
    } else {
      console.warn(
        'Failed to message parent window. Is this page loaded outside of an iframe?'
      );
    }
  }

  /**
   * Monitor height changes for a certain time and inform the parent window if the height has changed.
   *
   * @param {{lastHeight: number, heightUnchangedCount: number}} state
   */
  monitorHeightChanges(state) {
    // TODO: add types ^
    const newHeight = this.notifyParentWindowOnHeightChange(state.height);
    if (state.height === newHeight) {
      // allow for 60*50ms for height to settle
      if (state.heightUnchangedCount > 60) {
        return;
      }
      state.heightUnchangedCount = (state.heightUnchangedCount || 0) + 1;
    } else {
      state.heightUnchangedCount = 0;
      state.height = newHeight;
    }
    window.setTimeout(() => this.monitorHeightChanges(state), 50);
  }

  /**
   * Measure the current height and inform the parent window if the height has changed compared to `lastHeight`.
   *
   * @param {number} lastHeight the last measured height returned by this method (default: 0)
   * @returns the current measured height
   */
  notifyParentWindowOnHeightChange(lastHeight: number = 0) {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    if (height !== lastHeight) {
      this.sendMessage({ type: 'ui-resize', height });
    }
    return height;
  }

  /**
   * Notify the parent window that a micro frontend was successfully loaded and is available to receive messages.
   *
   * Must be called **after** the message listener was attached to the window!
   */
  notifyParentWindowOnLoad() {
    this.sendMessage('ui-loaded');
    this.notifyParentWindowOnHeightChange();
  }

  initializePlugin() {
    // prevent double execution if script is already loaded in the current window
    // @ts-expect-error _qhana_microfrontend_state does not exist
    if (window._qhana_microfrontend_state == null) {
      // @ts-expect-error _qhana_microfrontend_state does not exist
      window._qhana_microfrontend_state = {
        href: window.location.href,
        lastHeight: 0,
        heightUnchangedCount: 0,
        preventSubmit: false,
      };
      this.registerMessageListener();
      this.notifyParentWindowOnLoad();
    }
  }
}
