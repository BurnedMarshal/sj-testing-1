const app = require('../../app');
const chaiHttp = require('chai-http');
const chai = require('chai');
const pjson = require('../../package.json');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /', () => {
  const expectedResponse = {apiVersion: pjson.version};
  it('Test index API payload', async () => {
    const result = await chai.request(app).get('/info');
    expect(result).to.have.property('body');
    expect(result.body).to.be.deep.equals(expectedResponse);
    expect(result).to.have.property('status', 200);
  });
});

describe('404 Route', () => {
  const expectedResponse = {message: 'Not Found', error: {status: 404}};
  it('Test 404 route payload', async () => {
    const result = await chai.request(app).get('/404api');
    expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(404);
  });
});
