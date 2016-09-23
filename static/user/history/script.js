(function(){

    var myApp = angular.module('myApp', []);


    myApp.controller('messages', function($scope, $http) {

        var token;

        $http.get('/user/messages').then(function(res) {

            token = res.data.token;

            $scope.mess = res.data.data;

        });

        $scope.deletebutton = function (id) {
            console.log(token);
            $http.delete('/message/' + id, {headers: {'csrf-token': token}}).then(function() {
                console.log(id);

                //$http.get('/user/messages').then(function(res) {

                //i should use $scope.mess.filter to show messages whihch id is not equal to this where button was clicked
                $scope.mess = $scope.mess.filter(function(item) {
                    if (item.id == id) {
                        return false;
                    }
                    return true;
                })

                //});

            }).catch(function(err) {
                console.log(err);
            });

        }
    });
}())
