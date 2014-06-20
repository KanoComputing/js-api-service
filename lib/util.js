// Attach value to an object at given namespace

exports.attachToNamespace = function (root, ns, val) {
    var segments = ns.split('.'),
        cur = root,
        key = segments.pop();

    // Recursively create namespace on root object
    segments.forEach(function (segment) {
        if (!cur[segment]) {
            cur[segment] = {};
        }
        cur = cur[segment];
    });

    // Attach value to created namespace
    cur[key] = val;
};