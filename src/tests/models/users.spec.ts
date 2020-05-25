import chai from 'chai';
const expect = chai.expect;
const User = require('../../models/users');

describe('User.find()', () => {
  it('Find missing document', async () => {
    const user = await User.find({email: 'fabrizio@gmail.com'});
    expect(user).to.have.lengthOf(0);
  });
});

describe('User.create()', () => {
  /* before('Delete all users from DB test', async () => {
    await User.remove({});
  }); */
  const userDocuments: any[] = [];
  after('Delete all users from DB test', async () => {
    userDocuments.forEach(async (user) => {
      await user.remove();
    });
  });

  it('Create new User Document', async () => {
    const newUser = {
      name: 'Fabrizio',
      surname: 'Bianchi',
      age: 22,
      email: 'fabrizio@gmail.com',
    };
    const timestamp = Date.now();
    const user = await User.create(newUser);
    userDocuments.push(user);
    expect(user).has.property('name', newUser.name);
    expect(user).has.property('surname', newUser.surname);
    expect(user).has.property('age', newUser.age);
    expect(user).has.property('email', newUser.email);
    expect(user).has.property('created_at');
    expect(user.created_at).to.be.greaterThan(timestamp);
    expect(user.created_at).to.be.lessThan(Date.now());
    expect(user).has.property('_id');
  });

  it('Create new User Document with custom created_at', async () => {
    const expectedTimestamp = 150;
    const newUser = {
      name: 'Fabrizio',
      surname: 'Bianchi',
      age: 22,
      email: 'fabrizio@gmail.com',
      created_at: expectedTimestamp,
    };
    const user = await User.create(newUser);
    userDocuments.push(user);
    expect(user).has.property('name', newUser.name);
    expect(user).has.property('surname', newUser.surname);
    expect(user).has.property('age', newUser.age);
    expect(user).has.property('email', newUser.email);
    expect(user).has.property('created_at', expectedTimestamp);
    expect(user).has.property('_id');
  });
});
