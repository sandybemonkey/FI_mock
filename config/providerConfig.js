module.exports.provider = {
  cookies: {
    long: { signed: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true },
    keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
  },
  claims: {
    amr: null,
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
      'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
  },
  features: {
    devInteractions: false,
  },
  formats: {
    default: 'opaque',
    AccessToken: 'jwt',
  },
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/interaction/${ctx.oidc.uuid}`;
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
    redirect_uris: ['http://localhost:3000/callback'],
  },
];
