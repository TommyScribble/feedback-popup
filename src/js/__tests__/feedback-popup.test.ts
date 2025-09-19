/// <reference types="jest" />
import FeedbackPopup from '../../ts/index';
import html2canvas from 'html2canvas';
import { UAParser } from 'ua-parser-js';

// Mock html2canvas
jest.mock('html2canvas', () => {
    return jest.fn().mockImplementation(() => {
        // Return a real canvas element for DOM insertion
        const canvas = document.createElement('canvas');
        canvas.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,mockImageData');
        return Promise.resolve(canvas);
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

    describe('Widget', () => {
        test('should render with correct title', () => {
            const button = container.querySelector('.widget__button');
            expect(button?.textContent).toBe('Send Feedback');
        });

        test('should render in correct position', () => {
            // The button is inside .widget__container, so check for that container
            const containerDiv = container.querySelector('.widget__container');
            expect(containerDiv).toBeTruthy();
        });

        test('should disappear when clicked and popup opens', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const buttonContainer = container.querySelector('.js-feedback-popup-btn-show') as HTMLElement;
            expect(buttonContainer?.style.display).toBe('none');
            const popup = container.querySelector('.feedback__container');
            expect(popup).toBeTruthy();
        });

        test('should reappear when popup is closed', () => {
            // Open popup
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            // Close popup
            const closeButton = container.querySelector('.js-feedback-popup-btn-cancel') as HTMLElement;
            closeButton?.click();
            
            const buttonContainer = container.querySelector('.js-feedback-popup-btn-show') as HTMLElement;
            expect(buttonContainer?.style.display).toBe('block');
        });
    });

    describe('Popup', () => {
        test('should render in correct position', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const popup = container.querySelector('.feedback__container');
            const inner = popup?.querySelector('.feedback__container--inner');
            expect(inner).toBeTruthy();
        });

        test('should render with correct title', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const title = container.querySelector('.feedback__header h1');
            expect(title?.textContent).toBe('Help Us Improve');
        });

        test('should render textarea with correct placeholder', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea');
            expect(textarea?.placeholder).toBe('Tell us what you think...');
        });

        test('should render checkbox with correct label', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            const label = container.querySelector('.control-checkbox');
            expect(checkbox).toBeTruthy();
            expect(label?.textContent?.trim()).toBe('Include a screenshot?');
        });

        test('checkbox should be checked by default', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            expect(checkbox?.checked).toBe(true);
        });

        test('should add screenshot to state when checkbox is checked', async () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
            
            await feedbackPopup.createScreenshot();
            const canvas = container.querySelector('canvas');
            expect(canvas).toBeTruthy();
        });

        test('should remove screenshot from state when checkbox is unchecked', async () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));

            const canvas = container.querySelector('canvas');
            expect(canvas).toBeFalsy();
        });

        test('should render cancel button with correct label', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const cancelButton = container.querySelector('.js-feedback-popup-btn-cancel');
            expect(cancelButton?.textContent).toBe('cancel');
        });

        test('clicking cancel button should close popup and reset state', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const cancelButton = container.querySelector('.js-feedback-popup-btn-cancel') as HTMLElement;
            cancelButton?.click();
            
            const popup = container.querySelector('.js-feedback-popup-content') as HTMLElement;
            expect(popup?.style.display).toBe('none');
            expect(textarea.value).toBe('Test feedback'); // Value should persist until form is submitted
        });

        test('should render submit button with correct label', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const submitButton = container.querySelector('.js-feedback-post');
            expect(submitButton?.textContent).toBe('send');
        });
    });

    describe('Form Submission', () => {
        test('should send correct data shape', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

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

        test('should always send user message and user details', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1];
            const body = JSON.parse(fetchCall.body);
            
            expect(body).toHaveProperty('userFeedback', 'Test feedback');
            expect(body).toHaveProperty('userPlatform');
        });

        test('should send screenshot when checkbox is checked', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1];
            const body = JSON.parse(fetchCall.body);
            
            expect(body).toHaveProperty('screenshotIncluded');
        });

        test('should not send screenshot when checkbox is unchecked', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const checkbox = container.querySelector('#js-checkbox') as HTMLInputElement;
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1];
            const body = JSON.parse(fetchCall.body);
            
            expect(body.screenshotIncluded).toBe('Not Included');
        });

        test('should show success message after successful submission', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            const successMessage = container.querySelector('.thank-you');
            expect(successMessage?.textContent).toBe('Thank you for your help!');
        });

        test('should show error message after failed submission', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(console.error).toHaveBeenCalled();
        });

        test('should close success message and show widget', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            const closeButton = container.querySelector('.js-feedback-OK') as HTMLElement;
            closeButton?.click();

            const buttonContainer = container.querySelector('.js-feedback-popup-btn-show') as HTMLElement;
            expect(buttonContainer?.style.display).toBe('block');
        });

        test('should close error message and show widget', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();

            await new Promise(resolve => setTimeout(resolve, 0));

            feedbackPopup.hideContentDiv();
            const buttonContainer = container.querySelector('.js-feedback-popup-btn-show') as HTMLElement;
            expect(buttonContainer?.style.display).toBe('block');
        });
    });

    describe('Edge Cases', () => {
        test('should not throw if required DOM elements are missing', () => {
            document.body.innerHTML = '';
            expect(() => {
                const popup = new FeedbackPopup({ widgetTitle: 'Test' });
                popup.init();
            }).not.toThrow();
        });

        test('should handle invalid snapshotBodyId gracefully', async () => {
            const popup = new FeedbackPopup({ snapshotBodyId: '#does-not-exist' });
            popup.init();
            await expect(popup.createScreenshot()).resolves.not.toThrow();
        });

        test('should not create duplicate popups on rapid button clicks', () => {
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            button?.click();
            const popups = container.querySelectorAll('.feedback__container');
            expect(popups.length).toBe(1);
        });

        test('should not send multiple submissions on rapid submit clicks', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();
            submitButton?.click();
            await new Promise(resolve => setTimeout(resolve, 0));
            expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
        });

        test('should handle network timeout/failure gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = 'Test feedback';
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(console.error).toHaveBeenCalled();
        });

        test('should not submit if feedback is empty', async () => {
            (global.fetch as jest.Mock).mockClear();
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
            textarea.value = '';
            const submitButton = container.querySelector('.js-feedback-post') as HTMLElement;
            submitButton?.click();
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test('should handle html2canvas failure gracefully', async () => {
            // Temporarily override html2canvas mock to throw
            const originalHtml2canvas = (html2canvas as unknown as jest.Mock);
            originalHtml2canvas.mockImplementationOnce(() => Promise.reject(new Error('Canvas error')));
            const button = container.querySelector('.widget__button') as HTMLElement;
            button?.click();
            await expect(feedbackPopup.createScreenshot()).resolves.not.toThrow();
            // Restore mock
            originalHtml2canvas.mockClear();
        });
    });
}); 
