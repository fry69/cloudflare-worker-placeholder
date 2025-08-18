import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

const testURL = `https://fry69.dev/demo/cloudflare-worker-placeholder`;

// Mock IncomingRequestCfProperties
interface MockIncomingRequestCfProperties {
	city?: string;
	country?: string;
	latitude?: string;
	longitude?: string;
	httpProtocol?: string;
	asn?: string;
	asOrganization?: string;
	colo?: string;
}

// Extend the Request type to include cf property
const IncomingRequest = Request as new (
	input: RequestInfo,
	init?: RequestInit & { cf?: MockIncomingRequestCfProperties },
) => Request;

const mockCf = {
	city: 'New York',
	country: 'US',
	latitude: '40.7128',
	longitude: '-74.0060',
	httpProtocol: 'HTTP/2',
	asn: '13335',
	asOrganization: 'Acme',
	colo: 'EWR',
};

describe('Placeholder Page Worker', () => {
	it('responds with correct HTML content', async () => {
		const request = new IncomingRequest(testURL, { cf: mockCf });
		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		const html = await response.text();

		// Check content type
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');

		// Check if the HTML contains expected content
		expect(html).toContain('<title>Welcome to fry69.dev</title>');
		expect(html).toContain("You're visiting from New York, US");
		expect(html).toContain('You are using HTTP/2');
		expect(html).toContain('ASN: 13335 (Acme)');
		expect(html).toContain('Colo: EWR');
		expect(html).toContain("const map = L.map('map').setView([40.7128, -74.0060], 10);");
	});

	it('handles missing cf properties gracefully', async () => {
		const request = new IncomingRequest(testURL, { cf: {} });
		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		const html = await response.text();

		// Check if the HTML contains default or empty values for missing properties
		expect(html).toContain("You're visiting from undefined, undefined");
		expect(html).toContain('You are using undefined');
		expect(html).toContain('ASN: undefined (undefined)');
		expect(html).toContain('Colo: undefined');
		expect(html).toContain("const map = L.map('map').setView([undefined, undefined], 10);");
	});

	it('responds to JSON requests ending on .json', async () => {
		const request = new IncomingRequest(`${testURL}.json`, { headers: { 'CF-Connecting-IP': '1.2.3.4' }, cf: mockCf });
		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// Check JSON content type
		expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');

		const json = await response.json();

		// Check if JSON response matches mocked object
		expect(json).toMatchObject(mockCf);

		// Check if the IP address gets returned
		expect(json).toMatchObject({ clientIp: '1.2.3.4' });
	});

	it('responds to JSON requests via accept header', async () => {
		const request = new IncomingRequest(`${testURL}`, {
			headers: { 'CF-Connecting-IP': '1.2.3.4', accept: 'application/json' },
			cf: mockCf,
		});
		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// Check JSON content type
		expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');

		const json = await response.json();

		// Check if JSON response matches mocked object
		expect(json).toMatchObject(mockCf);

		// Check if the IP address gets returned
		expect(json).toMatchObject({ clientIp: '1.2.3.4' });
	});
});
