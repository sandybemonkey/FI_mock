import config from './config.json';

/**
 * Provider configuration
 * @see {@link https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#configuration-options}
 * @type {{cookies: {long: {signed: boolean, maxAge: number},
 * short: {signed: boolean}, keys: string[]},
 * claims: {address: string[], email: string[], phone: string[], profile: string[]},
 * features: {devInteractions: boolean, sessionManagement: boolean, discovery: boolean, claimsParameter: boolean},
 * routes: {authorization: string, end_session: string, token: string, userinfo: string},
 * formats: {default: string, AccessToken: string},
 * prompts: string[], interactionUrl: (function(*, *): string),
 * logoutSource(*, *): Promise<void>, clientCacheDuration: number,
 * ttl: {AccessToken: number, AuthorizationCode: number, IdToken: number, DeviceCode: number, RefreshToken: number}}}
 */
module.exports.provider = {
  cookies: {
    long: { signed: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true },
    keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
  },
  claims: {
    address: ['address'],
    email: ['email'],
    phone: ['phone_number'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name','nickname', 'preferred_username', 'updated_at'],
  },
  features: {
    devInteractions: false,
    sessionManagement: true,
    discovery: true,
    claimsParameter: true,
  },
  routes: {
    authorization: '/authorize',
    end_session: '/session/end',
    token: '/token',
    userinfo: '/user',
  },
  formats: {
    default: 'opaque',
    AccessToken: 'jwt',
  },
  prompts: [ 'login', 'consent'],
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/interaction/${ctx.oidc.uuid}`;
  },
  async logoutSource(ctx, form) {
    ctx.body = `<!DOCTYPE html>
      <head>
        <link rel='stylesheet' href='/stylesheets/bulma.min.css' />
        <title>Logout</title>
      </head>
      <body>
        <div class="container has-text-centered">
          ${form}
          <h2 class="title">
            Do you want to logout ?
          </h2>
          <button class="button is-success" onclick="logout()">Yes</button>
          <button class="button is-danger" onclick="document.forms[0].submit()">Please, don't!</button>
        </div>
        
        <script>
          function logout() {
            var form = document.forms[0];
            var input = document.createElement('input');
            input.type = 'hidden';
            input.class = 'input'
            input.name = 'logout';
            input.value = 'yes';
            form.appendChild(input);
            form.submit();
          }
      </script>
     </body>
     </html>`;
  },
  clientCacheDuration: 1 * 24 * 60 * 60, // 1 day in seconds,
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  },
};


/**
 * Client configuration
 * @type {{client_id, client_secret, grant_types, response_types_supported, redirect_uris, token_endpoint_auth_method, post_logout_redirect_uris}[]}
 */
module.exports.clients = [
  {
    client_id: config.client_id,
    client_secret: config.client_secret,
    grant_types: config.grant_types,
    response_types_supported: config.response_types_supported,
    redirect_uris: config.redirect_uris,
    token_endpoint_auth_method: config.token_endpoint_auth_method,
    post_logout_redirect_uris: config.post_logout_redirect_uris
  },
];
