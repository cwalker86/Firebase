/*global Firebase */
(function(angular) {
  'use strict';

  angular.module('firebaseApp').service('MessageService', function(MSGURL, $q, $firebase) {

    // constant definded in app.js
    var messageRef = new Firebase(MSGURL);

    // Angularfire power
    var fireMessage = $firebase(messageRef);

    // Angularfire as an array, to use the $add function for addMessage
    var fireList = fireMessage.$asArray();

    return {
      childAdded: function childAdded(cb) {
        messageRef.on('child_added', function(snapshot) {
          var val = snapshot.val();
          cb.call(this, {
            user: val.user,
            text: val.text,
            name: snapshot.key()
          });
        });
      },
      add: function addMessage(message) {
        // messageRef.push(message);
        // REFACTORED - returns unique key after pushed message as a promise
        return fireList.$add(message);
      },
      off: function turnMessagesOff() {
        messageRef.off();
      },
      pageNext: function pageNext(name, numberOfItems) {
        // need to create defer
        var deferred = $q.defer();
        var messages = [];
        var pageMessageRef = new Firebase(MSGURL).startAt(null, name).limitToFirst(numberOfItems);

        // messageRef.startAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
        //   // loop and return as snapshot
        //   snapshot.forEach(function(snapItem) {
        //     var itemVal = snapItem.val();
        //     // return name as a function
        //     itemVal.name = snapItem.name();
        //     // push item to messages array
        //     messages.push(itemVal);
        //   });
        //   // set up deferred
        //   deferred.resolve(messages);
        // });

        $firebase(pageMessageRef).$asArray().$loaded(function(data) {
          var keys = Object.keys(data);
          angular.forEach(keys, function(key) {
            var item = data[key];
            item.name = key;
            messages.push(item);
          });
          deferred.resolve(messages);
        });

        return deferred.promise;
      },
      pageBack: function pageBack(name, numberOfItems) {
        var deferred = $q.defer();
        var messages = [];

        // // refactor this into a shared function later
        // messageRef.endAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
        //   // loop and return as snapshot
        //   snapshot.forEach(function(snapItem) {
        //     var itemVal = snapItem.val();
        //     // return name as a function
        //     itemVal.name = snapItem.name();
        //     // push item to messages array
        //     messages.push(itemVal);
        //   });
        //   // set up deferred
        //   deferred.resolve(messages);
        // });

          var pageMessageRef = new Firebase(MSGURL).endAt(null, name).limit(numberOfItems);

          $firebase(pageMessageRef).$on('loaded', function(data) {
            var keys = Object.keys(data);
            angular.forEach(keys, function(key) {
              var item = data[key];
              item.name = key;
              messages.push(item);
            });
            deferred.resolve(messages);
          });

        return deferred.promise;
      }
    };
  });

})(window.angular);
