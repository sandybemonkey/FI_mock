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

module.exports.clients = [
  {
    client_id: 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5',
    client_secret: '8f373c6e6a48ce0f5931f414b6739e4e0aa82eda20a083dc5c0522b6c691b17b',
    grant_types: ['refresh_token', 'authorization_code'],
    response_types_supported: ["code id_token token",],
    redirect_uris: ['http://localhost:3041/callback'],
    token_endpoint_auth_method: "client_secret_post",
    post_logout_redirect_uris: ["http://localhost:3041/logged-out"]
  },
];
