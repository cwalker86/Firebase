'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  // injecting MessageService found in services/MessageService.js
  .controller('MainCtrl', function ($scope, $timeout, MessageService) {

    $scope.currentUser = null;
    $scope.currentText = null;
    $scope.messages = [];

    MessageService.childAdded(function(addedChild) {
      $timeout(function() {
        $scope.messages.push(addedChild);
      });
    });

    $scope.sendMessage = function () {
      var newMessage = {
        user: $scope.currentUser,
        text: $scope.currentText
      };

      MessageService.add(newMessage);
    };

    $scope.turnFeedOff = function () {
      // per single connection, turn feed off
      MessageService.off();
    };

  });
