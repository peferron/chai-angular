 /* jshint globalstrict: true, browser: true */
 /* global beforeEach: false, afterEach: false, describe: false, it: false, angular: false */

'use strict';

global.document = require('jsdom').jsdom();
global.window = document.defaultView;
global.navigator = window.navigator = {};

window.mocha = {};
window.beforeEach = beforeEach;
window.afterEach = afterEach;

var chai = require('chai');
chai.use(require('..'));
chai.should();

var expect = chai.expect;
var assert = chai.assert;

require('angular/angular');
require('angular-mocks');
require('angular-resource');

global.angular = window.angular;

function assertResourceEql(a, b) {
    if (a) {
        a.should.resourceEql(b);
        a.should.deep.resource.equal(b);
    }
    expect(a).to.resourceEql(b);
    expect(a).to.deep.resource.equal(b);

    assert.resourceEqual(a, b);
}

function assertNotResourceEql(a, b) {
    if (a) {
        a.should.not.resourceEql(b);
        a.should.not.deep.resource.equal(b);
    }
    expect(a).to.not.resourceEql(b);
    expect(a).to.not.deep.resource.equal(b);

    assert.notResourceEqual(a, b);
}

describe('chai-angular', function() {
    var $httpBackend, $resource;
    var objEmpty, obj1, obj2, arrEmpty, arr1, arr2;

    beforeEach(angular.mock.module('ngResource'));

    beforeEach(angular.mock.inject(function(_$httpBackend_, _$resource_) {
        $httpBackend = _$httpBackend_;
        $resource = _$resource_;
    }));

    beforeEach(function() {
        $httpBackend.expectGET('/objEmpty').respond('{}');
        objEmpty = $resource('/objEmpty').get();

        $httpBackend.expectGET('/obj1').respond('{"a": 1}');
        obj1 = $resource('/obj1').get();

        $httpBackend.expectGET('/obj2').respond('{"a": 2}');
        obj2 = $resource('/obj2').get();

        $httpBackend.expectGET('/arrEmpty').respond('[]');
        arrEmpty = $resource('/arrEmpty', {}, {get: {isArray: true}}).get();

        $httpBackend.expectGET('/arr1').respond('[1, 2]');
        arr1 = $resource('/arr1', {}, {get: {isArray: true}}).get();

        $httpBackend.expectGET('/arr2').respond('[{"a": 1}, {"b": 2}]');
        arr2 = $resource('/arr2', {}, {get: {isArray: true}}).get();

        $httpBackend.flush();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
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

    describe('when the value is an object', function() {
        it('should resourceEql a plain object with the same properties', function() {
            assertResourceEql(objEmpty, {});
            assertResourceEql(obj1, {a: 1});
        });

        it('should not resourceEql a plain object with different properties', function() {
            assertNotResourceEql(objEmpty, null);
            assertNotResourceEql(objEmpty, {a: 1});
            assertNotResourceEql(obj1, {});
            assertNotResourceEql(obj1, {a: 2});
            assertNotResourceEql(obj1, {b: 1});
            assertNotResourceEql(obj1, {a: 1, b: 1});
        });
    });

    describe('when the value is an array of plain objects', function() {
        it('should resourceEql a plain array with the same contents', function() {
            assertResourceEql(arrEmpty, []);
            assertResourceEql(arr1, [1, 2]);
            assertResourceEql(arr2, [{a: 1}, {b: 2}]);
        });

        it('should not resourceEql a plain array with different contents', function() {
            assertNotResourceEql(arrEmpty, null);
            assertNotResourceEql(arrEmpty, [1, 2]);
            assertNotResourceEql(arr1, []);
            assertNotResourceEql(arr1, [1]);
            assertNotResourceEql(arr1, [2, 1]);
            assertNotResourceEql(arr1, [1, 2, 3]);
            assertNotResourceEql(arr2, [{a: 1}, {b: 1}]);
            assertNotResourceEql(arr2, [{b: 2}, {a: 1}]);
        });
    });

    describe('when the value is a plain array of resources', function() {
        it('should resourceEql an array with the same contents', function() {
            assertResourceEql([objEmpty], [{}]);
            assertResourceEql([arrEmpty], [[]]);
            assertResourceEql([obj1], [{a: 1}]);
            assertResourceEql([arr1], [[1, 2]]);
            assertResourceEql([obj1, obj2], [{a: 1}, {a: 2}]);
            assertResourceEql([arr1, arr2], [[1, 2], [{a: 1}, {b: 2}]]);
            assertResourceEql([obj1, arr1], [{a: 1}, [1, 2]]);
        });

        it('should not resourceEql an array with different contents', function() {
            assertNotResourceEql([obj1], [{a: 1}, {}]);
            assertNotResourceEql([arr1], [[1, 3]]);
            assertNotResourceEql([arr2], [[{a: 1}, {b: 1}]]);
            assertNotResourceEql([obj1, arr1], [{a: 1}, [1, 2], {}]);
            assertNotResourceEql([obj1, arr1], [{a: 2}, [1, 2]]);
            assertNotResourceEql([obj1, arr1], [{a: 1}, [2, 3]]);
        });
    });
});
