# feedback-popup

[![npm version][npm-badge]][npm]

# Feedback Popup

A simple to use popup for collecting feedback from users about issues with the site that they are using. It captures a screenshot of the user's browser, the user's OS and browser name + version, and also a message from the user. This is all then sent to an API, where you can do whatever you like with the information.

More features to come!

## Table of Contents

- [Installation](#installation)
- [Breaking changes in v4](#breaking-changes-in-v4)
- [Usage](#usage)
- [Configuration Options](#configuration-options)
- [API](#api)
- [Development](#development)
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

## Breaking changes in v4

- **DOM setup runs in `init()`, not in the constructor.** The constructor only stores configuration; the first `init()` call creates or finds the widget root, injects inner placeholder elements if needed, renders the floating button, and binds events.
- **Calling `init()` more than once** on the same instance is ignored (with a console warning).
- **Recommended integration** is an explicit **`mount`** (selector string or `HTMLElement`) or **no HTML at all** (the library appends a root to `document.body`). Relying on a pre-placed `.js-feedback-popup` node in your markup still works in v4 but is **deprecated** and will be removed in a future major version.

## Usage

### Recommended: explicit `mount`

Place a single empty container where you want the widget to live (layout, sidebar, footer, etc.). You can use a CSS selector or pass the element directly (e.g. from a framework ref). Missing widget classes and `data-html2canvas-ignore` on that node are added for you when `init()` runs.

```html
<body>
  <div id="main-body"><!-- page content --></div>
  <div id="feedback-root"></div>
  <script type="module">
    import FeedbackPopup from 'feedback-popup';

    const feedbackPopup = new FeedbackPopup({
      mount: '#feedback-root',
      widgetTitle: 'Send Feedback',
      title: 'Help Us Improve',
      snapshotBodyId: '#main-body',
      placeholderText: 'Tell us what you think...',
      endpointUrl: 'https://your-api.com/feedback'
    });

    feedbackPopup.init();
  </script>
</body>
```

With a direct element reference:

```javascript
import FeedbackPopup from 'feedback-popup';

const root = document.getElementById('feedback-root');
const feedbackPopup = new FeedbackPopup({
  mount: root,
  snapshotBodyId: '#main-body'
});
feedbackPopup.init();
```

### Zero markup: auto-inject on `document.body`

If you omit `mount` and there is **no** `.js-feedback-popup` in the document, `init()` creates a root element, adds the `feedback-popup` and `js-feedback-popup` classes, sets `data-html2canvas-ignore`, and appends it to **`document.body`**. This is ideal for quick demos; the widget usually appears at the end of the body.

```javascript
import FeedbackPopup from 'feedback-popup';

const feedbackPopup = new FeedbackPopup({
  snapshotBodyId: '#main-body',
  endpointUrl: 'https://your-api.com/feedback'
});
feedbackPopup.init();
```

### Legacy: pre-built `.js-feedback-popup` in HTML (deprecated)

If you already ship the old wrapper and inner placeholder divs, you can still omit `mount` and `init()` will use the first matching `.js-feedback-popup`. **Migrate to `mount` or auto-inject** when you can; this pattern will be removed in a future major release.

```html
<div class="feedback-popup js-feedback-popup" data-html2canvas-ignore="true">
  <div class="js-feedback-popup-btn-show"></div>
  <div class="js-feedback-popup-content"></div>
  <div class="js-feedback-popup-confirmation"></div>
</div>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| mount | `string` \| `HTMLElement` | (none) | Root element for the widget (selector or element). If omitted, the first `.js-feedback-popup` is used, or a new root is appended to `document.body`. |
| widgetTitle | string | 'Feedback' | The title shown on the feedback button |
| title | string | 'Send Feedback' | The title of the feedback popup |
| snapshotBodyId | string | '#main-body' | CSS selector for the element to capture in the screenshot |
| placeholderText | string | 'Enter your feedback here...' | Placeholder text for the feedback textarea |
| endpointUrl | string | 'http://localhost:3005/api/feedback' | API endpoint to send feedback to |

## API

### Methods

- `init()`: Initialize the feedback popup (DOM scaffold, button, event listeners). Safe to call once per instance.
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

## New Features
There is a [TODO.md](./TODO.md) with the current plan of new features, updates etc... that are being checked off as I get to them. Submit a PR if you want to add any suggestions.


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

- `pnpm run dev` will run the app's development server at [http://localhost:3000](http://localhost:3000) and a devlopment API at [http://localhost:3005](http://localhost:3005), automatically reloading the page on every JS change.

### Dev API

This api sends the body of the request to the `feedback` folder. This is excluded by the gitignore and will be generated if it doesnt exist. To clean the folder run 

```shell
    pnpm run clean-fedback
```

### Testing

Vitest is used to test all functionality. To run all the tests run 
```shell
    pnpm run test
```

### Building

To test builds locally run

```shell
    pnpm run build
```

This will first delete and then build the output to the dist directory

```shell
pnpn run clean
```
will delete built resources.


[npm-badge]: https://img.shields.io/npm/v/feedback-popup.png?style=flat-square
[npm]: https://www.npmjs.org/package/feedback-popup