'use strict';
var autoPrivilegeApp = angular.module('autoPrivilege', ['ngRoute', 'uiGmapgoogle-maps', 'ngTable', 'ngAnimate', 'ngTouch','nvd3'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/services.html',
                controller: 'AutoPrivilegeCtrl'
            }).when('/contact', {
                templateUrl: '/partials/contact.html',
                controller: 'ContactCtrl'
            }).when('/carDetails/:id', {
                templateUrl: '/partials/carDetails.html',
                controller: 'CarDetailsCtrl'
            }).when('/occasions', {
                templateUrl: '/partials/cars.html',
                controller: 'AutoPrivilegeCtrl'
            }).when('/charts', {
                templateUrl: '/partials/chart.html',
                controller: 'ChartCtrl'
            }).otherwise({
                redirectTo: '/'
            });
    });