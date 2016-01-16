
var hashMap = {},
    uid = 26;
exports.md = function(name) {
    if (!hashMap[name]) {
        hashMap[name] = (++uid).toString(26).replace(/\d/g, function(n) {
            return 'zyxwvutsrq'[n];
        });
    }
    return hashMap[name] + '_';
};

exports.plain = function(name) {
    return name + '_';
};

