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
        $scope.messages.push(addedChild);
    });

    $scope.sendMessage = function() {
      var newMessage = {
        user: $scope.currentUser,
        text: $scope.currentText
      };

      // MessageService.add(newMessage);
      // REFACTORED
      var promise = MessageService.add(newMessage);
      promise.then(function(data) {
        // REFACTORED from using data.name()
        console.log(data.key());
      });
    };

    $scope.turnFeedOff = function() {
      // per single connection, turn feed off
      MessageService.off();
    };

    // $scope.pageNext = function() {
    //   var lastItem = $scope.messages[$scope.messages.length - 1];
    //   // then because of promise return
    //   MessageService.pageNext(lastItem.name, 10).then(function(messages) {
    //     $scope.messages = messages;
    //   });
    // };
    //
    // $scope.pageBack = function() {
    //   var firstItem = $scope.message[0];
    //   MessageService.pageBack(firstItem.name, 10).then(function(messages) {
    //     $scope.messages = messages;
    //   });
    // };
    $scope.pageNext = function() {
      var lastItem = $scope.messages[$scope.messages.length - 1];
      MessageService.pageNext(lastItem.name, 10).then(function(messages) {
        $scope.messages = messages;
      });
    };

    $scope.pageBack = function() {
      var firstItem = $scope.messages[0];
      MessageService.pageBack(firstItem.name, 10).then(function(messages) {
        $scope.messages = messages;
      });
    };

  });
