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

    // Just getting one item from firebase, instead of the entire collection
    // child_added -> when page initially loaded, go out and fetch all messages
    //             -> anytime a new child is added, only return the child of messages node
    messagesRef.on('child_added', function(snapshot) {
      $timeout(function() {
        var snapshotVal = snapshot.val();
        console.log(snapshotVal);
        // when this is called for each child, push onto messages, rather than assigning
        $scope.messages.push(snapshotVal);
      });
    });

    // messagesRef.on('value', function(snapshot) {
    //   $timeout(function() {
    //     var snapshotVal = snapshot.val();
    //     $scope.messages = snapshotVal;
    //   });
    // });

    $scope.sendMessage = function () {
      var newMessage = {
        user: $scope.currentUser,
        text: $scope.currentText
      };

      //push to messages node
      messagesRef.push(newMessage);
    };
  });
