export interface FeedbackPopupConfig {
    widgetTitle?: string;
    title?: string;
    snapshotBodyId?: string;
    placeholderText?: string;
    endpointUrl?: string;
}

declare class FeedbackPopup {
    constructor(config: FeedbackPopupConfig);
    init(): void;
}

export default FeedbackPopup; 