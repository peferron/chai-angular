 /* jshint globalstrict: true */
 /* global beforeEach: true, describe: true, it: true */

'use strict';

var chai = require('chai');
chai.use(require('..'));
chai.should();

var expect = chai.expect;

function Resource() {
    this.$promise = {};
    this.$resolved = {};
}
Resource.prototype.$get = {};
Resource.prototype.$save = {};
Resource.prototype.$query = {};
Resource.prototype.$remove = {};
Resource.prototype.$delete = {};
Resource.prototype.toJSON = {};

function assertResourceEql(a, b) {
    if (a) {
        a.should.resourceEql(b);
        a.should.deep.resource.equal(b);
    }
    expect(a).to.resourceEql(b);
    expect(a).to.deep.resource.equal(b);
}

function assertNotResourceEql(a, b) {
    if (a) {
        a.should.not.resourceEql(b);
        a.should.not.deep.resource.equal(b);
    }
    expect(a).to.not.resourceEql(b);
    expect(a).to.not.deep.resource.equal(b);
}

describe('chai-angular', function() {
    var resource1, resource2;

    beforeEach(function() {
        resource1 = new Resource();
        resource1.a = 1;

        resource2 = new Resource();
        resource2.a = 2;
    });

    it('should not change the default equal', function() {
        ({a: 1}).should.not.equal({a: 1});
        [{a: 1}].should.not.equal([{a: 1}]);
    });

    it('should not change the default deep equal', function() {
        ({a: 1}).should.deep.equal({a: 1});
        ({a: 1}).should.not.deep.equal({a: 2});
        ({a: 1}).should.not.deep.equal({a: 1, b: 1});
        ({a: 1, b: 1}).should.not.deep.equal({a: 1});
        [{a: 1}].should.deep.equal([{a: 1}]);
        [{a: 1}].should.not.deep.equal([{a: 2}]);
        [{a: 1}].should.not.deep.equal([{a: 1, b: 1}]);
        [{a: 1, b: 1}].should.not.deep.equal([{a: 1}]);
        [{a: 1}, {b: 1}].should.not.deep.equal([{b: 1}, {a: 1}]);
        [{a: 1}, {b: 1}].should.deep.equal([{a: 1}, {b: 1}]);
    });

    describe('when the object is a plain object', function() {
        it('should not resourceEql a plain object with the same properties', function() {
            assertNotResourceEql(null, null);
            assertNotResourceEql(null, {});
            assertNotResourceEql({}, null);
            assertNotResourceEql({}, {});
            assertNotResourceEql({a: 1}, {a: 1});
        });

        it('should not resourceEql a plain object with different properties', function() {
            assertNotResourceEql({}, {a: 1});
            assertNotResourceEql({a: 1}, {});
            assertNotResourceEql({a: 1}, {a: 2});
            assertNotResourceEql({a: 1}, {b: 1});
            assertNotResourceEql({a: 1}, {a: 1, b: 1});
            assertNotResourceEql({a: 1, b: 1}, {a: 1});
        });
    });

    describe('when the object is a resource', function() {
        it('should resourceEql a plain object with the same properties', function() {
            assertResourceEql(new Resource(), {});
            assertResourceEql(resource1, {a: 1});
        });

        it('should not resourceEql a plain object with different properties', function() {
            assertNotResourceEql(new Resource(), null);
            assertNotResourceEql(new Resource(), {a: 1});
            assertNotResourceEql(resource1, {});
            assertNotResourceEql(resource1, {a: 2});
            assertNotResourceEql(resource1, {b: 1});
            assertNotResourceEql(resource1, {a: 1, b: 1});
        });
    });

    describe('when the object is an array of plain objects', function() {
        it('should not resourceEql an array of plain objects with the same properties', function() {
            assertNotResourceEql([null], [null]);
            assertNotResourceEql([null], [{}]);
            assertNotResourceEql([{}], [null]);
            assertNotResourceEql([{}], [{}]);
            assertNotResourceEql([{a: 1}], [{a: 1}]);
        });

        it('should not resourceEql an array of plain objects with different properties',
            function() {
            assertNotResourceEql([{}], [{a: 1}]);
            assertNotResourceEql([{a: 1}], [{}]);
            assertNotResourceEql([{a: 1}], [{a: 2}]);
            assertNotResourceEql([{a: 1}], [{b: 1}]);
            assertNotResourceEql([{a: 1}], [{a: 1, b: 1}]);
            assertNotResourceEql([{a: 1, b: 1}], [{a: 1}]);
            assertNotResourceEql([{a: 1}, {b: 1}], [{a: 1}, {b: 2}]);
            assertNotResourceEql([{a: 1}, {b: 1}], [{a: 2}, {b: 1}]);
        });
    });

    describe('when the object is an array of resources', function() {
        it('should resourceEql an array of plain objects with the same properties', function() {
            assertResourceEql([new Resource()], [{}]);
            assertResourceEql([resource1], [{a: 1}]);
            assertResourceEql([resource1, resource2], [{a: 1}, {a: 2}]);
        });

        it('should not resourceEql an array of different length', function() {
            assertNotResourceEql([resource1], [{a: 1}, {}]);
            assertNotResourceEql([resource1, resource2], [{a: 1}, {a: 2}, {}]);
        });

        it('should not resourceEql an array of plain objects with different properties',
            function() {
            assertNotResourceEql([new Resource()], [null]);
            assertNotResourceEql([new Resource()], [{a: 1}]);
            assertNotResourceEql([resource1], [{}]);
            assertNotResourceEql([resource1], [{a: 2}]);
            assertNotResourceEql([resource1], [{b: 1}]);
            assertNotResourceEql([resource1], [{a: 1, b: 1}]);
            assertNotResourceEql([resource1, resource2], [{a: 1}, {b: 1}]);
            assertNotResourceEql([resource1, resource2], [{b: 1}, {a: 2}]);
            assertNotResourceEql([resource1, resource2], [{a: 2}, {a: 1}]);
        });
    });

});
