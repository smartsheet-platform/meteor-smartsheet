Smartsheet = {};

// http://smartsheet-platform.github.io/api-docs/#get-current-user
Smartsheet.whitelistedFields = ['id', 'email', 'firstName', 'lastName', 'locale', 'timezone'];


OAuth.registerService('smartsheet', 2, null, function(query) {

  var response = getTokens(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };

  var fields = _.pick(identity, Smartsheet.whitelistedFields);
  _.extend(serviceData, fields);

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken)
    serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.firstName + ' ' + identity.lastName}}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'smartsheet'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  // http://smartsheet-platform.github.io/api-docs/#oauth-flow
  try {
    response = HTTP.post(
      "https://api.smartsheet.com/2.0/token", {params: {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        code: query.code,
        hash: SHA256( OAuth.openSecret(config.secret) + '|' + query.code)
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Smartsheet. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Smartsheet. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
};

// http://smartsheet-platform.github.io/api-docs/#get-current-user
var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://api.smartsheet.com/2.0/users/me", {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Smartsheet. " + err.message),
                   {response: err.response});
  }
};


Smartsheet.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
