var Service = require('../lib/Service'),
    http = require('http'),
    should = require('should'),
    async = require('async');

describe('Resouce - server', function() {
    before(function (done) {
        var server = http.createServer(function (req, res) {
            var body = '';

            req.on('data', function (data) {
                body += data;

                if (body.length > 1e6) { 
                    req.connection.destroy();
                }
            });

            req.on('end', function () {
                res.writeHead(200);

                res.write(JSON.stringify({
                    payload: body ? JSON.parse(body) : null,
                    method: req.method,
                    url: req.url
                }));

                res.end();
            });
        });

        server.listen(4567);
        done();
    });

    it('instanciates without breaking', function () {
        should(function () {
            new Service();
        }).not.throw();
    });

    it('correctly attaches methods to given namespaces', function () {
        var service = new Service('http://localhost:4567')
            .add('get.byName', { method: 'get' })
            .add('get.foo.byId', { method: 'get' })
            .add('get.foo.bar', { method: 'get' });

        service.get.should.be.an.Object;
        service.get.byName.should.be.a.Function;
        service.get.foo.byId.should.be.a.Function;
        service.get.foo.bar.should.be.a.Function;
    });

    it('resources send correct requests', function (done) {
        var service = new Service('http://localhost:4567')
            .add('list', { method: 'get' })
            .add('post', { route: 'create/:username' })
            .add('profile.update', { method: 'put', route: 'profile/update/:username' });

        async.series([

            function (callback) {
                service.list({}, { foo: 'bar' })
                .then(function (res) {
                    res.should.eql({
                        status: 200,
                        body: {
                            method: 'GET',
                            payload: null,
                            url: '/?foo=bar'
                        }
                    });

                    callback();
                });
            },

            function (callback) {
                service.post({ username: 'john', foo: 'bar' })
                .then(function (res) {

                    res.should.eql({
                        status: 200,
                        body: {
                            method: 'POST',
                            payload: { username: 'john', foo: 'bar' },
                            url: '/create/john'
                        }
                    });

                    callback();
                });
            },

            function (callback) {
                service.profile.update({ username: 'marc', bar: 'foo' }, { q: '123' })
                .then(function (res) {

                    res.should.eql({
                        status: 200,
                        body: {
                            method: 'PUT',
                            payload: { username: 'marc', bar: 'foo' },
                            url: '/profile/update/marc?q=123'
                        }
                    });

                    callback();
                });
            }

        ], done);
    });

    it('correctly bubbles up resources events', function (done) {
        var service = new Service('http://localhost:4567')
            .add('list', { method: 'get' });

        service.once('response', function (res) {
            res.status.should.equal(200);

            service.once('success', function (res, resource) {
                res.status.should.equal(200);

                resource.method.should.equal('get');
                resource.route.should.equal('http://localhost:4567/');

                done();
            });

            service.list();
        });

        service.list();

    });

});