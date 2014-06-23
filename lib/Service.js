var Resource = require('api-resource'),
    util = require('./util'),
    EventEmitter = require('eventemitter2').EventEmitter2;

var HTTP_METHODS = [
    'get', 'post', 'put', 'delete', 'options', 'head', 'connect', 'trace'
];

function Service (baseUrl) {
    EventEmitter.call(this, { wildcard: true });

    this.baseUrl = baseUrl;
    this.middleware = [];
    this.resources = [];

    return this;
}

// Service class - Wraps Resource instances

Service.prototype = Object.create(EventEmitter.prototype);

// Add method - Attach a new resource to instance at given namespace

Service.prototype.add = function (ns, options) {
    var nsIsMethod = HTTP_METHODS.indexOf(ns) !== -1,
        self = this,
        resource;

    options.route = options.route || '';

    if (this.baseUrl && this.baseUrl.substr(-1) !== '/' && options.route.substr(0, 1) !== '/') {
        options.route = '/' + options.route;
    }

    options.method = !options.method && nsIsMethod ? ns : options.method || null;
    options.route = this.baseUrl ? this.baseUrl + (options.route || '') : this.route;

    resource = new Resource(options);

    resource.on('*', function () {
        var args = [ resource.event ],
            i;

        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }

        args.push(resource);

        self.emit.apply(self, args);
    });

    this.middleware.forEach(function (fn) {
        resource.use(fn);
    });

    util.attachToNamespace(this, ns, resource.query.bind(resource));

    this.resources.push(resource);

    return this;
};

// Use method - Attaches middleware function to all Resources

Service.prototype.use = function (fn) {
    this.middleware.push(fn);

    this.resources.forEach(function (resource) {
        resource.use(fn);
    });

    return this;
};

module.exports = Service;