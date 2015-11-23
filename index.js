// begin from here
var _ = require('lodash');
var getComp = require('./getComp');
var Page = require('./lib/page');

var entry = module.exports = function(ret, conf, settings, opt) {

    var components = {}; // name: {js,jsPath,html,htmlPath,css,cssPath}

    function _getComp(name) {
        var comp = typeof components[name] !== 'undefined'
            ? components[name]
            : components[name] = getComp(name, settings.components, ret);
        return comp ? _.extend({}, comp) : null;
    }

    // html
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isHtmlLike && (file.isQPage || hasQMark(file, settings))) {
            var p = new Page(file.getContent(), {
                getComp: _getComp,
                holder: settings.holder
            });

            var deps = {};
            fis.util.map(p.deps, function(name, dep) {
                var css = dep.cssFile,
                    js = dep.jsFile;
                css && p.appendCss(css.url);
                js && p.appendJs(js.url);
                deps[name] = {
                    js: js && (js.extras && js.extras.moduleId || js.url) || null,
                    child: dep.child || 0,
                    uid: dep.uid || 0
                };
            });

            p.appendJsCode('var _components = ' + JSON.stringify(deps) + ';');

            // expand html
            file.setContent(p.$.html());
        }
    });

    // replace comp holder
    fis.util.map(components, function(name, comp) {
        ['jsFile', 'cssFile'].forEach(function(item) {
            var f = comp[item];
            if (f) {
                f.setContent(replaceHolder(f.getContent(), name, settings));
            }
        });
    });
};

function replaceHolder(str, name, conf) {
    return str && str.replace(conf.holder, name + '__') || str;
}

function hasQMark(file, conf) {
    var i = (file.getContent() || '').indexOf(conf.qMark);
    return i >= 0 && i < 200;
}

entry.defaultOptions = {
    qMark: '<!--isQPage-->',

    holder: /___|\$__/g,

    components: ['/components']
};

