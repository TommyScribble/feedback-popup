# feedback-popup

[![npm version][npm-badge]][npm]

# Feedback Popup
## This version (v2.0.4) contains breaking changes as it no longer sends using smtpjs.

A simple to use popup for collecting feedback from users about issues with the site that they are using. Currently it captures a screenshot of the page the user is browsing, the users OS and browser name + versions and also a personal message from the user. It then sends all data to an API.

More features to come!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [New-Features](#new-features)
- [Contributing](#contributing)

## Installation

To use the popup in your project run 

```sh
yarn add feedback-popup
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

## New Features
There are various ways that this plugin can be updated both in the code and in the UX. Some of my ideas are listed below. If you have requests then please repost an issue and I'll see what I can do
### Code updates
- Typescript
- Testing
- Update Gulp to version 4
### Feature updates
- Choice to use server or personal email endpoint


## Contributing

Clone this project to get involved

```sh
git@github.com:TommyScribble/feedback-popup.git
```

### Prerequisites

[Node.js](http://nodejs.org/) =10.22.0 must be installed as this is currently using Gulp v3 for dev

### Installation

- Running `yarn` in the app's root directory will install everything you need for development.
- Rename indexOLD.js to index.js.
- In src/index.js comment the code for the axios call & switch the `exports.module` to an `export default` by switching the comments at the bottom of the file

### Development Server

- `yarn start` will run the app's development server at [http://localhost:3000](http://localhost:3000), automatically reloading the page on every JS change.
- `yarn gulp` will proxy the server to [http://localhost:3001](http://localhost:3001), compile the SCSS and automatically reload the page on every SCSS change

### Building

- `node_modules/babel-cli/bin/babel.js src --out-dir lib` will transpile the js to es5 in the /lib folder.
Then copy the styles folder into the /lib folder

   To create a development build, set the `NODE_ENV` environment variable to `development` while running this command.

- `yarn run clean` will delete built resources.


[npm-badge]: https://img.shields.io/npm/v/feedback-popup.png?style=flat-square
[npm]: https://www.npmjs.org/package/feedback-popup