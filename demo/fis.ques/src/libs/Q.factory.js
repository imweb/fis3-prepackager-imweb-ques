var Q = require('./Q');

function initSingle(el, opts) {
    opts.el = el;
    return Q.all(opts);
}

module.exports = function() {
    var components = window._components || {};

    $.each(components, function(name, comp) {
        comp.module = require(comp.js);
        Q.define(name, comp.module);
    });

    $.each(components, function(name, comp) {
        if (comp.child) {
            comp.module.init 
                ? comp.module.init() 
                : initSingle('.component-' + comp.uid, comp.module);
        }
    });
};

