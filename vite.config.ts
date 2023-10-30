import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import http from 'https';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
	if (mode === 'development') {
		return {
			plugins: [react()],
			server: {
				open: true,
				proxy: {
					'/api': {
						target: 'http://localhost:8080',
					},
				},
			},
			build: {
				outDir: 'build',
				sourcemap: true,
			},
			test: {
				globals: true,
				environment: 'jsdom',
				setupFiles: 'src/setupTests',
				mockReset: true,
			},
		};
	} else {
		// command === 'build'
		return {
			plugins: [react()],
			server: {
				open: true,
				proxy: {
					'/api': {
						target: 'https://squid-app-trpsn.ondigitalocean.app',
						changeOrigin: true,
						agent: new http.Agent(),
						ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
					},
				},
			},
			build: {
				outDir: 'build',
				sourcemap: true,
			},
			base: './',
			test: {
				globals: true,
				environment: 'jsdom',
				setupFiles: 'src/setupTests',
				mockReset: true,
			},
		};
	}
});
