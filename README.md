# Cloudflare Worker Placeholder Page

This project is a customizable Cloudflare Worker that generates a simple placeholder page for your domains. It displays information about the visitor's location, HTTP protocol, and other details using the Cloudflare `request.cf` object.

## Features

- Dynamically generated placeholder page for multiple domains
- Displays visitor's location on an interactive map using Leaflet.js
- Shows information such as HTTP protocol, ASN, and Cloudflare colo
- Responsive design with a modern, gradient background
- Frosted glass effect for the main content container

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update) (version 3 or later)
- A Cloudflare account with Workers enabled

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/fry69/cloudflare-worker-placeholder.git
   cd cloudflare-worker-placeholder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your Cloudflare account in Wrangler:
   ```
   wrangler login
   ```

4. Optionally update the `wrangler.toml` file with your custom domains:
   ```
   routes = [
     { pattern = "example.com", custom_domain = true },
     { pattern = "www.example.com", custom_domain = true }
   ]
   ```

## Usage

1. Develop and test locally:
   ```
   npm run dev
   ```

2. Deploy to Cloudflare Workers:
   ```
   npm run deploy
   ```

3. Add a route in your Cloudflare dashboard to direct traffic to this worker or add custom domains in `wrangler.toml` as described above.

## Customization

You can customize the appearance and content of the placeholder page by modifying the HTML and CSS in the `src/index.ts` file. The main areas you might want to customize are:

- The gradient colors in the `body` CSS
- The content of the `<div class="container">` element
- The map settings in the JavaScript section

## Testing

This project includes unit tests using Vitest. To run the tests:

```
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) for the serverless platform
- [Leaflet.js](https://leafletjs.com/) for the interactive maps

## Support

If you encounter any problems or have any questions, please open an issue in this repository.
