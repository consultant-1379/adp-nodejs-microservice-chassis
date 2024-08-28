let configMapDir = 'config/backend-service-config';

if (process.env.NODE_ENV === 'bridge') {
  configMapDir = process.env.UI_SERVICE_CONFIG;
}

export default {
  CONTAINER_CONFIG_NAME: 'config',
  UI_CONFIG_NAME: 'ui-config',
  CONTAINER_CONFIG_FILE: `${configMapDir}/backend-service-config.json`,
  UI_CONFIG_FILE: `${configMapDir}/frontend-config.json`,
  CERTIFICATES_DIR: 'certificates',
  FRONTEND_ROUTE: '/ui',
  LOGGING_CATEGORY_UI: 'ui',
  CERT_WATCH_DEBOUNCE_TIME: 1000,
  TLS_TYPE_INTERNAL_REFRESH: 'httpClient',
  FAVICON_ROUTE: '/favicon.ico',
};
