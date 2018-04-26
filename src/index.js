let app = document.querySelector('body')

app.innerHTML = Popup();

let popup = {
  isOpen: true,
};

function Header() {

  const heading = "Support our continuous improvement.";

  return `<div class="feedback__header">
            <h1>
            ${heading}
            </h1>
          </div>`;
}

function TextArea() {

  const textAreaPlaceholder = "Describe your issue or share your ideas"

  return `<div class="feedback__textarea">
            <textarea autoFocus placeholder=${textAreaPlaceholder} name="feedback" id="main-textarea"></textarea>
          </div>`;
}

function screenShot() {
  return `<div class="feedback__add-screenshot">
            <label 
            {// onLoad={screenShot()} }
            class="control control-checkbox">
              Send screenshot
              <input type="checkbox"/>
              <div class="control_indicator">
              </div>
            </label>
            </div>
            <div class="feedback__screenshot">
          </div>`;
}

function confirmation() {
  return `<div class="feedback__confirm">
          <ul>
            <li>
              <button class="btn btn-cancel">cancel</button>
            </li>
            <li>
              <button class="btn btn-confirm">send</button>
            </li>
          </ul>
        </div>`;
}

function Popup() {
  return `<div class="feedback__container">

            <div class="feedback__container--inner">

              ${Header()}

              ${TextArea()}

              ${screenShot()}

              ${confirmation()}

            </div>

          </div>`;
}
