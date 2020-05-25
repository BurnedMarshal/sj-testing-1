const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;

const User = require('../../models/users');

const mongoose = require('mongoose');

chai.use(chaiHttp);

const {expectJson, createUser} = require('./utils/index');

describe('[INDEX] GET: /users', () => {
  it('Empty Array if no users are found', async () => {
    const result = await chai.request(app).get('/users');
    expectJson(result);
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.has.lengthOf(0);
  });

  describe('Users inside database', () => {
    let createdUser = undefined;
    before('create user', async () => {
      createdUser = await createUser();
    });
    after('delete user', () => {
      createdUser ? createdUser.remove() : console.log('missing user');
    });
    it('Users found if present in database', async () => {
      const result = await chai.request(app).get('/users');
      expectJson(result);
      expect(result.status).to.be.equal(200);
      expect(result.body).to.be.instanceOf(Array);
      expect(result.body).to.be.lengthOf(1);
    });
  });
});

describe('[SHOW] GET: /users/:id', () => {
  it('Returns status 404 if user is missing', async () => {
    // eslint-disable-next-line new-cap
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai.request(app)
        .get(`/users/${newObjectId}`);
    expectJson(result);
    expect(result.status).to.be.equal(404);
  });

  describe('Users inside database', () => {
    let createdUser = undefined;
    before('create user', async () => {
      createdUser = await createUser();
    });
    after('delete user', () => {
      createdUser ? createdUser.remove() : console.log('missing user');
    });
    it('Return expected user from database', async () => {
      const result = await chai.request(app)
          .get(`/users/${createdUser._id.toString()}`);
      expectJson(result);
      expect(result.status).to.be.equal(200);
      expect(result.body).to.has.property('_id', createdUser._id.toString());
    });
  });
});

describe('[CREATE] POST: /users', () => {
  let createdUserId = undefined;
  after('Delete user', async () => {
    createdUserId
      ? await User.findByIdAndDelete(createdUserId)
      : console.log('Missing document');
  });
  it('Save a new user inside database and return it', async () => {
    const newUser = {
      fullname: 'Fabrizio Bianchi',
      age: 22,
      email: 'fabrizio@gmail.com',
    };
    const result = await chai.request(app).post(`/users`).send(newUser);
    expectJson(result);
    expect(result).to.has.property('status', 201);
    expect(result.body).to.has.property('_id');
    createdUserId = result.body._id;
    const createdUser = await User.findById(createdUserId);
    expect(createdUser).to.be.not.undefined;
    expect(createdUser).to.has.property('name', 'Fabrizio');
    expect(createdUser).to.has.property('surname', 'Bianchi');
    expect(createdUser).to.has.property('age', newUser.age);
    expect(createdUser).to.has.property('email', newUser.email);
  });

  it('Validation error if email filed is not an email', async () => {
    const newUser = {
      name: 'Fabrizio',
      surname: 'Bianchi',
      age: 22,
      email: 'fabrizio',
    };
    const result = await chai.request(app).post(`/users`).send(newUser);
    expectJson(result);
    expect(result).to.has.property('status', 400);
  });
});

