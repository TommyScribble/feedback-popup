import html2canvas from "html2canvas";

class FeedbackPopup {
    constructor(title) {
      this.title = title,
        this.isOpen = false;
        this.networkRef = document.getElementById("network-ref"),
        this.container = {
            buttonHTML: `
            <div class="widget__container">
                <div class="widget__container-inner network-ref-${this.networkRef.innerHTML}">
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

                                    <h1>Support our continuous improvement.</h1>

                                </div>

                                <div class="feedback__textarea">

                                    <textarea autoFocus placeholder="Describe your issue or share your ideas" name="feedback"></textarea>

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
        }
    }

    send() {
      // send text to ..API.. and open confirmation
      this.container.contentDiv.innerHTML = this.container.confirmtionHTML;
      this.container.contentDiv.style.display = "block";
      const buttonOK = document.getElementsByClassName("js-feedback-OK")[0];
      const that = this;
      buttonOK.addEventListener("click", function(){
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
      this.container.buttonShowDiv.style.display = "none";//??? does this do anything?
      buttonCancel.addEventListener("click", function(){
          that.hideContentDiv()
      });
      buttonSend.addEventListener("click", function() {
          that.send()
      });
      return this;
    }

    hideContentDiv() {
      this.container.contentDiv.style.display = "none";
      this.container.buttonShowDiv.style.display = "block";
    }

    // toggleScreenshot() {
    //   let _checked = this.input.checkbox.checked

    //   if (_checked === false) {
    //     this.input.checkbox.checked
    //   } else !this.input.checkbox.checked
    // }

    buttonWidget() {
        this.container.buttonShowDiv.innerHTML = this.container.buttonHTML;
        const buttonShow = document.getElementsByClassName("js-feedback-popup-btn-show")[0];
        const that = this;
        buttonShow.addEventListener("click", function(){
            that.show()
            that.createScreenshot();
        });      
    }

    // createScreenshot() {
    //     html2canvas(document.body).then(function(canvas) {
    //         document.body.appendChild(canvas);
    //     });
    // }
  }

export default FeedbackPopup;