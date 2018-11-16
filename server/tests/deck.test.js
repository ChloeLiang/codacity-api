const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../server');
const { Deck } = require('../models/deck');
const { users, populateUsers, decks, populateDecks } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateDecks);

describe('POST /decks', () => {
  it('should create a new deck', done => {
    const name = 'JavaScript';

    request(app)
      .post('/decks')
      .set('x-auth', users[0].tokens[0].token)
      .send({ name })
      .expect(200)
      .expect(res => {
        expect(res.body.name).to.equal(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Deck.find({ name })
          .then(decks => {
            expect(decks.length).to.equal(1);
            expect(decks[0].name).to.equal(name);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create deck with invalid body data', done => {
    request(app)
      .post('/decks')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Deck.find()
          .then(decks => {
            expect(decks.length).to.equal(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /decks', () => {
  it('should get all decks', done => {
    request(app)
      .get('/decks')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.decks.length).to.equal(1);
      })
      .end(done);
  });
});
