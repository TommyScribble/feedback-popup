import FeedbackPopup from './js';

let feedbackPopup = new FeedbackPopup(
	"Spotted a glitch?",
	"Support our continuous improvement.",
	"main-body",
	"Describe your issue or share your ideas",
	"http://localhost:3004/communications/feedbackPopup"
);

feedbackPopup.init();