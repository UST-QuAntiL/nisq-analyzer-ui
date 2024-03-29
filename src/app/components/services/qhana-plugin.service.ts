import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface MicroFrontendState {
  href: string;
  height: number;
  initialized: boolean;
}

interface ImplementationItem {
  name: string;
  download: string;
  version: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class QhanaPluginService {
  isPlugin: boolean = false;
  implementationDtoSubject: BehaviorSubject<ImplementationDto[]> =
    new BehaviorSubject([]);

  qhanaFrontendState: MicroFrontendState = {
    href: window.location.href,
    height: 0,
    initialized: false,
  };

  algoUUIDs = new Map<string, string>();
  implUUIDs = new Map<string, string>();
  
  pluginURL: string | null = null

  constructor(private http: HttpClient) {
    this.isPlugin = window.top !== window.self;
  }
  
  registerRouteListener(route: ActivatedRoute): void {
    route.queryParams.subscribe(
      params => {
        if (params['plugin-endpoint-url'] != null) {
          this.pluginURL = params['plugin-endpoint-url'];
        }
      }
    );
  }

  /**
   * Register the main message event listener on the current window.
   */
  private registerMessageListener(): void {
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
  private onLoadCssMessage(data: { urls: string[] }): void {
    const head = document.querySelector('head');
    data.urls.forEach((url) => {
      const styleLink = document.createElement('link');
      styleLink.href = url;
      styleLink.rel = 'stylesheet';
      head.appendChild(styleLink);
    });
    document.body.style.background = 'transparent';
  }

  private getUUID(impl: ImplementationItem, uuids: Map<string, string>): string {
    const implID = `${impl.name} ver: ${impl.version} (${impl.download} ${impl.type})`

    const res = uuids.get(implID);
    if (res != null) {
      return res;
    }

    const newUUID = uuidv4();
    uuids.set(implID, newUUID);
    return newUUID;
  }

  private getAlgoUUID(impl: ImplementationItem): string {
    return this.getUUID(impl, this.algoUUIDs);
  }

  private getImplUUID(impl: ImplementationItem): string {
    return this.getUUID(impl, this.implUUIDs);
  }

  /**
   * Handle implementation messages that send links to quantum circuit implementations
   *
   * @param {{type: 'implementations-response', implementations: ImplementationItem[]}} data
   */
  private onImplementationsResponse(data: {
    implementations: ImplementationItem[];
  }): void {
    const implementationsDto = data.implementations.map((impl) => {
      const algoId = this.getAlgoUUID(impl);
      const implId = this.getImplUUID(impl);

      let language: string
      if (impl.type === 'qasm') {
        language = 'OpenQASM';
      } else {
        language = 'Qiskit';
      }

      return {
        id: algoId,
        algorithmName: `${impl.name} (v${impl.version})`,
        implementedAlgorithm: implId,
        name: `${impl.name} (v${impl.version})`,
        language,
        sdk: 'Qiskit',
        fileLocation: impl.download,
        selectionRule: '',
      };
    });

    this.implementationDtoSubject.next(implementationsDto);
  }

  /**
   * Send a message to the parent window.
   *
   * @param {string|object} message the data attribute of the created message event
   */
  private sendMessage(message: string | object): void {
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
      this.sendMessage({ type: 'ui-resize', height });
    }
  }

  initializePlugin(route: ActivatedRoute): void {
    // prevent double execution if script is already loaded in the current window
    if (!this.qhanaFrontendState.initialized) {
      this.registerRouteListener(route);
      this.registerMessageListener();
      this.sendMessage('ui-loaded');
      this.qhanaFrontendState.initialized = true;
    }
  }

  fetchImplementations(): void {
    this.sendMessage('implementations-request');
  }

  notifyParentOnSaveResults(circuitURL: string, responseURL: string): void {
    this.sendMessage({
      type: 'form-submit',
      formData: '',
      formDataType: '',
      dataInputs: [circuitURL],
      submitUrl: '',
      resultUrl: responseURL,
    })
  }
}
