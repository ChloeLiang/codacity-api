# Codacity-API

Codacity-API is the back-end RESTful API service for [Codacity](https://codacity.netlify.com) -
a single page flashcard application that supports markdown notation and syntax
highlighting. It's built with Node.js, Express, and MongoDB and tested with [Mocha](https://mochajs.org/),
[Chai](https://www.chaijs.com/) and Supertest.

The source code for the front-end React app is available [here](https://github.com/ChloeLiang/codacity).

## Getting Started

These instructions will get you a copy of the project up and running on your local
machine for development and testing purposes. See deployment for notes on how to
deploy the project on a live system.

### Prerequisites

Download the back end API for this project [here](https://github.com/ChloeLiang/codacity-api).

Install [Node.js](https://nodejs.org/en/) (version 8.10.0 or later).

Install MongoDB using Homebrew.

```bash
# Install Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install MongoDB
brew install mongodb
```

Create a directory for MongoDB to store its data and make sure this directory has the right permission.

```bash
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

### Installing

Start MongoDB:

```bash
mongod
```

Install all the dependencies:

```bash
cd codacity-api
npm install
```

Start the back end server at localhost:3900.

```bash
cd codacity-api
npm start
```

## Test

Run all the test cases:

```bash
npm test
```

## Deployment

These instructions will get the back-end API up and running on Heroku.

### Host Database on mLab

Create a new database.

- Sing up an [mLab account](https://mlab.com/) and sign in to your dashboard.
- Click **+ Create new** to create a new database.
- Choose any Cloud Provider and select the free **SANDBOX** for Plan Type.
- Choose a preferred region.
- Give your database a name. For example: codacity.
- Continue and submit order.

Create a user for this database.

- Inside the database you just created, click **Users** tab.
- Click **Add database user** and specify database username and password.

At the database page, there's a MongoDB URI available on the top. We'll set Heroku's
MONGODB_URI environment variable to this value later. It looks like:

```bash
mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:33212/codacity
```

### Setup Heroku

Make sure you have an account with [Heroku](https://www.heroku.com/) and have installed
the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli). Choose a region.

Login with Heroku credentials:

```bash
$ heroku login
Enter your Heroku credentials.
Email: adam@example.com
Password (typing will be hidden):
Authentication successful.
```

### Deploy to Heroku

Create a Heroku app via the command line:

```bash
cd codacity-api
heroku create
```

Set the MONGODB_URI variable to your mLab database URI. Replace `<dbuser>` and
`<dbpassword>` with your database's user and password. For exmaple:

```bash
heroku config:set MONGODB_URI=mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:33212/codacity
```

Add, and commit all your data to git. Then push it to Heroku:

```bash
git push heroku master
```

## Contributing

When contributing to this repository, please first discuss the change you wish to
make via issue, email, or any other method with the owners of this repository
before making a change.
