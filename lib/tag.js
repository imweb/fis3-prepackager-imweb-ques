var map = require('map-stream')
  , path = require('path')
  , fs = require('fs')
  , cheerio = require('cheerio')
  , tpl = require('dom.tpl/Qtpl')
  , TagSet = require('../utils/tagSet')
  , _ = require('../utils/components');

function Tag(str, name, optoins) {
  str = (str || '').trim() || '<div></div>';
  this._init(str, name, optoins);
}
var p = Tag.prototype;
p._init = function (str, name, options) {
  options = options || {};
  var self = this;
  this.dependences = new TagSet();
  this.tpl = tpl(
    _.fix(str, name, options.holder),
    {
      ret: options.ret,
      oncustomElement: function (ele) {
        // this child custom element name
        var childCustomTag = ele.name
          , comp = options.getComp(childCustomTag)
          // dependences
          , dependences = self.dependences
          , attribs
          , key;
        // if has this child custom component
        if (comp) {
          dependences.add(childCustomTag);
          options.onexist &&
            options.onexist(childCustomTag);
          // find custom element and replace it
          var $$ = cheerio.load(_.fix(
            comp.html,
            childCustomTag,
            options.holder
          ), { decodeEntities: false });

          attribs = $$._root.children[0].attribs;

          if (ele.attribs['id']) attribs['id'] = ele.attribs['id'];
          if (ele.attribs['class']) attribs['class'] = [attribs['class'], ele.attribs['class']].join(' ').trim();
          // ui component
          if (/^ui-/.test(childCustomTag)) {
            // nothing to do
          // third party component
          } else if (/^third-/.test(childCustomTag)) {
            // set q-third
            attribs['q-third'] = childCustomTag;
          // just a child component
          } else {
            // set q-vm
            attribs['q-vm'] = childCustomTag;
          }

          var content = $$('content')
            , $ele = $$(ele)
            , attr
            , effectAttrs
            , tmp
            , select;
          if (content.length) {
            content.each(function (i, ele) {
              ele = $$(ele);
              attr = ele.attr();
              effectAttrs = Object.keys(attr).filter(function (v) { return v !== 'select'; });
              select = ele.attr('select') || '*';
              if (select === '*') {
                tmp = $ele.contents();
              } else {
                tmp = $ele.children(select);
              }
              if (effectAttrs.length) {
                effectAttrs.forEach(function (key) {
                  tmp.attr(key, attr[key]);
                });
              }
              ele.replaceWith(tmp);
            });
          }

          // extend q-* attributes
          for (key in ele.attribs) {
            key.indexOf('q-') === 0 &&
              (attribs[key] = ele.attribs[key]);
          }

          return $$.html();
        } else {
          return ele;
        }
      }
    }
  );
};
p.destroy = function () {
  this.dependences = null;
  this.tpl = null;
}

module.exports = Tag;
