# feedback-popup

[![npm version][npm-badge]][npm] [![npm downloads][npm-downloads-badge]][npm] [![License: MIT][license-badge]][license] [![GitHub issues][issues-badge]][issues]

**Feedback Popup** is a simple to use popup for collecting feedback from users about issues with the site that they are using. It captures a screenshot of the user's browser, the user's OS and browser name + version, and also a message from the user. This is all then sent to an API, where you can do whatever you like with the information.

More features to come!

## Table of Contents

- [Installation](#installation)
- [Breaking changes in v4](#breaking-changes-in-v4)
- [Breaking changes in v5 (CSS theming)](#breaking-changes-in-v5-css-theming)
- [Usage](#usage)
- [Styling & Theming](#styling--theming)
- [Configuration Options](#configuration-options)
- [API](#api)
- [Development](#development)
- [Demo app](#demo-app)
- [Build scripts](#build-scripts)
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

## Breaking changes in v5 (CSS theming)

These changes apply when you adopt the **v5** stylesheet (namespaced theming). Bump your major version when you ship this CSS to consumers.

- **Theming is done via `--feedback-*` CSS variables** on `.feedback-popup` (or any ancestor of the widget). You do not need to override `:root` for the popup look.
- **`.btn`, `.control`, and `.spinner` are scoped under `.feedback-popup`.** Styles from this package no longer apply to generic `.btn` / `.control` / `.spinner` classes elsewhere on the page. If you relied on those global rules, add your own styles for those classes outside the widget.
- **Checkbox styling uses `color-mix()`** for semi-transparent states. Use a [browser that supports `color-mix`](https://caniuse.com/mdn-css_types_color_color-mix) or override the `--feedback-checkbox-*` variables with solid colors.

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

The values above override the [defaults](#configuration-options): by default the floating button label (`widgetTitle`) is **Feedback** and the modal heading (`title`) is **Send Feedback**. Here they are swapped for illustration so you can see both options.

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

## Styling & Theming

The widget root is always an element with class **`feedback-popup`** (added automatically by `init()` if missing). All public theme tokens are **CSS custom properties** prefixed with **`--feedback-`**, with defaults set on `.feedback-popup` in [`src/styles/variables.css`](src/styles/variables.css).

### Loading the CSS

The published npm package ships the **JS library** from `dist/`; **stylesheet files live in the repo** under `src/styles/`. Include them in your app (copy, submodule, or bundle `main.css` and its imports) the same way you do today. The entry file is `src/styles/main.css`.

### How to override

Add rules that target the widget root (or a wrapper you pass as `mount`) and set variables:

```css
.feedback-popup {
  --feedback-color-primary: #5c6bc0;
  --feedback-color-brand: #283593;
  --feedback-header-bg: var(--feedback-color-brand);
  --feedback-widget-button-bg: var(--feedback-color-primary);
  --feedback-widget-button-hover-bg: #3949ab;
}
```

Because variables inherit, you can also set them on a parent container if the widget is nested:

```css
#feedback-root.feedback-popup,
#feedback-root .feedback-popup {
  --feedback-dialog-width: 36rem;
}
```

### Variables reference (defaults in `variables.css`)

| Variable | Role |
|----------|------|
| **Typography** | |
| `--feedback-font-family` | Font stack for widget UI |
| `--feedback-font-size-header` | Modal title |
| `--feedback-font-size-body` | Body / textarea / confirmation text |
| `--feedback-font-size-widget` | Floating button label |
| `--feedback-font-size-screenshot-label` | “Include a screenshot?” row |
| `--feedback-font-weight-header` | Title weight |
| `--feedback-font-weight-body` | Body weight |
| `--feedback-font-weight-label` | Checkbox label weight |
| `--feedback-line-height-header` | Title line height |
| **Core colors** | |
| `--feedback-color-surface` | White / surfaces |
| `--feedback-color-text` | Main text |
| `--feedback-color-text-muted` | Placeholder |
| `--feedback-color-brand` | Brand / header |
| `--feedback-color-primary` | Primary actions, widget button |
| `--feedback-color-secondary` | Screenshot row background |
| `--feedback-color-on-primary` | Text on primary-colored bars |
| `--feedback-color-on-brand` | Text on header |
| `--feedback-color-disabled` | Disabled / muted UI |
| `--feedback-color-link` | Links in confirmation text |
| `--feedback-color-link-hover` | Link hover |
| **Overlay** | |
| `--feedback-overlay-bg` | Backdrop behind modal |
| `--feedback-overlay-z-index` | Stacking order |
| `--feedback-overlay-transition` | Backdrop transition |
| **Floating button** | |
| `--feedback-widget-offset-right` | Horizontal inset from right |
| `--feedback-widget-offset-bottom` | Offset from bottom |
| `--feedback-widget-width` | Button strip width |
| `--feedback-widget-min-height` | Min height |
| `--feedback-widget-padding-x` / `--feedback-widget-padding-y` | Padding |
| `--feedback-widget-button-bg` | Button background |
| `--feedback-widget-button-text` | Button label color |
| `--feedback-widget-button-hover-bg` | Hover background |
| `--feedback-widget-button-disabled-bg` | Disabled background |
| **Dialog** | |
| `--feedback-dialog-bg` | Panel background |
| `--feedback-dialog-width` | Panel width |
| `--feedback-dialog-max-height-offset` | `calc(100% - offset)` on tall viewports |
| `--feedback-dialog-max-height-offset-mobile` | Same under 575px width |
| `--feedback-dialog-border-radius` | Panel and confirmation card corner radius |
| **Header** | |
| `--feedback-header-bg` | Header bar |
| `--feedback-header-text` | Title color |
| `--feedback-header-height` | Bar height |
| `--feedback-header-padding-x` | Horizontal padding |
| **Textarea** | |
| `--feedback-textarea-bg` | Textarea area background |
| `--feedback-textarea-height` | Textarea block height |
| `--feedback-textarea-padding-x` / `--feedback-textarea-padding-y` | Inner padding |
| **Screenshot UI** | |
| `--feedback-add-screenshot-bg` | Blue bar behind checkbox |
| `--feedback-add-screenshot-text` | Label color on that bar |
| `--feedback-add-screenshot-height` | Row height |
| `--feedback-add-screenshot-padding` | Row padding |
| `--feedback-screenshot-area-bg` | Canvas preview area |
| `--feedback-screenshot-area-height` | Preview height |
| **Footer** | |
| `--feedback-footer-bg` | Row behind Send/Cancel |
| `--feedback-footer-padding` | Footer padding |
| **Confirmation card** | |
| `--feedback-confirmation-bg` | Thank-you card background |
| `--feedback-confirmation-width` / `--feedback-confirmation-height` | Card size |
| `--feedback-confirmation-padding-x` / `--feedback-confirmation-padding-y` | Card padding |
| `--feedback-confirmation-thank-you-margin-bottom` | Space below thank-you line |
| **Dialog buttons** | |
| `--feedback-button-radius` | Border radius |
| `--feedback-button-confirm-bg` / `--feedback-button-confirm-border` / `--feedback-button-confirm-text` | Send button |
| `--feedback-button-confirm-hover-bg` / `--feedback-button-confirm-hover-text` | Send hover |
| `--feedback-button-cancel-bg` / `--feedback-button-cancel-border` / `--feedback-button-cancel-text` | Cancel |
| `--feedback-button-cancel-hover-bg` | Cancel hover |
| `--feedback-button-dialog-text` / `--feedback-button-dialog-font-size` | Alternate dialog-style button (e.g. `.btn-diolog`) |
| `--feedback-button-padding-x` / `--feedback-button-padding-y` | Action button padding |
| `--feedback-button-gap` | Space between Send and Cancel |
| `--feedback-button-font-size` | Button font size |
| `--feedback-button-transition` | Button transitions |
| `--feedback-button-text-transform` | e.g. `uppercase` |
| **Checkbox** | |
| `--feedback-checkbox-label-font-size` | Label size |
| `--feedback-checkbox-indicator-size` | Box size |
| `--feedback-checkbox-indicator-border` | Border color |
| `--feedback-checkbox-indicator-radius` | Radius |
| `--feedback-checkbox-indicator-default` / `hover` / `checked` / `checked-hover` / `disabled` | Indicator backgrounds (`color-mix` by default) |
| `--feedback-checkbox-check-color` | Checkmark color |
| `--feedback-checkbox-check-disabled-border` | Checkmark border when disabled |
| **Spinner** | |
| `--feedback-spinner-size` | Diameter |
| `--feedback-spinner-border-width` | Ring thickness |
| `--feedback-spinner-track-color` / `--feedback-spinner-accent-color` | Two-tone ring |
| `--feedback-spinner-animation-duration` | Rotation speed |

### Examples

**Dark header and primary accent**

```css
.feedback-popup {
  --feedback-color-brand: #1a237e;
  --feedback-color-primary: #ff6f00;
  --feedback-header-bg: var(--feedback-color-brand);
  --feedback-widget-button-bg: var(--feedback-color-primary);
  --feedback-widget-button-hover-bg: #ff8f00;
  --feedback-button-confirm-bg: var(--feedback-color-primary);
  --feedback-button-confirm-border: var(--feedback-color-primary);
}
```

**Wider dialog, more padding**

```css
.feedback-popup {
  --feedback-dialog-width: 40rem;
  --feedback-textarea-height: 24rem;
  --feedback-header-padding-x: 2rem;
  --feedback-footer-padding: 1.2rem;
}
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

Only pass the options you need; anything omitted uses the default above. **`mount`** is optional: see [Usage](#usage) for the three integration patterns (explicit mount, auto-inject on `document.body`, or legacy `.js-feedback-popup` markup).

## API

### Methods

- `init()`: Initialize the feedback popup (DOM scaffold, button, event listeners). Safe to call once per instance.
- `showFeedbackModal()`: Show the feedback popup
- `hideContentDiv()`: Hide the feedback popup
- `createScreenshot()`: Create a screenshot of the current page
- `sendData()`: Send feedback data to the configured endpoint. On success the parsed JSON body is logged to the console as described in [Demo app → Inspecting the API response](#inspecting-the-api-response).

## Development

```bash
# Install dependencies
pnpm install

# Demo + local API (recommended for hacking on the widget with default endpointUrl)
pnpm dev

# Demo only (Parcel on port 3000; no API — use if you do not need localhost:3005)
pnpm start

# Run tests
pnpm test
```

Use **`pnpm dev`** when you want the demo app and the dev API together (matches the default `endpointUrl` of `http://localhost:3005/api/feedback`). Use **`pnpm start`** alone only when you do not need the API or you run **`pnpm api`** in another terminal.

## Demo app

The interactive sample site lives under **`src/demo/`**:

- **`src/demo/index.html`** — Parcel entry page: a mount node (`#feedback-root`), the screenshot region (`#main-body`), and a short “retro” layout so you can try the widget end to end.
- **`src/demo/bootstrap.ts`** — Creates `FeedbackPopup`, calls `init()`, and tweaks config for local vs non-local hosts (on localhost it uses the default dev API URL; otherwise it posts to **https://httpbin.org/post** for a safe public smoke test).
- **`src/demo/demo.css`** — Demo-only layout and hero styling (the widget itself still uses **`src/styles/main.css`**).

Run it with **`pnpm dev`** or **`pnpm start`** as described in [Development](#development), then open [http://localhost:3000](http://localhost:3000).

### Inspecting the API response

After a **successful** submit, the library parses the response as JSON and logs it to the **browser developer console** as a single object (prefixed with `Success:`). Open **DevTools → Console** to see that object and confirm what your endpoint returned (for example `{ success: true, message: 'Feedback received' }` from the dev server, or **httpbin**’s echo payload when testing off localhost). Errors are logged separately and the UI shows an alert; they do not go through the same success log path.

## Build scripts

These match `package.json` (see there for the exact commands).

| Script | What it does |
|--------|----------------|
| **`pnpm clean`** | Deletes `dist/`, `lib/`, and `.parcel-cache/` so the next build starts fresh. |
| **`pnpm build`** | Runs **`clean`**, then **Parcel** production build of the **demo** (`src/demo/index.html`) into **`dist/`** (static demo site, not the npm library entry on its own). |
| **`pnpm build:lib`** | Runs **`clean`**, then **`tsc`** with `tsconfig.lib.json` to emit the **npm library** (`dist/library.js`, types, source maps) from `src/library.ts` and `src/ts/`. |
| **`pnpm build:all`** | Runs **`build`** then **`build:lib`**. Because **`build:lib`** starts with **`clean`**, the **final `dist/` contents are the library build only** — the demo output from the first step is removed. This is what **`prepublishOnly`** runs before publish, so the published `dist/` matches the package entry points. |
| **`pnpm clean:feedback`** | Deletes the repo-root **`feedback/`** directory (JSON and screenshots written by the dev API). Safe if the folder is missing. |

For a **local demo build** without publishing, use **`pnpm build`** if you only care about the demo site. For **library-only** output in `dist/`, use **`pnpm build:lib`**. For **the same artifact npm will ship**, use **`pnpm build:all`** (or rely on `pnpm publish`, which runs `prepublishOnly`).

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

[Node.js](http://nodejs.org/) **>= 14** as declared in `package.json` under **`engines`**. This repo’s toolchain is tested with the Volta pin (**22.14.0**); if you use [Volta](https://volta.sh/), that version is applied automatically from `package.json`.

### Installation

- Running `pnpm i` in the app's root directory will install everything you need for development.

### Development Server

- **`pnpm run dev`** runs the Parcel demo at [http://localhost:3000](http://localhost:3000) and the development API at [http://localhost:3005](http://localhost:3005), with reload on JS changes. This is the usual command when exercising the default `endpointUrl`.
- **`pnpm start`** runs **only** the Parcel demo (no API). Use **`pnpm run api`** in another terminal if you still need port 3005.

### Dev API

The API writes submissions under a repo-root **`feedback/`** directory (gitignored). The server creates that folder on first use. To remove saved JSON and screenshots:

```shell
pnpm run clean:feedback
```

### Testing

Vitest is used to test all functionality. To run all the tests:

```shell
pnpm run test
```

### Building

See [Build scripts](#build-scripts) for how **`clean`**, **`build`**, **`build:lib`**, and **`build:all`** relate. In short: **`pnpm run build`** is the demo site; **`pnpm run build:lib`** is the library; **`pnpm run build:all`** matches what runs before **`npm publish`**.

```shell
pnpm run clean
```

removes **`dist/`**, **`lib/`**, and **`.parcel-cache/`** (not the **`feedback/`** folder — use **`pnpm run clean:feedback`** for that).


[npm-badge]: https://img.shields.io/npm/v/feedback-popup.svg?style=flat-square
[npm-downloads-badge]: https://img.shields.io/npm/dm/feedback-popup.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/feedback-popup.svg?style=flat-square
[license]: https://github.com/TommyScribble/feedback-popup/blob/master/LICENSE
[issues-badge]: https://img.shields.io/github/issues/TommyScribble/feedback-popup.svg?style=flat-square
[issues]: https://github.com/TommyScribble/feedback-popup/issues
[npm]: https://www.npmjs.org/package/feedback-popup