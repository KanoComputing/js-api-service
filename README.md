## API Service

> Simple http service / api promised wrapper for client-side JavaScript or Node.js. This class helps you creating collections of [api-resources](https://github.com/KanoComputing/js-api-resource) with an intuitive and simple api.

## Simple usage

```javascript
var Service = require('api-service');

var myApiWrapper = new Service('http://localhost/api')

    // Add users endpoints
    .add('users.list', { method: 'get', route: 'users' })
    .add('users.signup', { method: 'post', route: 'users/signup' })
    .add('users.get.byId', { method: 'get', route: 'users/:id' })
    .add('users.get.byUsername', { method: 'get', route: 'users/username/:username' })

    // Add posts endpoints
    .add('posts.save', { method: 'post', route: 'posts' })
    .add('posts.list', { method: 'get', route: 'posts' })
    .add('posts.get.byId', { method: 'get', route: 'posts/:id' })
    .add('posts.delete', { method: 'delete', route: 'posts/:id' })

    // Add a middleware function that adds authorization headers to request
    .use(function (req, next) {
        if (token) {
            req.setRequestHeader('Authorization', token);
        }

        next();
    });

// GET /users
myApiWrapper.users.list()
.then(function (res) {
    var users = res.body;
}, function (res) {
   var error = res.body;
});

// GET /users?q=foo
myApiWrapper.users.list({}, { q: 'foo' })
.then(function (res) {
    var users = res.body;
});


// POST /posts with payload
myApiWrapper.posts.save({ title: 'Foo bar', text: 'Some text...' })
.then(function (res) {
    var success = res.body.success;
}, function (res) {
   var error = res.body;
});

// DELETE /posts/some_id
myApiWrapper.posts.save({ id: 'some_id' })
.then(function (res) {
    var success = res.body.success;
}, function (res) {
   var error = res.body;
});

## Service

**This class is used to group and organise instances of the [api-resource](https://github.com/KanoComputing/js-api-resource) class.**
Service instances are also event-emitters and they will propagate all events sent by any of their `Resource` children.

### Constructor

* `baseUrl` (*String*) Service base URL (E.g. `'http://www.my-api.com'`) - without `/` at the end

#### Events

The events propagated by this class are documented in the [Resource](https://github.com/KanoComputing/js-api-resource) readme.

#### Methods

`.add(namespace, [ options ])` Add an endpoint to the service. This will be an instance of [Resource](https://github.com/KanoComputing/js-api-resource) pass the options to its constructor
`.use(middleware)` Add a middleware function to the resource. The function will be called on the `Resource` instance and receive as arguments the `XMLHttpRequest` request instance and the `next` function to proceed.

## Test

Tests are currently written on server-side only. Run `npm install` and `npm test` to test.

## Contribution

Contributions are welcome as long as documented and tested.

## License

Copyright (c) 2014 Kano Computing Ltd. - Released under the [MIT license](https://github.com/KanoComputing/js-api-service/blob/master/LICENSE)