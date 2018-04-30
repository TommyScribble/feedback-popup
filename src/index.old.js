let app = document.querySelector('body')

app.innerHTML = Popup();

let popup = {
  isOpen: true,
};


function feeedBackWidget() {
  return `<div class="button__container">
            <div class="button__text">
              <span>Spotted a glitch?</span>
            </div>
          </div>`;
}

function confirmDialog() {

  const dialogText = "Thank you for your help!";

  return `<div class="confirm__container">
          <div class="confirm__text">
          ${dialogText}
          </div>
          <button class="confirm__button"> kghghdk </button>
        </div>`;
};

const loadScreenshot = () => { 
  html2canvas(document.querySelector("#capture")).then(canvas => {
    document.body.appendChild(canvas)
});
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
            <label class="control control-checkbox">
              Send screenshot
              <input type="checkbox"/>
                <div class="control_indicator">
              </div>
            </label>
          </div>
        <div class="feedback__screenshot"></div>`;
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
