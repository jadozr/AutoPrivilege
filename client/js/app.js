autoPrivilegeApp = angular.module('autoPrivilege', ['ngRoute', 'uiGmapgoogle-maps', 'ngTable', 'ngAnimate', 'ngTouch'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/cars.html',
                controller: 'AutoPrivilegeCtrl'
            }).when('/contact', {
                templateUrl: '/partials/contact.html',
                controller: 'ContactCtrl'
            }).when('/services', {
                templateUrl: '/partials/services.html',
                controller: 'AutoPrivilegeCtrl'
            }).when('/carDetails/:id', {
                templateUrl: '/partials/carDetails.html',
                controller: 'CarDetailsCtrl'
            }).otherwise({
                redirectTo: '/'
            });
    });