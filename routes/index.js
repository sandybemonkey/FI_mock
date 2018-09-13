import querystring from 'querystring';

import { urlencoded } from 'express'; // eslint-disable-line import/no-unresolved

import Account from '../data/account';

const body = urlencoded({ extended: false });

module.exports = (app, provider) => {
  const { constructor: { errors: { SessionNotFound } } } = provider;

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
  }
  // http://localhost:3000/auth?response_type=code&client_id=c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5&redirect_uri=http://localhost:3000/callback&scope=openid profile birth&state=customState11&nonce=customNonce11
  app.get('/interaction/:grant', setNoCache, async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req);
      const client = await provider.Client.find(details.params.client_id);
      console.log('details params .......',details.params)
      if (details.interaction.error === 'login_required') {
        return res.render('index', {
          client,
          details,
          title: 'Sign-in',
          params: querystring.stringify(details.params, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
          interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
        });
      }
      return res.render('interaction', {
        client,
        details,
        title: 'Authorize',
        params: querystring.stringify(details.params, ',<br/>', ' = ', {
          encodeURIComponent: value => {
            console.log(value)
            value
          },
        }),
        interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
          encodeURIComponent: value => value,
        }),
      });
    } catch (err) {
      return next(err);
    }
  });

  app.post('/interaction/:grant/login', setNoCache, async (req, res, next) => {
    try {
      Account.authenticate(req.body.login, req.body.password).then((data, err) => {
        if (err) {
          console.error(err)
        }
        console.log(data)
      })
      const account = await Account.findByLogin(req.body.login);
      console.log('account......', account)
      const result = {
        login: {
          account: account.accountId,
          acr: 'urn:mace:incommon:iap:bronze',
          amr: ['pwd'],
          remember: !!req.body.remember,
          ts: Math.floor(Date.now() / 1000),
        },
        consent: {},
      };
      await provider.interactionFinished(req, res, result)
    } catch (err) {
      next(err);
    }
  });
};
