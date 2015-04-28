'use strict';
var autoPrivilegeApp;
autoPrivilegeApp.controller('NavbarCtrl', function NavbarController($scope, $location) {
    $scope.routeIs = function (routeName) {
        return $location.path() === routeName;
    };
});

autoPrivilegeApp.directive('back', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

autoPrivilegeApp.filter('unique', function () {
    return function (arr, field) {
        return _.uniq(arr, function (a) {
            return a[field];
        });
    };
});

autoPrivilegeApp.controller('AutoPrivilegeCtrl', function ($scope, $q, $filter, $window, autoPrivilegeFactory, NgTableParams) {

    $scope.getSrc = function (photos) {
        console.log(photos.split('|')[0]);
        return  photos.split('|')[0];
    };

    $scope.map = {center: {latitude: 47.300014, longitude: -1.750570}, zoom: 14};
    $scope.options = {scrollwheel: false};

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 47.300014,
            longitude: -1.750570
        },
        options: {draggable: true},
        events: {
            dragend: function (marker) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                $scope.marker = {
                    'id': 1,
                    'latitude': $scope.marker.coords.latitude,
                    'longitude': $scope.marker.coords.longitude,
                    animation: 1,
                    'showWindow': true
                };
                $scope.marker.options = {
                    animation: 1,
                    draggable: false,
                    labelContent: 'lat: ' + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: '100 0',
                    labelClass: 'marker-labels'
                };
            }
        }
    };


    /*
     var qDocs = $q.defer();
     qDocs.resolve(autoPrivilegeFactory.getCars());
     $scope.tableParams = new ngTableParams({
     page: 1,            // show first page
     count: 10           // count per page
     }, {
     total: qDocs.length, // length of data
     getData: function ($defer, params) {
     qDocs.promise.then(function (result) {
     // use build-in angular filter
     var orderedData = params.sorting ?
     $filter('orderBy')(result.data, params.orderBy()) :
     result.data;
     orderedData = params.filter ?
     $filter('filter')(orderedData, params.filter()) :
     orderedData;
     $scope.totalCars = result.data.length;

     $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
     params.total(orderedData.length); // set total for recalc pagination
     $defer.resolve($scope.users);
     });
     }
     });

     var inArray = Array.prototype.indexOf ?
     function (val, arr) {
     return arr.indexOf(val);
     } :
     function (val, arr) {
     var i = arr.length;
     while (i--) {
     if (arr[i] === val) {
     return i;
     }
     }
     return -1;
     };

     $scope.names = function (column) {
     var def = $q.defer(),
     arr = [],
     names = [];
     qDocs.promise.then(function (result) {
     angular.forEach(result.data, function (item) {
     if (inArray(item.Marque, arr) === -1) {
     arr.push(item.Marque);
     names.push({
     'id': item.Marque,
     'title': item.Marque
     });
     }
     });
     });
     def.resolve(names);
     return def;
     };
     $scope.ages = function (column) {
     var def = $q.defer(),
     arr = [],
     ages = [];
     qDocs.promise.then(function (result) {
     angular.forEach(result.data, function (item) {
     if (inArray(item.Famille, arr) === -1) {
     arr.push(item.Famille);
     ages.push({
     'id': item.Famille,
     'title': item.Famille
     });
     }
     });
     });
     def.resolve(ages);
     return def;
     };
     */
    var qDocs = $q.defer();
    qDocs.resolve(autoPrivilegeFactory.getCars());

    $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: qDocs.length, // length of data
        getData: function ($defer, params) {
            qDocs.promise.then(function (result) {
                // use build-in angular filter
                var orderedData = params.sorting ?
                    $filter('orderBy')(result.data, params.orderBy()) :
                    result.data;
                orderedData = params.filter ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;
                $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve($scope.users);
            });
        }
    });

    var inArray = Array.prototype.indexOf ?
        function (val, arr) {
            return arr.indexOf(val);
        } :
        function (val, arr) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return i;
                }
            }
            return -1;
        };
    $scope.names = function (column) {
        var def = $q.defer(),
            arr = [],
            names = [];
        qDocs.promise.then(function (result) {
            angular.forEach(result.data, function (item) {
                if (inArray(item.Marque, arr) === -1) {
                    arr.push(item.Marque);
                    names.push({
                        'id': item.Marque,
                        'title': item.Marque
                    });
                }
            });
        });
        def.resolve(names);
        return def;
    };

// Show Car detail
    $scope.showCarDetail = function (_id) {
        $window.location = '#/carDetails/' + _id;
    };
});


autoPrivilegeApp.controller('CarDetailsCtrl', function ($scope, $routeParams, autoPrivilegeFactory) {
    autoPrivilegeFactory.getCarDetails($routeParams.id).then(function (data) {
        if (data) {

            $scope.photos = [];
            var str = data.data.Photos;
            var res = str.split('|');
            angular.forEach(res, function (item) {
                var line =  {src: 'photos/'+item, desc: item};
                $scope.photos.push(line);
            });


            // initial image index
            $scope._Index = 0;

            // if a current image is the same as requested image
            $scope.isActive = function (index) {
                return $scope._Index === index;
            };

            // show prev image
            $scope.showPrev = function () {
                $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
            };

            // show next image
            $scope.showNext = function () {
                $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
            };

            // show a certain image
            $scope.showPhoto = function (index) {
                $scope._Index = index;
            };

            data.data.EquipementsSerieEtOption = data.data.EquipementsSerieEtOption.split('|');
            $scope.car = data.data;


        }
    });
});
autoPrivilegeApp.controller('ContactCtrl', function ($scope, autoPrivilegeFactory) {

    $scope.success = false;
    $scope.error = false;
    $scope.send = function () {
        var htmlBody = '<div>Name: ' + $scope.user.name + '</div>' +
            '<div>Email: ' + $scope.user.email + '</div>' +
            '<div>Message: ' + $scope.user.body + '</div>' +
            '<div>Date: ' + (new Date()).toString() + '</div>';

        autoPrivilegeFactory.postEmail({'htmlBody': htmlBody});
        //.
        /* success(function (data) {*/
        $scope.success = true;
        $scope.user = {};
        /* }).
         error(function (data) {
         $scope.error = true;
         });*/
    };
    $scope.close = function () {
        $scope.success = false;
    };
});