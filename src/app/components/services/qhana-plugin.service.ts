import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface MicroFrontendState {
  href: string;
  height: number;
  initialized: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QhanaPluginService {
  isPlugin: boolean = false;

  qhanaFrontendState: MicroFrontendState = {
    href: window.location.href,
    height: 0,
    initialized: false,
  };

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
          this.onLoadCssMessage(data, this.qhanaFrontendState);
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
  onLoadCssMessage(data: { urls: string[] }, state: MicroFrontendState) {
    const head = document.querySelector('head');
    data.urls.forEach((url) => {
      const styleLink = document.createElement('link');
      styleLink.href = url;
      styleLink.rel = 'stylesheet';
      head.appendChild(styleLink);
    });
    document.body.style.background = 'transparent';
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
   * Measure the current height and inform the parent window if the height has changed.
   */
  notifyParentWindowOnHeightChange(): void {
    if (this.isPlugin) {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      if (height !== this.qhanaFrontendState.height) {
        this.sendMessage({ type: 'ui-resize', height });
      }
    }
  }

  initializePlugin(): void {
    // prevent double execution if script is already loaded in the current window
    if (!this.qhanaFrontendState.initialized) {
      this.registerMessageListener();
      this.sendMessage('ui-loaded');
    }
  }
}
