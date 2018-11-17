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
        expect(res.body.front).to.equal(front);
        expect(res.body.back).to.equal(back);
        expect(res.body._deck).to.equal(deckId);
        expect(res.body.repetition).to.equal(0);
        expect(res.body.easiness).to.equal(2.5);
        expect(res.body.interval).to.equal(1);
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

describe('GET /decks/:id/cards', () => {
  it('should get all cards in the given deck', done => {
    const deckId = decks[0]._id.toHexString();

    request(app)
      .get(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).to.equal(1);
      })
      .end(done);
  });

  it('should return 401 if deck belongs to other user', done => {
    const deckId = decks[1]._id.toHexString();

    request(app)
      .get(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
  });

  it('should return 404 if deck not found', done => {
    const deckId = new ObjectID().toHexString();

    request(app)
      .get(`/decks/${deckId}/cards`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /cards/:id', () => {
  it('should update the card', done => {
    const cardId = cards[0]._id.toHexString();
    const front = 'This should be the new front';
    const back = 'This should be the new back';
    const repetition = 4;
    const easiness = 2;
    const interval = 20;
    const _deck = decks[1]._id.toHexString();

    request(app)
      .patch(`/cards/${cardId}`)
      .send({ front, back, repetition, easiness, interval, _deck })
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.front).to.equal(front);
        expect(res.body.back).to.equal(back);
        expect(res.body.repetition).to.equal(repetition);
        expect(res.body.easiness).to.equal(easiness);
        expect(res.body.interval).to.equal(interval);
        expect(res.body._deck).to.equal(_deck);
      })
      .end(done);
  });

  it('should not update the card created by other user', done => {
    const cardId = cards[0]._id.toHexString();
    const front = 'This should be the new front';

    request(app)
      .patch(`/cards/${cardId}`)
      .send({ front })
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if card not found', done => {
    const cardId = new ObjectID().toHexString();

    request(app)
      .patch(`/cards/${cardId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .patch('/cards/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /cards/:id', () => {
  it('should delete a card', done => {
    const cardId = cards[1]._id.toHexString();

    request(app)
      .delete(`/cards/${cardId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).to.equal(cardId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Card.findById(cardId)
          .then(card => {
            expect(card).to.be.null;
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not delete a card created by other user', done => {
    const cardId = cards[0]._id.toHexString();

    request(app)
      .delete(`/cards/${cardId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Card.findById(cardId)
          .then(card => {
            expect(card).to.exist;
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if card not found', done => {
    const cardId = new ObjectID().toHexString();

    request(app)
      .delete(`/cards/${cardId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/cards/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
