# chai-angular [![Build Status](https://travis-ci.org/peferron/chai-angular.svg?branch=master)](https://travis-ci.org/peferron/chai-angular) [![Coverage Status](https://coveralls.io/repos/peferron/chai-angular/badge.png?branch=master)](https://coveralls.io/r/peferron/chai-angular?branch=master)

chai-angular is a collection of small utilities that help testing [Angular](https://angularjs.org/) apps with [Chai](http://chaijs.com/).

Calling it a collection is a strong word, since it only contains one utility. Hopefully it will stay that way — the more things work out of the box between Angular and Chai, the better!

## resourceEql

resourceEql compares Angular [resources](https://docs.angularjs.org/api/ngResource/service/$resource) with plain objects.

Let's say the Angular controller `mycontroller` contains this code:

```javascript
var User = $resource('/user/:id');
$scope.user = User.get({id: 9});
```

A typical test for this controller would be:

```javascript
var $scope = {};

$httpBackend.expectGET('/user/9').respond({id: '9', name: 'Roger Zelazny'});
$controller('mycontroller', {$scope: $scope});
$httpBackend.flush();

$scope.user.should.deep.equal({id: '9', name: 'Roger Zelazny'});
```

However, this test fails because `$scope.user` is not a plain old Javascript object, but an Angular resource, and Chai's deep equality sees them as different.

To make the test pass, install the chai-angular plugin, then replace `deep.equal` with `deep.resource.equal`:

```javascript
$scope.user.should.deep.resource.equal({id: '9', name: 'Roger Zelazny'});
```

The usual Chai syntactic variants are also available:

```javascript
$scope.user.should.resourceEql({id: '9', name: 'Roger Zelazny'});
expect($scope.user).to.deep.resource.equal({id: '9', name: 'Roger Zelazny'});
expect($scope.user).to.resourceEql({id: '9', name: 'Roger Zelazny'});
```

## Installation

```shell
$ npm install chai-angular --save-dev
```

## Usage with [Karma](http://karma-runner.github.io)

In `karma.conf.js`, add to `files` the path to `chai-angular.js`:

```javascript
module.exports = function(config) {
    config.set({
        basePath : '../',
        files : [
            'node_modules/chai-angular/chai-angular.js',
            ...
        ],
        ...
    });
};
```

You can then immediately start using chai-angular assertions in your tests.
