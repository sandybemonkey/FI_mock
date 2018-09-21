import querystring from 'querystring';
import {urlencoded} from 'express'; // eslint-disable-line import/no-unresolved
import Account from '../data/account';

const body = urlencoded({extended: false});

module.exports = (app, provider) => {
  const {constructor: {errors: {SessionNotFound}}} = provider;

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
  }

  /**
   * This route is the entry point of the interaction system used by oidc-provider
   * @see {@link https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#interaction}
   */
  app.get('/interaction/:grant', setNoCache, async (req, res, next) => {
    let error = {message: ''}

    try {
      /**
       * Getting the interaction details
       * and the client informations
       */
      const details = await provider.interactionDetails(req);
      const client = await provider.Client.find(details.params.client_id);

      if (details.interaction.error === 'login_required') {
        return res.render('index', {
          client,
          details,
          title: 'Sign-in',
          error,
          params: querystring.stringify(details.params, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
          interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
        });
      }
      /*return res.render('interaction', {
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
      });*/

    } catch (err) {
      return next(err);
    }
  });

  /**
   * This is where the form data, of the previous route, are handles
   * if this part is good you getting your authorization code
   * this is done by calling interactionFinished
   */
  app.post('/interaction/:grant/login', setNoCache, async (req, res, next) => {
    /**
     * Getting the interaction details
     * and the client informations
     */
    const details = await provider.interactionDetails(req);
    const client = await provider.Client.find(details.params.client_id);

    try {
      // Authenticate the client
      Account
        .authenticate(req.body.login, req.body.password)
        .then(async (data) => {
          // no data stay on the page with error message
          if (data === null) {
            let error = {message: 'Invalid credentiales'}
            res.render('index', {details, client, title: 'Sign-In', error: error});
          }
          // Get the user info because we need is id
          const account = await Account.findByLogin(req.body.login);

          // Create the result object need by interactionFinished
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
          // Client is authorize moving to the next interarction
          await provider.interactionFinished(req, res, result)
        }).catch((err) => {
          throw err;
      })
    } catch (err) {
      next(err)
    }
  });
};
