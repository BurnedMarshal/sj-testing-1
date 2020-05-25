import chai from 'chai';
const expect = chai.expect;

const User = require('../../../models/users');

module.exports.expectJson = function(request) {
  expect(request.header).to.has.property('content-type');
  expect(request.header['content-type']).contains('application/json');
};

module.exports.createUser = async function() {
  const newUser = {
    name: 'Fabrizio',
    surname: 'Bianchi',
    age: 22,
    email: 'fabrizio@gmail.com',
  };
  return await User.create(newUser);
};
