import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

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
const IncomingRequest = Request as new (input: RequestInfo, init?: RequestInit & { cf?: MockIncomingRequestCfProperties }) => Request;

describe('Placeholder Page Worker', () => {
	it('responds with correct HTML content', async () => {
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

		const request = new IncomingRequest('http://example.com', { cf: mockCf });
		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		const html = await response.text();

		// Check content type
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');

		// Check if the HTML contains expected content
		expect(html).toContain('<title>Welcome to example.com</title>');
		expect(html).toContain("You're visiting from New York, US");
		expect(html).toContain('You are using HTTP/2');
		expect(html).toContain('ASN: 13335 (Acme)');
		expect(html).toContain('Colo: EWR');
		expect(html).toContain("const map = L.map('map').setView([40.7128, -74.0060], 10);");
	});

	it('handles missing cf properties gracefully', async () => {
		const request = new IncomingRequest('http://example.com', { cf: {} });
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
});
