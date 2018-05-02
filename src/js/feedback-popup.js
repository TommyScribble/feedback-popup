import html2canvas from "html2canvas";

class FeedbackPopup {
    constructor(title) {
      this.title = title,
        this.isOpen = false;
        this.networkRef = document.getElementById("network-ref"),
        this.container = {
            buttonHTML: `<div class="widget__container network-ref-${this.networkRef.innerHTML}">
            <button id="feedback-popup-btn-show" class="widget__button">Spotted a glitch?</button>
          </div>`,
            mainDiv: document.getElementById("feedback-popup"),
            contentDiv: document.getElementById("feedback-popup-content"),
            buttonShowDiv: document.getElementById("feedback-popup-btn-show"),
            popupHTML: `<div class="feedback__container">

            <div class="feedback__container--inner">

              <div class="feedback__header">

                <h1>Support our continuous improvement.</h1>

              </div>

              <div class="feedback__textarea">

              <textarea autoFocus placeholder="Describe your issue or share your ideas" name="feedback" id="main-textarea"></textarea>

              </div>

              <div class="feedback__add-screenshot">

                  <label class="control control-checkbox">

                    Send screenshot

                    <input onClick="toggleScreenshot()" id="capture" type="checkbox" checked/>

                    <div class="control_indicator">

                    </div>

                  </label>

              </div>

              <div class="feedback__screenshot">

              </div>

              <div class="feedback__confirm">
                <ul>
                  <li>
                    <button id="feedback-popup-btn-cancel" class="btn btn-cancel">cancel</button>
                  </li>
                  <li>
                    <button class="btn btn-confirm">send</button>
                  </li>
                </ul>

              </div>


            </div>

          </div>`
        }

        this.buttonWidget();
    }
    send() {
      // send screenshot close feedbackform and open confirmation
    }
    show() {
      this.container.contentDiv.innerHTML = this.container.popupHTML;
      this.container.contentDiv.style.display = 'block';
      console.warn('set container html');
      const buttonCancel = document.getElementById("feedback-popup-btn-cancel");
      const that = this;
      this.container.buttonShowDiv.style.display = 'none';
      buttonCancel.addEventListener("click", function(){
          console.warn('clicked button, now showing popup')
          that.hideContentDiv()
      });
      return this;
    }

    hideContentDiv() {
      this.container.contentDiv.style.display = "none";
      this.container.buttonShowDiv.style.display = "block";
    //   this.buttonWidget();
    }

    toggleScreenshot() {
      let _checked = this.input.checkbox.checked

      if (_checked === false) {
        this.input.checkbox.checked
      } else !this.input.checkbox.checked
    }

    buttonWidget() {
        console.log(document.getElementById('feedback-popup-content'));
        console.log('button widget displayed')
        this.container.buttonShowDiv.innerHTML = this.container.buttonHTML;
        const buttonShow = document.getElementById("feedback-popup-btn-show");
        const that = this;
        buttonShow.addEventListener("click", function(){
            console.warn('clicked button, now showing popup')
            that.show().createScreenshot();
        });      
    }




    createScreenshot() {
        html2canvas(document.body).then(function(canvas) {
            document.body.appendChild(canvas);
        });
    }

  }

export default FeedbackPopup;