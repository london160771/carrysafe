import sourceHandler from '../source.js';

function adapt(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const vercelRequest = { method: request.method, query: Object.fromEntries(url.searchParams) };
  const vercelResponse = {
    status(code) {
      response.statusCode = code;
      return vercelResponse;
    },
    setHeader: (key, value) => response.setHeader(key, value),
    json(body) {
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(body));
      return vercelResponse;
    },
  };
  return sourceHandler(vercelRequest, vercelResponse);
}

export function localApiPlugin() {
  const mount = (server) => {
    server.middlewares.use('/api/source', (request, response) => adapt(request, response));
  };
  return { name: 'carrysafe-local-api', configureServer: mount, configurePreviewServer: mount };
}
