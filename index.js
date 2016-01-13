// begin from here
var _ = require('lodash'),
    getComp = require('./src/getComp'),
    hash = require('./src/hash'),
    Page = require('./lib/page');

var entry = module.exports = function(ret, conf, settings, opt) {

    var components = {}; // 结构: name: {js,jsFile,html,htmlFile,css,cssFile}

    // 获取查找组件
    function _getComp(name) {
        if (typeof components[name] === 'undefined') {
            components[name] = getComp(name, settings.components, ret);
            if (components[name]) {
                // set hash
                components[name].hash = 
                    settings.hash ? hash.md(name) : hash.plain(name);
            }
        }
        return components[name] ? _.extend({}, components[name]) : null;
    }

    // html
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isHtmlLike && (file.isQPage || hasQMark(file, settings))) {
            // 让Ques的Page找到它的依赖和展开组件的html
            var p = new Page(file.getContent(), {
                getComp: _getComp,
                holder: settings.holder
            });

            var deps = {};
            fis.util.map(p.deps, function(name, dep) {
                var css = dep.cssFile,
                    js = dep.jsFile;
                // 添加组件css,js依赖
                css && file.addRequire(css.id);
                js && file.addRequire(js.id);
                deps[name] = {
                    js: js && (js.extras && js.extras.moduleId || js.url) || null,
                    child: dep.child || 0,
                    uid: dep.uid || 0
                };
            });

            // 添加组件信息
            p.appendJsCode('var _components = ' + JSON.stringify(deps) + ';');

            // expand html
            file.setContent(p.$.html());
        }
    });

    // 替换组件js,css中的占位符
    fis.util.map(components, function(name, comp) {
        if (comp) {
            ['jsFile', 'cssFile'].forEach(function(item) {
                var f = comp[item];
                if (f) {
                    f.setContent(replaceHolder(f.getContent(), comp, settings));
                }
            });
        }
    });
};

// 替换占位符
function replaceHolder(str, comp, settings) {
    return str && str.replace(settings.holder, comp.hash) || str;
}

// 是否有Ques页面标记
function hasQMark(file, settings) {
    var i = (file.getContent() || '').indexOf(settings.qMark);
    return i >= 0 && i < 200;
}

entry.defaultOptions = {

    // html文件是Ques页面的标记
    qMark: '<!--isQPage-->', 

    // 占位符
    holder: /___|\$__/g,

    // 是否对占位符做hash处理
    hash: true,

    // 组件路径
    components: ['/components']
};

