import FeedbackPopup from './js';

const feedbackPopup = new FeedbackPopup({
    widgetTitle: 'Send Feedback',
    title: 'Help Us Improve',
    // snapshotBody: 'your-element-id',
    placeholderText: 'Tell us what you think...',
    emailEndpoint: 'your-api-endpoint'
});

feedbackPopup.init();