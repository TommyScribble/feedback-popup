import FeedbackPopup from './ts/index';

const feedbackPopup = new FeedbackPopup({
    mount: '#feedback-root',
    widgetTitle: 'Send Feedback',
    title: 'Help Us Improve',
    snapshotBodyId: '#main-body',
    placeholderText: 'Tell us what you think...',
});

feedbackPopup.init();
