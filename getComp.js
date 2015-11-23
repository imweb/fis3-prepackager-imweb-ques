
var fs = require('fs');
var path = require('path');

module.exports = function (name, components, ret) {
    for (var i = 0; i < components.length; i++) {
        var get = components[i],
            comp;
        if (typeof get === 'string') {
            comp = readComp(get, name, ret);
            if (comp) {
                return comp;
            }
        } else if (typeof get === 'function') {
            comp = get(name, ret);
            if (comp) {
                return comp;
            }
        }
    }
    return null;
};

function readComp(root, name, ret) {
    var dir = [
        '', root.replace(/^\//, ''), name.replace(/-/g, '/'), ''
    ].join('/');
    var html = ret.src[dir + 'main.html'],
        js = ret.src[dir + 'main.js'],
        css = ret.src[dir + 'main.css'] 
            || ret.src[dir + 'main.scss'] 
            || ret.src[dir + 'main.less'];
    if (html) {
        return {
            name: name,
            html: html.getContent(),
            htmlFile: html,
            js: js && js.getContent() || null,
            jsFile: js || null,
            css: css && css.getContent() || null,
            cssFile: css || null
        };
    } else {
        return null;
    }
}

