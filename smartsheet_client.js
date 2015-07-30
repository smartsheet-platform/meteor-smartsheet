Smartsheet = {};

// Request Smartsheet credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Smartsheet.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'smartsheet'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  // At least one scope is required.
  // User profile info is returned with any scope.
  var defaultScope = ['READ_SHEETS'];
  scope = options.requestPermissions ? options.requestPermissions : defaultScope;
  // URL-encode space-delimited set of scopes
  // http://smartsheet-platform.github.io/api-docs/#access-scopes
  var flatScope = encodeURIComponent(scope.join(' '));

  var loginStyle = OAuth._loginStyle('smartsheet', config, options);

  // redirect_uri is optional
  var loginUrl =
        'https://app.smartsheet.com/b/authorize' +
        '?response_type=code' +
        '&client_id=' + config.clientId +
        '&scope=' + flatScope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "smartsheet",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: { height: 600 }
  });
};
