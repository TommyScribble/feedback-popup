import html2canvas from 'html2canvas';
import platform from 'platform';
import axios from 'axios';

class FeedbackPopup {
    constructor(widgetTitle, title, snapshotBody, placeholderText, emailEndpoint) {
        this.title = title,
        this.snapshotBody = snapshotBody,
        this.placeholderText = placeholderText,
            this.isOpen = false,
            this.container = {
                buttonHTML: `
            <div class="widget__container">
                <div class="widget__container-inner">
                    <button class="widget__button">${widgetTitle}</button>
                </div>
            </div>`,
                mainDiv: document.getElementsByClassName("js-feedback-popup")[0],
                contentDiv: document.getElementsByClassName("js-feedback-popup-content")[0],
                buttonShowDiv: document.getElementsByClassName("js-feedback-popup-btn-show")[0],
                confirmationShowDiv: document.getElementsByClassName("js-feedback-popup-confirmation")[0],
                buttonSend: document.getElementsByClassName("js-feedback-post")[0],
                popupHTML: `<div class="feedback__container">

                            <div class="feedback__container--inner">

                                <div class="feedback__header">

                                    <h1>${title}</h1>

                                </div>

                                <div class="feedback__textarea">

                                    <textarea autoFocus placeholder="${placeholderText}" name="feedback" id="textarea"></textarea>

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

                        </div>`,
                confirmtionHTML: `<div class="feedback__container">
                                <div class="feedback-popup__confirmation-inner">
                                <div class="feedback-popup__confirmation-text">
                                    <p class="thank-you">Thank you for your help!</p>
                                </div>
                                    <div class="feedback-popup__confirmation-button">
                                    <button class="btn btn-cancel js-feedback-OK">OK</button>
                                    </div>
                                </div>
							</div>`,
                personalEmailEndpoint: emailEndpoint
            }
    }

    showConfirmation() {
        this.container.contentDiv.innerHTML = this.container.confirmtionHTML;
        this.container.contentDiv.style.display = "block";
        const buttonOK = document.getElementsByClassName("js-feedback-OK")[0];
        const that = this;
        buttonOK.addEventListener("click", function () {
            that.container.confirmationShowDiv.style.display = "none";
            that.hideContentDiv();
        });
    }

    showFeedbackModal() {
        this.container.contentDiv.innerHTML = this.container.popupHTML;
        this.container.contentDiv.style.display = "block";
        const buttonCancel = document.getElementsByClassName("js-feedback-popup-btn-cancel")[0];
        const buttonSend = document.getElementsByClassName("js-feedback-post")[0];
        const that = this;
        this.container.buttonShowDiv.style.display = "none";
        buttonCancel.addEventListener("click", function () {
            that.hideContentDiv()
        });
        buttonSend.addEventListener("click", function () {
            that.sendData();
            
        });
        this.toggleScreenshot()
        return this;
	}
	
	spinner(state) {
		const spinnerElement = document.querySelector('.spinner');
		switch (state) {
			case 'show':
				spinnerElement.classList.add('loading')
				break;
			case 'hide':
				spinnerElement.classList.remove('loading');
			break;
			default:
				break;
		}
	}

    hideContentDiv() {
        this.container.contentDiv.style.display = "none";
        this.container.buttonShowDiv.style.display = "block";
    }

    toggleScreenshot() {
        const checkbox = document.getElementById('js-checkbox');
        const isChecked = true;

        checkbox.addEventListener('click', () => {
            if (!isChecked === checkbox.checked) {
                const screenShotParent = document.getElementsByClassName("feedback__screenshot")[0];
                screenShotParent.removeChild(document.getElementsByTagName('canvas')[0]);
            } else if (isChecked === checkbox.checked) {
                this.createScreenshot();
            }
        })
    }

    buttonWidget() {
        this.container.buttonShowDiv.innerHTML = this.container.buttonHTML;
        const buttonShow = document.getElementsByClassName("js-feedback-popup-btn-show")[0];
        const that = this;
        buttonShow.addEventListener("click", function () {
            that.showFeedbackModal()
            that.createScreenshot();
        });
    }

    createScreenshot() {
		this.spinner('show');	
        html2canvas(document.getElementById(`${this.snapshotBody}`)).then(canvas => {
            document.getElementsByClassName("feedback__screenshot")[0].appendChild(canvas);
		})
		this.spinner('hide');
    }
	
    sendData() {
		const canvas = document.getElementsByTagName('canvas')[0];
		
		const base64result = canvas && canvas.toDataURL('image/png', 1.0),
		userScreenshot = base64result && base64result.split(',')[1],
		userPlatform = platform.description,
		userFeedback = document.getElementById('textarea').value;
		
		const screenshotIncluded = canvas ? "Incuded" : "Not Included";
		
		const apiConnection = `${this.container.personalEmailEndpoint}`;

		axios.post(`${apiConnection}`, {
			userPlatform: userPlatform, 
			userFeedback: userFeedback,
			screenshotIncluded: screenshotIncluded,
			userScreenshot: userScreenshot
		}
			).then( () => this.showConfirmation()
			).catch( error => alert(error)
		)
		// uncomment for local dev
		// alert('The message has been sent'); 
		// this.showConfirmation();
	}
	
	init() {
		this.buttonWidget();
	}
}

// swicth comments below for local dev
// export default FeedbackPopup;

module.exports = FeedbackPopup;