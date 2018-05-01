class FeedbackPopup {
    constructor(title) {
      this.title = title,
        this.isOpen = false;
        this.networkRef = document.getElementById("network-ref"),
        this.container = {
            buttonHTML: `<div class="widget__container network-ref-${this.networkRef.innerHTML}">
            <button id="widget" class="widget__button">Spotted a glitch?</button>
          </div>`,
            mainDiv: document.getElementById('feedback-popup-content'),
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
                    <button class="btn btn-cancel">cancel</button>
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
      this.container.mainDiv.innerHTML = this.container.popupHTML;
      console.warn('set container html');
    }

    hide() {
      this.style.display = "none";
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
        this.container.mainDiv.innerHTML = this.container.buttonHTML;
        const buttonClick = document.getElementById("widget");
        const that = this;
        buttonClick.addEventListener("click", function(){
            console.warn('clicked button, now showing popup')
            that.show()
        });      
    }




    createScreenshot() {
      const html2canvas = html2canvas(element, options)

      html2canvas(document.body).then(function (canvas) {
        document.body.appendChild(canvas)
      })
    }

  }

  module.exports = FeedbackPopup