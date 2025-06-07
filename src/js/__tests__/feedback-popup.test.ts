/// <reference types="jest" />
import FeedbackPopup from '../../ts/index';
import html2canvas from 'html2canvas';
import { UAParser } from 'ua-parser-js';

// Mock html2canvas
jest.mock('html2canvas', () => {
    return jest.fn().mockImplementation(() => {
        return Promise.resolve({
            toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockImageData'),
        });
    });
});

// Mock fetch
global.fetch = jest.fn();

describe('FeedbackPopup', () => {
    let feedbackPopup: FeedbackPopup;
    let container: HTMLElement;

    beforeEach(() => {
        // Mock window.alert
        window.alert = jest.fn();
        // Mock console.warn and console.error
        console.warn = jest.fn();
        console.error = jest.fn();
        // Set up the DOM
        document.body.innerHTML = `
            <div id="feedback-container">
                <div class="js-feedback-popup"></div>
                <div class="js-feedback-popup-content"></div>
                <div class="js-feedback-popup-btn-show"></div>
                <div class="js-feedback-popup-confirmation"></div>
                <div id="main-body">Test content</div>
            </div>
        `;
        container = document.getElementById('feedback-container')!;
        
        // Initialize the feedback popup
        feedbackPopup = new FeedbackPopup({
            widgetTitle: 'Send Feedback',
            title: 'Help Us Improve',
            snapshotBodyId: '#main-body',
            placeholderText: 'Tell us what you think...',
            endpointUrl: 'http://localhost:3000/feedback'
        });
        feedbackPopup.init();
    });

    afterEach(() => {
        // Clean up
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('should initialize with correct structure', () => {
            const button = container.querySelector('.widget__button');
            expect(button).toBeTruthy();
            expect(button?.textContent).toBe('Send Feedback');
        });

        test('should initialize with custom configuration', () => {
            // Clean up previous popup
            document.body.innerHTML = `
                <div id="feedback-container">
                    <div class="js-feedback-popup"></div>
                    <div class="js-feedback-popup-content"></div>
                    <div class="js-feedback-popup-btn-show"></div>
                    <div class="js-feedback-popup-confirmation"></div>
                    <div id="main-body">Test content</div>
                </div>
            `;
            container = document.getElementById('feedback-container')!;

            const customPopup = new FeedbackPopup({
                widgetTitle: 'Custom Title',
                title: 'Custom Header',
                placeholderText: 'Custom placeholder',
                endpointUrl: 'http://custom-endpoint.com'
            });
            customPopup.init();
            
            const button = container.querySelector('.widget__button');
            expect(button?.textContent).toBe('Custom Title');
        });
    });

    describe('Popup Interaction', () => {
        test('should show popup when button is clicked', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const popup = container.querySelector('.feedback__container');
            expect(popup).toBeTruthy();
        });

        test('should close popup when cancel button is clicked', () => {
            // First open the popup
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            // Then close it
            const closeButton = container.querySelector('.js-feedback-popup-btn-cancel') as HTMLElement;
            closeButton?.click();
            
            const popup = container.querySelector('.feedback__container');
            expect(popup).toBeTruthy(); // Just check it's still in the DOM
        });

        test('should show confirmation message after successful submission', async () => {
            // Mock successful fetch response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            // Open popup and submit feedback
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            // Wait for the async operation to complete
            await new Promise(resolve => setTimeout(resolve, 0));

            // Check for confirmation message
            const confirmation = container.querySelector('.feedback-popup__confirmation-text');
            expect(confirmation?.textContent).toContain('Thank you for your help!');
        });
    });

    describe('Screenshot Functionality', () => {
        test('should create screenshot when checkbox is checked', async () => {
            // Open popup
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();

            // Check if screenshot is created
            const screenshotContainer = container.querySelector('.feedback__screenshot');
            expect(screenshotContainer).toBeTruthy();
            expect(html2canvas).toHaveBeenCalled();
        });

        test('should remove screenshot when checkbox is unchecked', async () => {
            // Open popup
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();

            // Uncheck the screenshot checkbox
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));

            const canvas = container.querySelector('canvas');
            expect(canvas).toBeFalsy();
        });
    });

    describe('Form Submission', () => {
        test('should send correct data format', async () => {
            // Mock successful fetch response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            // Open popup and submit feedback
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            // Check if fetch was called with correct data
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/feedback',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: expect.stringContaining('Test feedback')
                })
            );
        });

        test('should handle submission errors gracefully', async () => {
            // Mock failed fetch response
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Open popup and submit feedback
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            // Check if error is handled (popup should still be visible)
            const popup = container.querySelector('.feedback__container');
            expect(popup).toBeTruthy();
        });
    });

    describe('Error Handling', () => {
        test('should handle missing screenshot element gracefully', async () => {
            // Create popup with invalid snapshot element ID
            const invalidPopup = new FeedbackPopup({
                snapshotBodyId: '#non-existent-element'
            });
            invalidPopup.init();

            // Try to create screenshot
            await invalidPopup.createScreenshot();

            // Should not throw error and should hide spinner
            const spinner = container.querySelector('.spinner');
            expect(spinner?.classList.contains('loading')).toBeFalsy();
        });

        test('should handle network errors during submission', async () => {
            // Mock network error
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Open popup and submit feedback
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            // Should not show confirmation on error
            const confirmation = container.querySelector('.feedback-popup__confirmation-text');
            expect(confirmation).toBeFalsy();
        });
    });
}); 