/* eslint-env mocha */
import chai from 'chai';
import assert from 'assert'
import chaiHttp from 'chai-http';
import simpleMock from 'simple-mock';
import database from '../../data/database';
import config from '../../config/config.json';

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;

describe('data/database.js ', () => {
  let db;

  beforeEach(() => {
    db = database.connection;
    simpleMock.mock(db, 'find');
  })

  afterEach(() => {
    simpleMock.restore();
  })

  describe('if provided identifiant is invalid', () => {
    it('should not return data case wrong login', function () {
      // setup
      const identifier = {
        identifiant: 'ZZZ',
        password: '123'
      }
      let expected = []

      // Action
      db.find({identifiant: identifier})
      let result = db.find.returnWith([])

      // Aseert
      assert.equal(db.find.callCount, 1)
      assert.deepEqual(result.actions[0].returnValue, expected)
    });
    it('should not return data case wrong passowrd', function () {
      // setup
      const identifier = {
        identifiant: 'ZZZ',
        password: '123',
      }
      let expected = []

      // Action
      db.find({identifiant: identifier})
      let result = db.find.returnWith([])

      // Aseert
      assert.equal(db.find.callCount, 1)
      assert.deepEqual(result.actions[0].returnValue, expected)
    });
  });

  describe('if provided identifiant is valid', () => {
    it('should return data ', function () {
      // setup
      const identifier = {
        identifiant: '3_melaine',
        password: 123
      };
      const expected = [{
        $oid: '5b3e1280c1eb6856db7362bb',
        SPI: '3999999887219',
        identifiant: '3_melaine',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
        nomDeNaissance: 'TROIS',
        prenom: 'MELAINE  EVELYNE SIMONE',
        secondPrenom: 'EVELYNE SIMONE',
        titre: 'MME',
        Gender: 'female',
        email: 'trois_melaine@mail.com',
        telephone: '123456789',
        birthdate: '1981-07-27',
        AAAA: '1981',
        MM: '7',
        JJ: '27',
      }]

      // action
      db.find({identifiant: identifier, password: identifier.password})
      const result = db.find.returnWith([{
        $oid: '5b3e1280c1eb6856db7362bb',
        SPI: '3999999887219',
        identifiant: '3_melaine',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
        nomDeNaissance: 'TROIS',
        prenom: 'MELAINE  EVELYNE SIMONE',
        secondPrenom: 'EVELYNE SIMONE',
        titre: 'MME',
        Gender: 'female',
        email: 'trois_melaine@mail.com',
        telephone: '123456789',
        birthdate: '1981-07-27',
        AAAA: '1981',
        MM: '7',
        JJ: '27',
      }])

      // Assert
      assert.equal(db.find.callCount, 1)
      assert.deepEqual(result.actions[0].returnValue, expected)
    });
  })
});