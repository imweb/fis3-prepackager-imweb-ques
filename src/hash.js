
var hashMap = {},
    uid = 0;
exports.md = function(name) {
    if (!hashMap[name]) {
        hashMap[name] = (++uid).toString(36);
    }
    return '_' + hashMap[name] + '_';
};

exports.plain = function(name) {
    return name + '_';
};

