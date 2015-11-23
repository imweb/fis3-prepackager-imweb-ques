var map = require('map-stream')
  , path = require('path')
  , fs = require('fs')
  , cheerio = require('cheerio')
  , walker = require('../utils/walker')
  , TagSet = require('../utils/tagSet')
  , Tag = require('./tag')
  , _ = require('../utils/components');

/**
 * Page
 * @class
 * @param {String} str
 */
function Page(str, options) {
  this._init(str, options);
}

var p = Page.prototype;
p._init = function (str, options) {
  options = options || {};
  this.getComp = options.getComp;
  this.holder = options.holder;

  this.$ = cheerio.load(str);
  // this page's custom targets
  this.customTags = new TagSet();
  // this page's ui targets
  this.uiTags = new TagSet();
  // uid for component
  this.uid = 0;
  // TODO
  this.param = {
    disabled: {}
  };
  // build all custom elements
  this.buildTag();
};

p.appendCss = function(path) {
    this.$('head').append('<link rel="stylesheet" href="' + path + '"/>');
};

p.appendJs = function(path) {
    this.insertJs('<script src="' + path + '"></script>');
};

p.appendJsCode = function(code) {
    this.insertJs('<script>' + code + '</script>');
};

p.insertJs = function(node) {
    var self = this;
    if (self._$jsbefore) {
        self._$jsbefore.before(node);
    } else if (self._$jsbefore === null) {
        self.$('body').before(node);
    } else {
        self.$('body script').each(function(i, item) {
            if (!item.attribs.src) {
                self._$jsbefore = cheerio(item);
                return false;
            }
        });
        self._$jsbefore = self._$jsbefore || null;
        self.insertJs(node);
    }
};

p.buildTag = function () {
  var self = this
    , $ = this.$
    , tags = new TagSet()
    , param = this.param
    , customTags = this.customTags
    , uiTags = this.uiTags
    , deps = {};

  // find all targets in body
  walker.tags($('body'), function (node) {
    tags.add(node.name);
  });

  // find all custom targets
  tags.custom().forEach(function (customTag) {
    // feature flag
    // remove all disabled custom element
    if (param.disabled[customTag]) return $(customTag).remove();

    var comp = self.getComp(customTag);
    // if the component exist
    if (comp) {
      // diy target
      if (/^diy-/.test(customTag)) {
        // clear module cache
        delete require.cache[comp.jsPath];
        // just do it yourself
        try {
          require(comp.jsPath).call(self, {
            tagName: customTag,
            $: $,
            container: $(customTag)
          });
        } catch(e) {
          self.logError(e.message + ' in ' + comp.jsPath);
        }
      // ui target
      } else if (/^ui-/.test(customTag)) {
        uiTags.add(customTag);

        var fragmentTpl = new Tag(comp.html, customTag, { 
            getComp: self.getComp,
            holder: self.holder,
            ret: 'function' 
          }).tpl
          , $customTag = $(customTag);

        $customTag.each(function (i, ele) {
          ele = $(ele);
          ele.replaceWith(_.makeFragment($, ele, fragmentTpl))
        });
      } else {
        customTags.add(customTag);
        // build fragment template
        var tag = new Tag(comp.html, customTag, {
            getComp: self.getComp,
            holder: self.holder,
            ret: 'function' 
          })
          , fragmentTpl = tag.tpl
          , $customTag = $(customTag);

        tag.dependences.values()
          .forEach(function (dep) {
              deps[dep] = deps[dep] || self.getComp(dep);
          });

        // destroy tag
        tag.destroy();
        tag = null;

        // set dep uid
        comp.uid = ++self.uid;
        comp.child = 1;
        // set dep
        deps[comp.name] = comp;

        // replace all custom targets
        $customTag.each(function (i, ele) {
          ele = $(ele);
          ele.replaceWith(_.makeFragment($, ele, fragmentTpl, comp.uid));
        });
      }
    }
  });

  this.deps = deps;
};

p.destroy = function () {
    // TODO
};

module.exports = Page;
