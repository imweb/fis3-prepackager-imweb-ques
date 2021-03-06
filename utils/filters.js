/**
 * @maintainer donaldyang
 */

var digitsRE = /(\d{3})(?=\d)/g,
    keyCodes = {
        enter    : 13,
        tab      : 9,
        'delete' : 46,
        up       : 38,
        left     : 37,
        right    : 39,
        down     : 40,
        esc      : 27
    };

module.exports = {
    /**
     * Stringify value.
     *
     * @param {Number} indent
     */
    json: {
        read: function (value, indent) {
            return typeof value === 'string' ?
                value :
                    JSON.stringify(value, null, Number(indet) || 2);
        },
        write: function (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
    },

    /**
     * 'abc' => 'Abc'
     */
    capitalize: function (value) {
        if (!value && value !== 0) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
    },

    /**
     * 'abc' => 'ABC'
     */
    uppercase: function () {
        return (value || value === 0) ?
            value.toString().toUpperCase() :
                '';

    },

    /**
     * 'AbC' => 'abc'
     */

    lowercase: function (value) {
        return (value || value === 0) ?
            value.toString().toLowerCase() :
                '';
    },

    /**
     * 12345 => $12,345.00
     *
     * @param {String} sign
     */
    currency: function (value, sign) {
        value = parseFloat(value);
        if (!value && value !== 0) return '';
        sign = sign || '$';
        var s = Math.floor(Math.abs(value)).toString(),
            i = s.length % 3,
            h = i > 0 ?
                (s.slice(0, i) + (s.length > 3 ? ',' : '')) :
                    '',
            f = '.' + value.toFixed(2).slice(-2);
        return (value < 0 ? '-' : '') +
            sign + h + s.slice(i).replace(digitsRE, '$1,') + f;
    },

    /**
     * 'item' => 'items'
     *
     * @params
     *  an array of strings corresponding to
     *  the single, double, triple ... forms of the word to
     *  be pluralized. When the number to be pluralized
     *  exceeds the length of the args, it will use the last
     *  entry in the array.
     *
     *  e.g. ['single', 'double', 'triple', 'multiple']
     */
    pluralize: function (value) {
        var args = [].slice.call(arguments, 1);
        return args.length > 1 ?
            (args[value % 10 - 1] || args[args.length - 1]) :
                (args[0] + (value === 1 ? '' : 's'));
    },

    /**
     * A special filter that takes a handler function,
     * wraps it so it only gets triggered on specific
     * keypresses. v-on only.
     *
     * @param {String} key
     */
    key: function (handler, key) {
        if (!handler) return;
        var code = keyCodes[key];
        if (!code) {
            code = parseInt(key, 10);
        }
        return function (e) {
            if (e.keyCode === code) {
                return handler.call(this, e);
            }
        };
    },

    turnback: function (s) {
        return s;
    }
}
