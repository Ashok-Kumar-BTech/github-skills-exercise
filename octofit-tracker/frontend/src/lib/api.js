const fallbackApiHost = 'localhost';

export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const host = codespaceName ? `${codespaceName}-8000.app.github.dev` : fallbackApiHost;
  const protocol = codespaceName ? 'https' : 'http';
  return `${protocol}://${host}/api`;
}

export function getApiEndpoint(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalizedPath.startsWith('/api/')) {
    return `${getApiBaseUrl().replace(/\/api$/, '')}${normalizedPath}`;
  }

  return `${getApiBaseUrl()}${normalizedPath}/`;
}

export function extractRecords(responseBody) {
  if (Array.isArray(responseBody)) {
    return responseBody;
  }

  if (responseBody && typeof responseBody === 'object') {
    const candidateLists = [
      responseBody.data,
      responseBody.items,
      responseBody.results,
      responseBody.records,
      responseBody.entries,
    ];

    for (const candidate of candidateLists) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  return [];
}

export function getDisplayValue(value) {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    if (typeof value.username === 'string') {
      return value.username;
    }

    if (typeof value.name === 'string') {
      return value.name;
    }

    if (typeof value.title === 'string') {
      return value.title;
    }

    if (typeof value._id === 'string') {
      return value._id;
    }
  }

  return String(value);
}
