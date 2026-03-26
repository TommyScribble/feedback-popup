/// <reference types="vitest/globals" />
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('CSS theming API', () => {
	const variablesPath = join(process.cwd(), 'src/styles/variables.css');

	test('defines public --feedback-* variables under .feedback-popup', () => {
		const css = readFileSync(variablesPath, 'utf8');
		expect(css).toContain('.feedback-popup {');
		expect(css).toContain('--feedback-overlay-bg:');
		expect(css).toContain('--feedback-dialog-bg:');
		expect(css).toContain('--feedback-font-family:');
		expect(css).toContain('--feedback-button-confirm-bg:');
		expect(css).toContain('--feedback-checkbox-indicator-default:');
		expect(css).toContain('--feedback-spinner-accent-color:');
	});
});
