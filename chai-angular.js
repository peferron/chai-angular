/* global define: false, chai: false */

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

    // TDD style asserts
    var assert = chai.assert;

    assert.resourceEqual = function (val, exp, msg) {
        new chai.Assertion(val, msg).to.deep.resource.equal(exp);
    };

    assert.notResourceEqual = function (val, exp, msg) {
        new chai.Assertion(val, msg).to.not.deep.resource.equal(exp);
    };

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

        if (typeof obj === 'object') {
            return objectResourceEql(obj, expected);
        }

        return _.eql(obj, expected);
    }

    function arrayResourceEql(obj, expected) {
        return Array.isArray(expected) && obj.length === expected.length &&
            obj.every(function(item, i) {
                return resourceEql(item, expected[i]);
            });
    }

    function objectResourceEql(obj, expected) {
        if (!obj || !expected) {
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

        return objKeys.length === expectedKeys.length && objKeys.every(function(key) {
            return _.eql(obj[key], expected[key]);
        });
    }
});
