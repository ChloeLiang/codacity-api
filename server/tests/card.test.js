const { expect } = require('chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Card } = require('../models/card');
const {
  users,
  populateUsers,
  decks,
  populateDecks,
  cards,
  populateCards,
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateDecks);
beforeEach(populateCards);

describe('POST /decks/:id/cards', () => {
  it('should create a new card in the given deck', done => {
    const deckId = decks[0]._id.toHexString();
    const front = 'Question 3';
    const back = 'Answer 4';

    request(app)
      .post(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ front, back })
      .expect(200)
      .expect(res => {
        expect(res.body.card.front).to.equal(front);
        expect(res.body.card.back).to.equal(back);
        expect(res.body.card._deck).to.equal(deckId);
        expect(res.body.card.repetition).to.equal(0);
        expect(res.body.card.easiness).to.equal(2.5);
        expect(res.body.card.interval).to.equal(1);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Card.find({ front })
          .then(cards => {
            expect(cards.length).to.equal(1);
            expect(cards[0].front).to.equal(front);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create card with invalid body data', done => {
    const deckId = decks[0]._id.toHexString();

    request(app)
      .post(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Card.find()
          .then(cards => {
            expect(cards.length).to.equal(2);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 401 if deck belongs to other user', done => {
    const deckId = decks[1]._id.toHexString();

    request(app)
      .post(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
  });

  it('should return 404 if deck not found', done => {
    const deckId = new ObjectID().toHexString();

    request(app)
      .post(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
