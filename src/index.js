let app = document.querySelector('body')

app.innerHTML = Popup();

let popup = {
    isOpen: true,
};

function Popup() {
    return `<div class="feedback__container">

        <div class="feedback__container--inner">

          <div class="feedback__header">

            <h1>Support our continuous improvement.</h1>

          </div>

          <div class="feedback__textarea">
          
          <textarea autoFocus placeholder="Describe your issue or share your ideas" name="feedback" id="main-textarea"></textarea>

          </div>

          <div class="feedback__add-screenshot">

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

      </div>`;
}
