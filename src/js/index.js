import html2canvas from 'html2canvas';
import platform from 'platform';

class FeedbackPopup {
    constructor(title, snapshotBody, placeholderText, emailToken, toEmailAddress, fromEmailAddress) {
        this.title = title,
        this.snapshotBody = snapshotBody,
        this.placeholderText = placeholderText,
            this.isOpen = false,
            this.container = {
                buttonHTML: `
            <div class="widget__container">
                <div class="widget__container-inner">
                    <button class="widget__button">Spotted a glitch?</button>
                </div>
            </div>`,
                mainDiv: document.getElementsByClassName("js-feedback-popup")[0],
                contentDiv: document.getElementsByClassName("js-feedback-popup-content")[0],
                buttonShowDiv: document.getElementsByClassName("js-feedback-popup-btn-show")[0],
                confirmationShowDiv: document.getElementsByClassName("js-feedback-popup-confiramtion")[0],
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
                personalEmailToken: emailToken,
                personalToEmailAddress: toEmailAddress,
                personalFromEmailAddress: fromEmailAddress
            }
    }

    send() {
        this.container.contentDiv.innerHTML = this.container.confirmtionHTML;
        this.container.contentDiv.style.display = "block";
        const buttonOK = document.getElementsByClassName("js-feedback-OK")[0];
        const that = this;
        buttonOK.addEventListener("click", function () {
            that.container.confirmationShowDiv.style.display = "none";
            that.hideContentDiv();
        });
    }

    show() {
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
            that.send()
        });
        this.toggleScreenshot()
        return this;
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
            that.show()
            that.createScreenshot();
        });
    }

    createScreenshot() {
        html2canvas(document.getElementById(`${this.snapshotBody}`)).then(canvas => {
            document.getElementsByClassName("feedback__screenshot")[0].appendChild(canvas);
        })
    }

    sendData() {
        const canvas = document.getElementsByTagName('canvas')[0];
        const userScreenshot = canvas && canvas.toDataURL('image/png', 1.0),
            userPlatform = platform.description,
            userFeedback = document.getElementById('textarea').value;
        const screenshotIncluded = canvas ? "Incuded" : "Not Included";
        Email.send({
            SecureToken: `${this.container.personalEmailToken}`,
            To: `${this.container.personalToEmailAddress}`,
            From: `${this.container.personalFromEmailAddress}`,
            Subject: "Feedback",
            Body: `PLATFORM: ${userPlatform}<br/>
                    FEEDBACK: ${userFeedback}<br/>
                    SCREENSHOT: ${screenshotIncluded}`,
            Attachments: [
                {
                    name: "feedback-image.png",
                    data: userScreenshot || "no screenshot"
                }]
        })
        // .then(
        //     message => alert(message)
        // );
    }
}

export default FeedbackPopup;

// module.exports = FeedbackPopup;