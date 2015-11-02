var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var tpl = require('dom.tpl/Qtpl');
var TagSet = require('../utils/tagSet');
var _ = require('../utils/components');
var p;

function Tag(string, name, optoins) {
    this._init(string, name, optoins);
}

p = Tag.prototype;
p._init = function(string, name, options) {
    var self = this;

    options = options || {};
    this.dependences = new TagSet();

    // this component is extend component or not
    // default is false
    this.extend = false;
    this.hasExtend = {};
    this.tpl = tpl(
        _.fix(string, name), {
            ret: options.ret,
            justFind: options.justFind,
            oncustomElement: function(ele) {
                // this child custom element name
                var childCustomTag = ele.name,
                    componentPath = _.getComPath(childCustomTag)
                    // dependences
                    ,
                    dependences = self.dependences,
                    attribs, key;
                // if has this child custom component
                if (fis.util.isDir(componentPath)) {
                    dependences.add(childCustomTag);
                    options.onexist &&
                        options.onexist(childCustomTag);

                    !self.extend &&
                        'extend' in ele.attribs &&
                        (self.extend = childCustomTag);

                    // find custom element and replace it
                    var $$ = cheerio.load(_.fix(
                        fs.readFileSync(
                            path.join(componentPath, 'main.html'),
                            'utf-8'
                        ),
                        childCustomTag
                    ), {
                        decodeEntities: false
                    });

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
                        // when ele has extend attribute, it should not use q-vm
                    } else if (!('extend' in ele.attribs)) {
                        // set q-vm
                        attribs['q-vm'] = childCustomTag;
                    }

                    var content = $$('content'),
                        $ele = $$(ele),
                        attr, effectAttrs, tmp, select;
                    if (content.length) {
                        content.each(function(i, ele) {
                            ele = $$(ele);
                            attr = ele.attr();
                            effectAttrs = Object.keys(attr).filter(function(v) {
                                return v !== 'select';
                            });
                            select = (ele.attr('select') || '*').trim();
                            if (select === '*') {
                                tmp = $ele.contents();
                            } else if (/\*$/.test(select)) {
                                select = select.slice(0, -1);
                                tmp = $ele.children(select)
                                    .contents();
                            } else {
                                tmp = $ele.children(select);
                            }
                            if (effectAttrs.length) {
                                effectAttrs.forEach(function(key) {
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

                    $$('code').each(function(i, ele) {
                        ele = $$(ele);
                        ele.replaceWith(ele.html().replace(/(\n\r|\n)/g, '\\n'));
                    });

                    return $$.html();
                } else {
                    return ele;
                }
            }
        }
    );
    // console.log(this.tpl.toString());
};
p.destroy = function() {
    this.dependences = null;
    this.tpl = null;
};

module.exports = Tag;
