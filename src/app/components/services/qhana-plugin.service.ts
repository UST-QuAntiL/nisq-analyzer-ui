import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';

interface MicroFrontendState {
  href: string;
  height: number;
  initialized: boolean;
}

interface ImplementationItem {
  name: string;
  download: string;
}

@Injectable({
  providedIn: 'root',
})
export class QhanaPluginService {
  isPlugin: boolean = false;
  arrayImplDto: ImplementationDto[] = [];
  arrayImplNames: string[] = [];

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
          this.onLoadCssMessage(data);
        } else if (data != null && data.type === 'implementations-response') {
          this.onImplementationsResponse(data);
        }
      }
    });
  }

  /**
   * Handle css load messages that request the micro frontend to load additional css files.
   *
   * @param {{type: 'load-css', urls: string[]}} data
   */
  onLoadCssMessage(data: { urls: string[] }) {
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
   * Handle implementation messages that send links to quantum circuit implementations
   *
   * @param {{type: 'implementations-response', implementations: ImplementationItem[]}} data
   */
  onImplementationsResponse(data: { implementations: ImplementationItem[] }): void {
    data.implementations.forEach((impl) => {
        console.log(impl.name);
        if(!this.arrayImplNames.includes(impl.name)){
            let algoId = uuidv4();
            let implId = uuidv4();
            this.arrayImplDto.push({
                id: algoId,
                algorithmName: impl.name,
                implementedAlgorithm: implId,
                name: impl.name,
                language: "OpenQASM",
                sdk: "Qiskit",
                fileLocation: impl.download
            });
            this.arrayImplNames.push(impl.name);
        }
    });
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

  fetchImplementations(): void {
    this.sendMessage('implementations-request');
  }

  getImpls(): ImplementationDto[] {
    console.log("getImpls()");
    return this.arrayImplDto;
  }
}
