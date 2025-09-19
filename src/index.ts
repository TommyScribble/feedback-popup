import FeedbackPopup from './ts/index';

const feedbackPopup = new FeedbackPopup({
    widgetTitle: 'Send Feedback',
    title: 'Help Us Improve',
    // snapshotBodyId: 'your-element-id',
    placeholderText: 'Tell us what you think...',
});

feedbackPopup.init();
