# NorthCoders News

This repo contains a RESTful api for a news posting website called NorthCoders News. The api allows posting of articles, adding comments to articles and up and down voting of both comments and articles. For a full list of routes see below.

A hosted version of thei repo can be found at https://gentle-harbor-63950.herokuapp.com/api

## Getting Started

### Prerequisites

Node.js

MongoDB

git

### Installing

Clone or fork this repo

e.g:

```
git clone git@github.com:Sparky-Blue/BE-FT-northcoders-news.git
```

Navigate into folder and install all dependencies

```
npm i
```

Start MongoDB

```
mongod
```

Set up a local config file containing settings for PORT and DB_URL

Seed the development database

```
npm run seed:dev
```

Run the server

```
npm run dev
```

### Running the tests

To run tests start MongoDB and run npm test

```
npm t
```

Tests cover all routes and error handling. Test database will be reseeded for each test.

## API Endpoints

Get all the topics:

```
GET /api/topics
```

Return all the articles for a certain topic:

```
GET /api/topics/:topic_id/articles
```

or

```
GET /api/topics/:topic/articles
```

Returns all the articles:

```
GET /api/articles
```

Get all the comments for a individual article:

```
GET /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"} and a username query:

```
POST /api/articles/:article_id/comments
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up:

```
PUT /api/articles/:article_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=down:

```
PUT /api/comments/:comment_id
```

Deletes a comment:

```
DELETE /api/comments/:comment_id
```

Returns a JSON object with the profile data for the specified user.:

```
GET /api/users/:username
```

## Technologies

Northcoders News was built using Node.js. It uses Express, MongoDB and Mongoose. You can view a hosted version with a Heroku [here](https://gentle-harbor-63950.herokuapp.com/api). The Database is hosted on MLab.

* Node.js v9.2.0
* Express v4.16.3
* MongoDB v3.4.10
* Mongoose v4.16.3
