/*global Firebase*/
'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('MainCtrl', function ($scope) {
    var rootRef = new Firebase('https://torid-inferno-4604.firebaseio.com/');
    var childRef = rootRef.child('message');


    $scope.setMessage = function() {
      rootRef.child('message').set({
        user: 'Cyrus',
        text: 'lorem'
      });
    };

    $scope.updateMessage = function() {
      childRef.update({
        lastname: 'Bye'
      });
    };

    $scope.deleteMessage = function() {
      childRef.remove();
    };
  });
