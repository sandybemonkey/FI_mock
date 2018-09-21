/* eslint-env mocha */
import chai from 'chai';
import assert from 'assert'
import chaiHttp from 'chai-http';
import simpleMock from 'simple-mock';
import account from '../../data/account';
import config from '../../config/config.json';
import app from '../../app'

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;


describe('routes/index', () => {
  it('should get a status 404 if "/" is call', (done) => {
    chai.request('http://localhost:4000')
      .get('/')
      .end((err, res) => {
        expect(res.body.error).to.not.be.null;
        expect(res).to.have.status(404);
        done()
      })
  });

  it('should get a status 400 if "/authorize" is call with invalid query', (done) => {
    chai.request('http://localhost:4000')
      .get('/authorize')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      })
  });

  it('should get a status 302 if "/authorize" is call with valid query', (done) => {
    // Setup
    chai.request('http://localhost:4000')
      .get('/authorize').redirects(0)
      .query({
        client_id: 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5',
        redirect_uri: 'http://localhost:3041/oidc_callback',
        response_type: 'code',
        scope: 'openid profile birth',
        state:'321',
        nonce:'123'
      })
      .end((err, res) => {
        expect(res).to.have.status(302);
        expect(res.redirect).to.have.equal(true);
        expect(res.redirects).to.be.empty;
        done()
      })
  });
})
