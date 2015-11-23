
/**
 * 查找组件
 * @param {String} name 用-支持多级目录
 * @param {Array.<String|Function>} components 组件目录/查找配置
 * @param {Object} ret fis上下文
 */
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
            // 查找函数
            comp = get(name, ret);
            if (comp) {
                return comp;
            }
        }
    }
    return null;
};

/**
 * 从文件夹下读组件
 * @param {String} root 
 * @param {String} name 用-支持多级目录
 *      root='/components' name='sub-chead' 则在/components/sub/chead下读取组件
 * @param {Object} ret fis上下文
 */
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

