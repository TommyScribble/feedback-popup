# feedback-popup

[![npm version][npm-badge]][npm]

# Feedback Popup
## This version (v2.0.3) contains breaking changes as it no longer sends using smtpjs.

A simple to use popup for collecting feedback from users about the sites that they are using. Currently it captures a screenshot of the page the user is browsing, the users OS and browser name + versions and also a personal message from the user. It then sends all data to an API.

More features to come!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

To use the popup in your project run 

```sh
npm install feedback-popup
```



## Usage

Import the popup into your project, create a new instance of it and then call the WidgetButton method on it.

```javascript
import FeedbackPopup from 'feedback-popup';

var newFeedbackPopup = new FeedbackPopup(widgetTitle, title, snapshotBody, placeholderText, emailEndpoint);

newFeedbackPopup.buttonWidget();
```

#### Parameters in plain english are
```
"Widget button title", "Header welcome message", "div-id-to-screenshot", "Text area placeholder text", "API URL"
```

Also make sure to add the html below to the component or page that you want the popup to appear on

```html
  <div class="feedback-popup js-feedback-popup" data-html2canvas-ignore="true">
    <div class="js-feedback-popup-btn-show"></div>
    <div class="js-feedback-popup-content"></div>
    <div class="js-feedback-popup-confirmation"></div>
  </div>
```

If you want to use the styles included with this project be sure to import the main.scss file into your main stylesheet.

### Collecting the info from the popup

The popup now sends an object using axios to the URL of you chosen API. The object sent includes the below keys:

userPlatform  
userFeedback  
screenshotIncluded  
userScreenshot  


## Contributing

Clone this project to get involved

```sh
git@github.com:TommyScribble/feedback-popup.git
```

### Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

### Installation

- Running `npm install` in the app's root directory will install everything you need for development.

### Development Server

- `npm start` will run the app's development server at [http://localhost:3000](http://localhost:3000), automatically reloading the page on every JS change.
- `gulp` will proxy the server to [http://localhost:3001](http://localhost:3001), compile the SCSS and automatically reload the page on every SCSS change

### Building

- `node_modules/babel-cli/bin/babel.js src --out-dir lib` will transpile the js to es5 in the /lib folder.
Then copy the styles folder into the /lib folder

   To create a development build, set the `NODE_ENV` environment variable to `development` while running this command.

- `npm run clean` will delete built resources.


[npm-badge]: https://img.shields.io/npm/v/feedback-popup.png?style=flat-square
[npm]: https://www.npmjs.org/package/feedback-popup