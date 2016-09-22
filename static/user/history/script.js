(function(){

    var myApp = angular.module('myApp', []);
    console.log('nara');

    myApp.controller('messages', function($scope, $http) {

        $http.get('/user/messages').then(function(res) {
            console.log(res.data);

            $scope.mess = res.data;
            
        });
    });
}())
