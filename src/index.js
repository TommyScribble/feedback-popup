class FeedbackPopup {
  constructor(title) {
    this.title = title,
    this.isOpen = false;
  }
  send() {
    // send screenshot close feedbackform and open confirmation
  }
  show() {
    console.log('showing!');

    return `<div className="feedback__container">

              <div className="feedback__container--inner">

                <div className="feedback__header">

                  <h1>Support our continuous improvement.</h1>

                </div>

                <div className="feedback__textarea">
                
                <textarea autoFocus placeholder="Describe your issue or share your ideas" name="feedback" id="main-textarea"></textarea>

                </div>

                <div className="feedback__add-screenshot">

                    <label className="control control-checkbox">

                      Send screenshot

                      <input onClick="toggleScreenshot()" id="capture" type="checkbox" checked/>

                      <div className="control_indicator">

                      </div>

                    </label>

                </div>

                <div className="feedback__screenshot">

                </div>

                <div className="feedback__confirm">
                  <ul>
                    <li>
                      <button className="btn btn-cancel">cancel</button>
                    </li>
                    <li>
                      <button className="btn btn-confirm">send</button>
                    </li>
                  </ul>

                </div>


              </div>

            </div>`;

  }


  bindEventButtonWidgetListener() {
    var buttonClick = document.getElementById("#widget");
    buttonClick.addEventListener("click", this.bind(buttonWidget), false);
  }

  hide() {
    // hide feedback-popup
    this.style.display = "none";
  }

  toggleScreenshot() {
    // if not enabled - show screenshot, else if enabled, hide screenshot
    let _checked = this.input.checkbox.checked

    if (_checked === false) {
      this.input.checkbox.checked
    } else !this.input.checkbox.checked
  }

  // refreshScreenshot(){
  //   // generate a new screenhot
  //   html2canvas(document.querySelector("#capture")).then(canvas => {
  //     document.body.appendChild(canvas)
  // });
  // }
  buttonWidget() {
    // var self = this;
    // var makeScreenshot = self.createScreenshot();
            return  `<div class="widget__container">
                  <button id="widget" class="widget__button">Spotted a glitch?</button>
                </div>`; 
  }
 
  


  createScreenshot() {
    const html2canvas = html2canvas(element, options)

    html2canvas(document.body).then(function (canvas) {
      document.body.appendChild(canvas)
    })
  }

}

let feedbackPopup = new FeedbackPopup(
  "Support our continuous improvement."
)

feedbackPopup.buttonWidget()
// feedbackPopup.createScreenshot()

// console.log(feedbackPopup.buttonWidget())

// Set app body
let popupContainer = document.querySelector("#feedback-popup-content")
popupContainer.innerHTML = feedbackPopup.buttonWidget()



