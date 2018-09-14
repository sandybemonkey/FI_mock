import database from './database';
import { findKey } from 'lodash';
import assert from 'assert';

const store = new Map();
const logins = new Map();
const uuid = require('uuid/v4');

let user = null;

class Account {
  constructor(id) {
    this.accountId = id || uuid();
    store.set(this.accountId, this);
  }
  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope) { // eslint-disable-line no-unused-vars
    return {
      sub: this.accountId, // it is essential to always return a sub claim

     address: {
        country: user[0].codePaysDeNaissance,
        formatted: user[0].adresseFormatee,
        locality: '000',
        postal_code: '000',
        region: '000',
        street_address: user[0].adresseFormatee,
      },
      birthdate: `${user[0].AAAA}-${user[0].MM}-${user[0].JJ}`,
      email: user[0].email,
      family_name: user[0].nomDeNaissance,
      gender: user[0].Gender,
      given_name: user[0].prenom,
      middle_name: user[0].secondPrenom,
      name: `${user[0].nomDeNaissance} ${user[0].prenom}`,
      nickname: 'Johny',
      phone_number: user[0].telephone,
      preferred_username: 'Jdawg',
      updated_at: user[0].updatedAt,
    };
  }

  static async findByLogin(login) {
    if (!logins.get(login)) {
      logins.set(login, new Account());
    }
    return logins.get(login);
  }

  static async findById(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    console.log('findById',id)
   if (!store.get(id)) new Account(id); // eslint-disable-line no-new
    return store.get(id);
  }

  static async authenticate(login, password) {
    let id = null;
    console.log('login',login)
    console.log('password',password)
    assert(login, 'identifiant must be provided');
    assert(password, 'password must be provided');
    database.connection.find({
      identifiant: login,
    }).then((result) => {
      id = result[0].$oid
      user = result;
      assert(id, 'Invalid credentials provided')
    }).catch((err) => {
      console.error('authenticate error',err)
    })
    return new this(id);
  }
}
module.exports = Account;