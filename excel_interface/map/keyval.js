/* eslint-disable */
// @ts-nocheck
System.register([], function (exports_1, context_1) {
    "use strict";
    var idbKeyval;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            idbKeyval = function (e) {
                "use strict";
                var t = /** @class */ (function () {
                    function t(e, t) {
                        if (e === void 0) { e = "keyval-store"; }
                        if (t === void 0) { t = "keyval"; }
                        this.storeName = t, this._dbp = new Promise(function (r, n) { var o = indexedDB.open(e, 1); o.onerror = (function () { return n(o.error); }), o.onsuccess = (function () { return r(o.result); }), o.onupgradeneeded = (function () { o.result.createObjectStore(t); }); });
                    }
                    t.prototype._withIDBStore = function (e, t) {
                        var _this = this;
                        return this._dbp.then(function (r) { return new Promise(function (n, o) { var s = r.transaction(_this.storeName, e); s.oncomplete = (function () { return n(); }), s.onabort = s.onerror = (function () { return o(s.error); }), t(s.objectStore(_this.storeName)); }); });
                    };
                    return t;
                }());
                var r;
                function n() { return r || (r = new t), r; }
                return e.Store = t, e.get = function (e, t) {
                    if (t === void 0) { t = n(); }
                    var r;
                    return t._withIDBStore("readonly", function (t) { r = t.get(e); }).then(function () { return r.result; });
                }, e.set = function (e, t, r) {
                    if (r === void 0) { r = n(); }
                    return r._withIDBStore("readwrite", function (r) { r.put(t, e); });
                }, e.del = function (e, t) {
                    if (t === void 0) { t = n(); }
                    return t._withIDBStore("readwrite", function (t) { t.delete(e); });
                }, e.clear = function (e) {
                    if (e === void 0) { e = n(); }
                    return e._withIDBStore("readwrite", function (e) { e.clear(); });
                }, e.keys = function (e) {
                    if (e === void 0) { e = n(); }
                    var t = [];
                    return e._withIDBStore("readonly", function (e) { (e.openKeyCursor || e.openCursor).call(e).onsuccess = function () { this.result && (t.push(this.result.key), this.result.continue()); }; }).then(function () { return t; });
                }, e;
            }({});
            exports_1("default", idbKeyval);
        }
    };
});
