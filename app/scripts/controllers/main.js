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
    var messagesRef = rootRef.child('messages');

    $scope.currentUser = null;
    $scope.currentText = null;
    $scope.messages = [];

/******************LEGACY*************CODE****************11/19/14***********/
    // messagesRef.on('value', function(snapshot) {
    //   $timeout(function () {
    //     // iterate through snapshot, picture of the database in real time
    //     // snapshot.forEach(function(item) {
    //     //   console.log(item.name() + ' - ' + item.val());
    //     //   console.log(item.ref());
    //     // });
    //     var snapshotVal = snapshot.val();
    //     console.log(snapshotVal);
    //     $scope.messages = snapshotVal;
    //   });
    // });
    //
    // $scope.$watch('messages.text', function(newVal) {
    //   if (!newVal) {
    //     return;
    //   }
    //   messagesRef.update({
    //     text: newVal
    //   });
    // });
    //
    // $scope.setMessage = function() {
    //   rootRef.child('messages').set({
    //     user: 'Erin',
    //     text: 'Hiiii!!!!'
    //   });
    // };
    //
    // $scope.updateMessage = function() {
    //   messagesRef.update({
    //     text: 'I love my hubby'
    //   });
    // };
    //
    // $scope.deleteMessage = function() {
    //   messagesRef.remove();
    // };
/***************************************************************************/

    messagesRef.on('child_added', function(snapshot) {
      $timeout(function() {
        var snapshotVal = snapshot.val();
        console.log(snapshotVal);
        $scope.messages.push({
          text: snapshotVal.text,
          user: snapshotVal.user,
          name: snapshot.name()
        });
      });
    });

    messagesRef.on('child_changed', function(snapshot) {
      $timeout(function() {
        var snapshotVal = snapshot.val();
        var message = findMessageByName(snapshot.name());
        console.log(message);
        message.text = snapshotVal.text;
      });
    });

    messagesRef.on('child_removed', function(snapshot) {
      $timeout(function() {
        deleteMessageByName(snapshot.name());
      });
    });

    function deleteMessageByName(name) {
      for(var i=0; i < $scope.messages.length; i++) {
        var currentMessage = $scope.messages[i];
        if (currentMessage.name === name) {
          // splice current item off array
          $scope.messages.splice(i, 1);
          break;
        }
      }
    }

    function findMessageByName(name) {
      var messageFound = null;
      for(var i=0; i < $scope.messages.length; i++) {
        var currentMessage = $scope.messages[i];
        if (currentMessage.name === name) {
          messageFound = currentMessage;
          break;
        }
      }

      return messageFound;
    }

    $scope.sendMessage = function () {
      var newMessage = {
        user: $scope.currentUser,
        text: $scope.currentText
      };

      //push to messages node
      messagesRef.push(newMessage);
    };
  });
