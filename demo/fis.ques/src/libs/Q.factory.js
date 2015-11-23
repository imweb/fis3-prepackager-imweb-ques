var Q = require('./Q');

function initSingle(el, opts) {
    opts.el = el;
    return Q.all(opts);
}

module.exports = function() {
    var components = window._components || {};

    Object.keys(components).forEach(function(name) {
        var comp = components[name];
        comp.module = require(comp.js);
        Q.define(name, comp.module);
    });

    Object.keys(components).forEach(function(name) {
        var comp = components[name];
        if (comp.child) {
            comp.module.init 
                ? comp.module.init() 
                : initSingle('.component-' + comp.uid, comp.module);
        }
    });
};

