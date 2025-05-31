import html2canvas from 'html2canvas'; //  update to html2canvas-pro
import { UAParser } from 'ua-parser-js'; // update the implementation now this is updated

class FeedbackPopup {
    constructor(config) {
        this.config = {
            widgetTitle: config.widgetTitle || 'Feedback',
            title: config.title || 'Send Feedback',
            snapshotBody: config.snapshotBody || '#main-body',
            placeholderText: config.placeholderText || 'Enter your feedback here...',
            emailEndpoint: config.emailEndpoint,
            selectors: {
                main: '.js-feedback-popup',
                content: '.js-feedback-popup-content',
                buttonShow: '.js-feedback-popup-btn-show',
                confirmation: '.js-feedback-popup-confirmation'
            }
        };

        this.state = {
            isOpen: false,
            screenshot: null
        };

        this.templates = this._createTemplates();
        this._initializeElements();
    }

    _createTemplates() {
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

    _initializeElements() {
        this.elements = {
            main: document.querySelector(this.config.selectors.main),
            content: document.querySelector(this.config.selectors.content),
            buttonShow: document.querySelector(this.config.selectors.buttonShow),
            confirmation: document.querySelector(this.config.selectors.confirmation)
        };
    }

    _bindEvents() {
        // Button widget events
        const buttonShow = this.elements.buttonShow.querySelector('.widget__button');
        buttonShow.addEventListener('click', () => {
            this.showFeedbackModal();
            this.createScreenshot();
        });

        // Popup events
        this.elements.content.addEventListener('click', (e) => {
            if (e.target.matches('.js-feedback-popup-btn-cancel')) {
                this.hideContentDiv();
            }
            if (e.target.matches('.js-feedback-post')) {
                this.sendData();
            }
            if (e.target.matches('.js-feedback-OK')) {
                this.elements.confirmation.style.display = 'none';
                this.hideContentDiv();
            }
        });

        // Screenshot checkbox event
        const checkbox = document.getElementById('js-checkbox');
        checkbox.addEventListener('change', () => {
            const screenshotContainer = document.querySelector('.feedback__screenshot');
            const canvas = screenshotContainer.querySelector('canvas');

            if (checkbox.checked) {
                this.createScreenshot();
            } else if (canvas) {
                screenshotContainer.removeChild(canvas);
            }
        });
    }

    _updateSpinner(state) {
        const spinner = document.querySelector('.spinner');
        spinner.classList.toggle('loading', state === 'show');
    }

    showConfirmation() {
        this.elements.content.innerHTML = this.templates.confirmation;
        this.elements.content.style.display = 'block';
    }

    showFeedbackModal() {
        this.elements.content.innerHTML = this.templates.popup;
        this.elements.content.style.display = 'block';
        this.elements.buttonShow.style.display = 'none';
        this.state.isOpen = true;
    }

    hideContentDiv() {
        this.elements.content.style.display = 'none';
        this.elements.buttonShow.style.display = 'block';
        this.state.isOpen = false;
    }

    async createScreenshot() {
        this._updateSpinner('show');
        try {
            const screeenshotElement = document.querySelector('#main-body');
            const screenshotContainer = document.querySelector('.feedback__screenshot');
            const canvas = await html2canvas(screeenshotElement);

            if (screenshotContainer.querySelector('canvas') !== null) {
                screenshotContainer.removeChild(existingScreenshot)
                this.state.screenshot = null
            }

            screenshotContainer.appendChild(canvas);
            this.state.screenshot = canvas
        } catch (error) {
            console.log('Failed to create screenshot', error)
        } finally {
            this._updateSpinner('hide')
        }
    }

    async sendData() {
        const canvas = this.state.screenshot;
        const userFeedback = document.getElementById('textarea').value;

        const platformDescription = UAParser(window.navigator.userAgent);

        const data = {
            userPlatform: platformDescription,
            userFeedback,
            screenshotIncluded: canvas ? 'Included' : 'Not Included',
            userScreenshot: this.state.screenshot
        };

        console.log(data);

        try {
            // For local development
            alert('The message has been sent');
            this.showConfirmation();

            // Uncomment for production
            // await axios.post(this.config.emailEndpoint, data);
            // this.showConfirmation();
        } catch (error) {
            console.error('Failed to send feedback:', error);
            alert('Failed to send feedback. Please try again.');
        }
    }

    init() {
        this.elements.buttonShow.innerHTML = this.templates.button;
        this._bindEvents();
    }
}

// swicth comments below for local dev
export default FeedbackPopup;

// module.exports = FeedbackPopup;