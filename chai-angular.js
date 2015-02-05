/* global define: true, chai: true */

(function (chaiModule) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' &&
        typeof module === 'object') {
        // Node.js.
        module.exports = chaiModule;
    } else if (typeof define === 'function' && define.amd) {
        // AMD.
        define(function () { return chaiModule; });
    } else {
        // Other.
        if (!chai) {
            throw new Error('Chai cannot be found in current scope.');
        }
        chai.use(chaiModule);
    }
})(function(chai, _) {
    'use strict';

    var resourceOwnProperties = {
        $promise: true,
        $resolved: true
    };

    chai.Assertion.addChainableMethod('resource', null, function() {
        _.flag(this, 'resource', true);
    });

    chai.Assertion.overwriteMethod('equal', function (_super) {
        return function() {
            if (_.flag(this, 'resource') && _.flag(this, 'deep')) {
                return assertResourceEql.apply(this, arguments);
            }
            return _super.apply(this, arguments);
        };
    });

    chai.Assertion.addMethod('resourceEql', assertResourceEql);

    function assertResourceEql(expected) {
        /* jshint validthis: true */
        var obj = this._obj;
        this.assert(
            resourceEql(obj, expected),
            'expected #{this} to be a resource and deeply equal #{exp}, but was #{act}',
            'expected #{this} to be a resource and not deeply equal #{exp}, but was #{act}',
            expected,
            obj
        );
    }

    function resourceEql(obj, expected) {
        if (Array.isArray(obj)) {
            return arrayResourceEql(obj, expected);
        }
        return objectResourceEql(obj, expected);
    }

    function arrayResourceEql(obj, expected) {
        return Array.isArray(expected) &&
            obj.length === expected.length &&
            obj.every(function(item, i) {
                return resourceEql(item, expected[i]);
            });
    }

    function objectResourceEql(obj, expected) {
        if (!obj || !obj.constructor || obj.constructor.name !== 'Resource' || !expected) {
            return false;
        }

        var objKeys, expectedKeys;
        try {
            objKeys = Object.keys(obj).filter(function(key) {
                return !resourceOwnProperties[key];
            });
            expectedKeys = Object.keys(expected);
        } catch (e) {
            return false;
        }

        if (objKeys.length !== expectedKeys.length) {
            return false;
        }

        objKeys.sort();
        expectedKeys.sort();

        return objKeys.every(function(key, i) {
            return expectedKeys[i] === key && _.eql(obj[key], expected[key]);
        });
    }
});
