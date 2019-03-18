# feedback-popup

[![npm package][npm-badge]][npm]

# Feedback Popup

A simple to use popup for collecting feedback from users about the sites that they are using. Currently it captures a screenshot of the users browser, the users OS and browser name + versions and also a personal message from the user. This is all then emailed to the fat controller (or to an email address of your choosing...)  
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

Import the popup into your project, create a new instance of it (don't forget to add in your own paramters) and then call the WidgetButton method

```sh
import FeedbackPopup from './js/feedback-popup';

let feedbackPopup = new FeedbackPopup(
  "Title for the popup",
  "div id to screenshot from",
  "Placeholder text for the textarea",
);

feedbackPopup.buttonWidget();
```


## Contributing

Clone this project to get involved

```sh
git@bitbucket.org:intouchnetworks/feedback-popup.git
```

### Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

### Installation

- Running `npm install` in the app's root directory will install everything you need for development.

### Development Server

- `npm start` will run the app's development server at [http://localhost:3000](http://localhost:3000), automatically reloading the page on every JS change.
- `gulp` will proxy the server to [http://localhost:3001](http://localhost:3001), compile the SCSS and automatically reload the page on every SCSS change

### Building

- `npm run build` creates a production build by default.

   To create a development build, set the `NODE_ENV` environment variable to `development` while running this command.

- `npm run clean` will delete built resources.


[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/feedback-popup