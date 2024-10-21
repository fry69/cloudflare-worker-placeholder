interface Env {
	// Define any environment variables here
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { cf } = request;
		if (!cf) {
			return new Response('Nothing to see here', {
				headers: {
					'content-type': 'text/plain',
				},
			});
		}

		const url = new URL(request.url);
		const domain = url.hostname;
		const path = url.pathname;

		// Define the allowed paths
		const allowedPaths = ['/'];

		// Check if the path is allowed
		if (!allowedPaths.includes(path)) {
			// Serve a 404 response
			return new Response('Not Found', { status: 404 });
		}

		const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Welcome to ${domain}</title>
	<link rel="icon" href="https://fav.farm/👋" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css" />
	<style>
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			background: linear-gradient(135deg, #6e8efb, #a777e3);
			color: white;
		}
		.container {
			text-align: center;
			padding: 2rem;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 10px;
			backdrop-filter: blur(10px);
			box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		}
		h1 {
			margin-bottom: 1rem;
		}
		#map {
			height: 300px;
			width: 100%;
			max-width: 500px;
			margin: 1rem auto;
			border-radius: 10px;
			overflow: hidden;
		}
		/* Scale and Rotate GitHub Icon */
		.repo-link img {
			transition: transform 0.3s ease;
		}
		.repo-link:hover img {
			transform: scale(1.2) rotate(360deg);
		}

		/* Subtle Underline Effect */
		.repo-link {
			text-decoration: none;
			position: relative;
		}
		.repo-link::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 1px;
			bottom: 0;
			left: 0;
			background-color: currentColor;
			transform: scaleX(0);
			transition: transform 0.3s ease-in-out;
		}
		.repo-link:hover::after {
			transform: scaleX(1);
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Welcome to ${domain}</h1>
		<p>You're visiting from ${cf.city}, ${cf.country}</p>
		<div id="map"></div>
		<p>You are using ${cf.httpProtocol}</p>
		<p>ASN: ${cf.asn} (${cf.asOrganization})</p>
		<p>Colo: ${cf.colo}</p>

		<p><a class="repo-link" href="https://github.com/fry69/cloudflare-worker-placeholder"><img src="https://github.com/favicon.ico" width="18" height="18" alt="GitHub"> Cloudflare Worker Placeholder</a></p>
	</div>
	<script>
		const map = L.map('map').setView([${cf.latitude}, ${cf.longitude}], 10);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		L.marker([${cf.latitude}, ${cf.longitude}]).addTo(map)
			.bindPopup('Your approximate location')
			.openPopup();
	</script>
</body>
</html>
		`;

		return new Response(html, {
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
