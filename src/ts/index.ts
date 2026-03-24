import html2canvas from 'html2canvas';
import { UAParser } from 'ua-parser-js';

export interface FeedbackPopupConfig {
    widgetTitle?: string;
    title?: string;
    snapshotBodyId?: string;
    placeholderText?: string;
    endpointUrl?: string;
    /** Root element for the widget; if omitted, uses the first `.js-feedback-popup` or injects one on `document.body`. */
    mount?: string | HTMLElement;
}

interface ContainerElements {
    main: HTMLElement | null;
    content: HTMLElement | null;
    buttonShow: HTMLElement | null;
    confirmation: HTMLElement | null;
}

interface State {
    isOpen: boolean;
    screenshot: HTMLCanvasElement | null;
}

interface Templates {
    button: string;
    popup: string;
    confirmation: string;
}

class FeedbackPopup {
    private config: FeedbackPopupConfig;
    private state: State;
    private elements: ContainerElements;
    private templates: Templates;
    private isSubmitting: boolean = false;
    private initialized: boolean = false;

    constructor(config: FeedbackPopupConfig = {}) {
        this.config = {
            widgetTitle: config.widgetTitle || 'Feedback',
            title: config.title || 'Send Feedback',
            snapshotBodyId: config.snapshotBodyId || '#main-body',
            placeholderText: config.placeholderText || 'Enter your feedback here...',
            endpointUrl: config.endpointUrl || 'http://localhost:3005/api/feedback'
        };
        if (config.mount !== undefined) {
            this.config.mount = config.mount;
        }

        this.state = {
            isOpen: false,
            screenshot: null
        };

        this.elements = {
            main: null,
            content: null,
            buttonShow: null,
            confirmation: null
        };

        this.templates = this._createTemplates();
    }

    private _createTemplates(): Templates {
        return {
            button: `
                <div class="widget__container">
                    <div class="widget__container-inner">
                        <button class="widget__button">${this.config.widgetTitle}</button>
                    </div>
                </div>
            `,
            popup: `
                <div class="feedback__container">
                    <div class="feedback__container--inner">
                        <div class="feedback__header">
                            <h1>${this.config.title}</h1>
                        </div>
                        <div class="feedback__textarea">
                            <textarea autoFocus placeholder="${this.config.placeholderText}" name="feedback" id="textarea"></textarea>
                        </div>
                        <div class="feedback__add-screenshot">
                            <label class="control control-checkbox">
                                <input id="js-checkbox" type="checkbox" checked/> Include a screenshot?
                                <div class="control_indicator"></div>
                            </label>
                        </div>
                        <div class="feedback__screenshot">
                            <div class="spinner"></div>
                        </div>
                        <div class="feedback__confirm">
                            <ul>
                                <li>
                                    <button class="btn btn-cancel js-feedback-popup-btn-cancel">cancel</button>
                                </li>
                                <li>
                                    <button class="btn btn-confirm js-feedback-post">send</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            confirmation: `
                <div class="feedback__container">
                    <div class="feedback-popup__confirmation-inner">
                        <div class="feedback-popup__confirmation-text">
                            <p class="thank-you">Thank you for your help!</p>
                        </div>
                        <div class="feedback-popup__confirmation-button">
                            <button class="btn btn-cancel js-feedback-OK">OK</button>
                        </div>
                    </div>
                </div>
            `
        };
    }

    private _resolveMain(): HTMLElement {
        const { mount } = this.config;
        if (typeof mount === 'string') {
            const el = document.querySelector(mount);
            if (!el || !(el instanceof HTMLElement)) {
                throw new Error(
                    `FeedbackPopup: mount selector "${mount}" did not match an HTMLElement in the document`
                );
            }
            return el;
        }
        if (mount instanceof HTMLElement) {
            return mount;
        }
        const existing = document.querySelector('.js-feedback-popup');
        if (existing instanceof HTMLElement) {
            return existing;
        }
        const injected = document.createElement('div');
        document.body.appendChild(injected);
        return injected;
    }

    private _normalizeRoot(el: HTMLElement): void {
        el.classList.add('feedback-popup', 'js-feedback-popup');
        el.setAttribute('data-html2canvas-ignore', 'true');
    }

    private _ensureInnerScaffold(main: HTMLElement): void {
        const slots = [
            'js-feedback-popup-btn-show',
            'js-feedback-popup-content',
            'js-feedback-popup-confirmation'
        ];
        for (const cls of slots) {
            if (!main.querySelector(`.${cls}`)) {
                const div = document.createElement('div');
                div.className = cls;
                main.appendChild(div);
            }
        }
    }

    private _wireElements(main: HTMLElement): void {
        this.elements = {
            main,
            content: main.querySelector('.js-feedback-popup-content'),
            buttonShow: main.querySelector('.js-feedback-popup-btn-show'),
            confirmation: main.querySelector('.js-feedback-popup-confirmation')
        };
    }

    private _updateSpinner(state: 'show' | 'hide'): void {
        const root = this.elements.content;
        if (!root) return;
        const spinner = root.querySelector('.spinner');
        if (!spinner) {
            console.warn('Spinner element not found in the DOM');
            return;
        }
        spinner.classList.toggle('loading', state === 'show');
    }

    private _bindEvents(): void {
        const buttonShow = this.elements.buttonShow?.querySelector('.widget__button');
        if (!buttonShow) return;

        buttonShow.addEventListener('click', () => {
            this.showFeedbackModal();
            this.createScreenshot();
        });

        if (!this.elements.content) return;
        this.elements.content.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.matches('.js-feedback-popup-btn-cancel')) {
                this.hideContentDiv();
            }
            if (target.matches('.js-feedback-post')) {
                this.sendData();
            }
            if (target.matches('.js-feedback-OK')) {
                if (this.elements.confirmation) {
                    this.elements.confirmation.style.display = 'none';
                }
                this.hideContentDiv();
            }
        });
    }

    public showConfirmation(): void {
        if (!this.elements.content) return;
        this.elements.content.innerHTML = this.templates.confirmation;
        this.elements.content.style.display = 'block';
    }

    public showFeedbackModal(): void {
        if (!this.elements.content || !this.elements.buttonShow) return;
        this.elements.content.innerHTML = this.templates.popup;
        this.elements.content.style.display = 'block';
        this.elements.buttonShow.style.display = 'none';
        this.state.isOpen = true;

        const root = this.elements.content;
        const checkbox = root.querySelector('#js-checkbox') as HTMLInputElement;
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const screenshotContainer = root.querySelector('.feedback__screenshot');
                if (!screenshotContainer) return;
                const canvas = screenshotContainer.querySelector('canvas');

                if (checkbox.checked) {
                    this.createScreenshot();
                } else if (canvas) {
                    screenshotContainer.removeChild(canvas);
                    this.state.screenshot = null;
                }
            });
        }
    }

    public hideContentDiv(): void {
        if (!this.elements.content || !this.elements.buttonShow) return;
        this.elements.content.style.display = 'none';
        this.elements.buttonShow.style.display = 'block';
        this.state.isOpen = false;
    }

    public async createScreenshot(): Promise<void> {
        this._updateSpinner('show');
        try {
            const screenshotElement = document.querySelector(this.config.snapshotBodyId || '') as HTMLElement;
            if (!screenshotElement) {
                throw new Error(`Screenshot element not found: ${this.config.snapshotBodyId}`);
            }
            const root = this.elements.content;
            if (!root) return;
            const screenshotContainer = root.querySelector('.feedback__screenshot') as HTMLElement;
            if (!screenshotContainer) return;

            const canvas = await html2canvas(screenshotElement);
            const existingCanvas = screenshotContainer.querySelector('canvas');

            if (existingCanvas) {
                screenshotContainer.removeChild(existingCanvas);
            }

            screenshotContainer.appendChild(canvas);
            this.state.screenshot = canvas;
        } catch (error) {
            console.error('Failed to create screenshot:', error);
        } finally {
            this._updateSpinner('hide');
        }
    }

    public async sendData(): Promise<void> {
        if (this.isSubmitting) return;
        const canvas = this.state.screenshot;
        const root = this.elements.content;
        const textarea = root?.querySelector('#textarea') as HTMLTextAreaElement;
        if (!textarea || !window) return;
        const userFeedback = textarea.value;
        if (!userFeedback || userFeedback.trim() === '') {
            alert('Please enter your feedback before submitting.');
            return;
        }
        this.isSubmitting = true;
        const platform = UAParser(window.navigator.userAgent);
        const data = {
            userPlatform: platform,
            userFeedback,
            screenshotIncluded: canvas ? 'Included' : 'Not Included',
            userScreenshot: canvas ? canvas.toDataURL('image/png', 1.0).split(',')[1] : null
        };
        try {
            this._updateSpinner('show');
            const response = await fetch(this.config.endpointUrl || '', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Success:', result);
            this.showConfirmation();
        } catch (error) {
            console.error('Failed to send feedback:', error);
            alert('Failed to send feedback. Please try again.');
        } finally {
            this._updateSpinner('hide');
            this.isSubmitting = false;
        }
    }

    public init(): void {
        if (this.initialized) {
            console.warn('FeedbackPopup: init() was already called; skipping.');
            return;
        }

        const main = this._resolveMain();
        this._normalizeRoot(main);
        this._ensureInnerScaffold(main);
        this._wireElements(main);

        if (!this.elements.buttonShow || !this.elements.content || !this.elements.confirmation) {
            console.warn('FeedbackPopup: required inner slots missing after scaffold');
            return;
        }

        this.elements.buttonShow.innerHTML = this.templates.button;
        this._bindEvents();
        this.initialized = true;
    }
}

export default FeedbackPopup;
