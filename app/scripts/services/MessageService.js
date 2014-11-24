/*global Firebase */
(function(angular) {
  'use strict';

  angular.module('firebaseApp').service('MessageService', function(FBURL, $q, $firebase) {

    // constant definded in app.js
    var messageRef = new Firebase(FBURL).child('messages');

    // Angularfire power
    var fireMessage = $firebase(messageRef).$asArray();

    return {
      childAdded: function childAdded(limitNumber, cb) {
        // limit the amount given as the limit number
        // messageRef.startAt(null, '-JbHtNG-tibjQcTynY1S').endAt(null, '-JbHuUVpgsx42IWaLSXk').on('child_added', function(snapshot) {
        messageRef.on('child_added', function(snapshot) {
          var val = snapshot.val();

          cb.call(this, {
            user: val.user,
            text: val.text,
            name: snapshot.name()
          });
        });
      },
      add: function addMessage(message) {
        // messageRef.push(message);
        // REFACTORED - returns unique key after pushed message as a promise
        return fireMessage.$add(message);
      },
      off: function turnMessagesOff() {
        messageRef.off();
      },
      pageNext: function pageNext(name, numberOfItems) {
        // need to create defer
        var deferred = $q.defer();
        var messages = [];

        messageRef.startAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
          // loop and return as snapshot
          snapshot.forEach(function(snapItem) {
            var itemVal = snapItem.val();
            // return name as a function
            itemVal.name = snapItem.name();
            // push item to messages array
            messages.push(itemVal);
          });
          // set up deferred
          deferred.resolve(messages);
        });

        return deferred.promise;
      },
      pageBack: function pageBack() {
        var deferred = $q.defer();
        var messages = [];

        // refactor this into a shared function later
        messageRef.endAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
          // loop and return as snapshot
          snapshot.forEach(function(snapItem) {
            var itemVal = snapItem.val();
            // return name as a function
            itemVal.name = snapItem.name();
            // push item to messages array
            messages.push(itemVal);
          });
          // set up deferred
          deferred.resolve(messages);
        });

        return deferred.promise;
      }
    };
  });

})(window.angular);
