Package.describe({
  summary: "Smartsheet OAuth flow, API 2.0",
  version: "1.0.0",
  name: "smartsheet:meteor-smartsheet",
  git: "https://github.com/smartsheet-platform/meteor-smartsheet.git"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('sha', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.export('Smartsheet');

  api.addFiles(
    ['smartsheet_configure.html', 'smartsheet_configure.js'],
    'client');

  api.addFiles('smartsheet_server.js', 'server');
  api.addFiles('smartsheet_client.js', 'client');
});
