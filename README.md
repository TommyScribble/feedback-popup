# feedback-popup

[![npm version][npm-badge]][npm]

# Feedback Popup

A simple to use popup for collecting feedback from users about issues with the site that they are using. It captures a screenshot of the user's browser, the user's OS and browser name + version, and also a message from the user. This is all then sent to an API, where you can do whatever you like with the information.

More features to come!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [New-Features](#new-features)
- [Contributing](#contributing)

## Installation

```bash
npm install feedback-popup
# or
yarn add feedback-popup
# or
pnpm add feedback-popup
```

## Usage

```javascript
import { FeedbackPopup } from 'feedback-popup';

// Initialize with default configuration
const feedbackPopup = new FeedbackPopup();

// Or with custom configuration
const feedbackPopup = new FeedbackPopup({
    widgetTitle: 'Send Feedback',
    title: 'Help Us Improve',
    snapshotBodyId: '#main-body',
    placeholderText: 'Tell us what you think...',
    endpointUrl: 'https://your-api.com/feedback'
});

// Then run is by calling the init method
feedbackPopup.init();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| widgetTitle | string | 'Feedback' | The title shown on the feedback button |
| title | string | 'Send Feedback' | The title of the feedback popup |
| snapshotBodyId | string | '#main-body' | CSS selector for the element to capture in the screenshot |
| placeholderText | string | 'Enter your feedback here...' | Placeholder text for the feedback textarea |
| endpointUrl | string | 'http://localhost:3005/api/feedback' | API endpoint to send feedback to |

## API

### Methods

- `init()`: Initialize the feedback popup
- `showFeedbackModal()`: Show the feedback popup
- `hideContentDiv()`: Hide the feedback popup
- `createScreenshot()`: Create a screenshot of the current page
- `sendData()`: Send feedback data to the configured endpoint

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run tests
pnpm test

# Build for production
pnpm build
```

## License

MIT


## Contributing

Clone this project to get involved

```sh
git@github.com:TommyScribble/feedback-popup.git
```

### Prerequisites

[Node.js](http://nodejs.org/) =22.14.0 must be installed. If you are using Volta this is already pinned.

### Installation

- Running `pnpm i` in the app's root directory will install everything you need for development.

### Development Server

- `pnpm start` will run the app's development server at [http://localhost:3000](http://localhost:3000), automatically reloading the page on every JS change.

### Building

- `pnpn run build` will create a release build in the dist directory

- `pnpn run clean` will delete built resources.


[npm-badge]: https://img.shields.io/npm/v/feedback-popup.png?style=flat-square
[npm]: https://www.npmjs.org/package/feedback-popup