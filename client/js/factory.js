'use strict';
 autoPrivilegeApp.factory('autoPrivilegeFactory', ['$http', function ($http) {
    var urlBase = '/api/cars',
        urlMail = '/api/postEmail';
    var _autoPrivilegeService = {};
    _autoPrivilegeService.getCars = function () {
        return $http.get(urlBase);
    };

    _autoPrivilegeService.postEmail = function (mail) {
        return $http.post(urlMail, mail);
    };

    _autoPrivilegeService.saveCars = function (cars) {
        return $http.post(urlBase, cars);
    };
    _autoPrivilegeService.updateCars = function (cars) {
        return $http.put(urlBase, cars);
    };
    _autoPrivilegeService.deleteCars = function (id) {
        return $http.delete(urlBase + '/' + id);
    };
    _autoPrivilegeService.getCarDetails = function (id) {
        return $http.get(urlBase + '/' + id);
    };
    return _autoPrivilegeService;
}]);