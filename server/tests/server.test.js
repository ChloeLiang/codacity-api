const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../server');
const { User } = require('../models/user');
const { users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'example@example.com';
    const password = 'abc123!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body._id).to.exist;
        expect(res.body.email).to.equal(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).to.exist;
            expect(user.password).to.not.equal(password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation erros if request is invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'test', password: '123' })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'abc123!' })
      .expect(400)
      .end(done);
  });
});
