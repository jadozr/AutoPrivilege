autoPrivilegeApp.factory('autoPrivilegeFactory', function ($http) {
    var urlBase = '/api/cars';
    var _autoPrivilegeService = {};
    _autoPrivilegeService.getCars = function () {
        return $http.get(urlBase);
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
});