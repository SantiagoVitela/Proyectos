'use strict';

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function (owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function () {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf = function (find, i /*opt*/) {
        if (i === undefined) i = this.length - 1;
        if (i < 0) i += this.length;
        if (i > this.length - 1) i = this.length - 1;
        for (i++; i-- > 0; ) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map = function (mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                other[i] = mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter = function (filter, that /*opt*/) {
        var other = [], v;
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && filter.call(that, v = this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
if (!('firstOrDefault' in Array.prototype)) {
    Array.prototype.firstOrDefault = function (fn) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (fn(this[i])) {
                return this[i];
            }
        }

        return null;
    };
}
if (!('find' in Array.prototype)) {
    Array.prototype.find = function (fn) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (fn(this[i])) {
                return this[i];
            }
        }

        return null;
    };
}
if (!('where' in Array.prototype)) {
    Array.prototype.where = function (fn) {
        var lista = new Array();
        for (var i = 0, n = this.length; i < n; i++) {
            if (fn(this[i])) {
                lista.push(this[i]);
            }
        }

        return lista;
    };
}
if (!('sum' in Array.prototype)) {
    Array.prototype.sum = function (fn) {
        var sum = 0;
        for (var i = 0, n = this.length; i < n; i++) {
            sum += fn(this[i]);
        }

        return sum;
    };
}
if (!('select' in Array.prototype)) {
    Array.prototype.select = function (fn) {

        if (fn == undefined) {
            return this;
        }

        var ot = [];
        for (var i = 0, n = this.length; i < n; i++) {
            ot.push(fn(this[i]));
        }

        return ot;
    };
}
if (!('distinct' in Array.prototype)) {
    Array.prototype.distinct = function (fn) {
        var ot = [];

        var aux = this.select(fn);

        for (var i = 0, n = aux.length; i < n; i++) {
            var el = aux[i];

            if (ot.firstOrDefault(function (e) { return e == el; }) == null) {
                ot.push(el);
            }
        }

        return ot;
    }
}
