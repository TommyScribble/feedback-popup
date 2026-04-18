import FeedbackPopup from '../ts/index';

const isLocalDev = (): boolean => {
    if (typeof window === 'undefined') return true;
    const { hostname } = window.location;
    return hostname === 'localhost' || hostname === '127.0.0.1';
};

const feedbackPopup = new FeedbackPopup({
    mount: '#feedback-root',
    widgetTitle: 'Drop Feedback',
    title: 'Arcade Feedback Booth',
    snapshotBodyId: '#main-body',
    placeholderText: 'What should we tune next?',
    ...(!isLocalDev() ? { endpointUrl: 'https://httpbin.org/post' } : {})
});

feedbackPopup.init();
