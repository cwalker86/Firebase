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
  .controller('MainCtrl', function ($scope, $timeout) {
    var rootRef = new Firebase('https://torid-inferno-4604.firebaseio.com/');
    var childRef = rootRef.child('message');

    childRef.on('value', function(snapshot) {
      $timeout(function () {
        //iterate through snapshot, picture of the database in real time
        snapshot.forEach(function(item) {
          console.log(item.key() + ' - ' + item.val());
          console.log(item.ref());
        });
        var snapshotVal = snapshot.val();
        $scope.message = snapshotVal;
      });
    });

    $scope.$watch('message.text', function(newVal) {
      if (!newVal) {
        return;
      }
      childRef.update({
        text: newVal
      });
    });

    $scope.setMessage = function() {
      rootRef.child('message').set({
        user: 'Cyrus',
        text: 'Lorem up......'
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
