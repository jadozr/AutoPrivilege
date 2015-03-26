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


autoPrivilegeApp.controller('AutoPrivilegeCtrl', function ($scope, $q, $filter, $window, autoPrivilegeFactory, ngTableParams) {

    var data = [{brand: 'Moroni', model: 50},
        {brand: 'Tiancum', model: 43},
        {brand: 'Jacob', model: 27},
        {brand: 'Nephi', model: 29},
        {brand: 'Enos', model: 14},
        {brand: 'Tiancum', model: 43},
        {brand: 'Jacob', model: 27},
        {brand: 'Nephi', model: 29},
        {brand: 'Enos', model: 59},
        {brand: 'Tiancum', model: 43},
        {brand: 'Jacob', model: 27},
        {brand: 'Nephi', model: 29},
        {brand: 'Enos', model: 43},
        {brand: 'Tiancum', model: 43},
        {brand: 'Jacob', model: 27},
        {brand: 'Nephi', model: 29},
        {brand: 'Enos', model: 34}];

    var qDocs = $q.defer();
    qDocs.resolve(autoPrivilegeFactory.getCars());

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        //total: data.length, // length of data
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
    $scope.brands = function (column) {
        var def = $q.defer(),
            arr = [],
            brands = [];
        qDocs.promise.then(function (result) {
            angular.forEach(result.data, function (item) {
                if (inArray(item.brand, arr) === -1) {
                    arr.push(item.brand);
                    brands.push({
                        'id': item.brand,
                        'title': item.brand
                    });
                }
            });
        });

        $scope.brandOptions = brands;

        def.resolve(brands);
        return def;
    };


    $scope.models = function (column, brand) {
        console.log('brand:', brand);

        var def = $q.defer(),
            arr = [],
            models = [];
        qDocs.promise.then(function (result) {
            angular.forEach(result.data, function (item) {
                if (inArray(item.model, arr) === -1) {
                    if (angular.isUndefined(brand) || item.brand === brand) {
                        arr.push(item.model);
                        models.push({
                            'id': item.model,
                            'title': item.model
                        });
                    }
                }
            });
        });
        $scope.modelOptions = models;

        def.resolve(models);
        return def;
    };

    /*  var data = [{Marque: 'Moroni', Famille: 50},
     {Marque: 'Tiancum', Famille: 43},
     {Marque: 'Jacob', Famille: 27},
     {Marque: 'Nephi', Famille: 29},
     {Marque: 'Enos', Famille: 14},
     {Marque: 'Tiancum', Famille: 43},
     {Marque: 'Jacob', Famille: 27},
     {Marque: 'Nephi', Famille: 29},
     {Marque: 'Enos', Famille: 59},
     {Marque: 'Tiancum', Famille: 43},
     {Marque: 'Jacob', Famille: 27},
     {Marque: 'Nephi', Famille: 29},
     {Marque: 'Enos', Famille: 43},
     {Marque: 'Tiancum', Famille: 43},
     {Marque: 'Jacob', Famille: 27},
     {Marque: 'Nephi', Famille: 29},
     {Marque: 'Enos', Famille: 34}];


     var qDocs = $q.defer();
     $scope.changed = false;

     qDocs.resolve(autoPrivilegeFactory.getCars());
     */
    /* $scope.tableParams = new NgTableParams({
     page: 1,            // show first page
     count: 10
     },
     {
     total: qDocs.length, // length of data

     getData: function ($defer, params) {
     qDocs.promise.then(function (result) {
     var documents = result.data;
     $scope.data = result.data;
     $scope.maxlength = result.data.length;
     //filtering
     var orderedData = params.filter() ?
     $filter('filter')(documents, params.filter()) :
     documents;
     $scope.orderedData = orderedData;
     //sorting
     orderedData = params.sorting() ?
     $filter('orderBy')(orderedData, params.orderBy()) :
     orderedData;
     //pagination
     $scope.documents = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
     params.total(orderedData.length);
     $defer.resolve($scope.documents);
     $scope.changed = !$scope.changed;
     });
     }
     });*/
    /*

     $scope.tableParams = new NgTableParams({
     page: 1,            // show first page
     count: 10           // count per page
     }, {
     //total: qDocs.length, // length of data
     total: data.length,
     getData: function ($defer, params) {
     //   qDocs.promise.then(function (result) {
     // use build-in angular filter
     var orderedData = params.sorting ?
     $filter('orderBy')(data, params.orderBy()) :
     data;
     orderedData = params.filter ?
     $filter('filter')(orderedData, params.filter()) :
     orderedData;

     $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

     params.total(orderedData.length); // set total for recalc pagination
     $defer.resolve($scope.users);
     //    });
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
     //   qDocs.promise.then(function (result) {
     angular.forEach(data, function (item) {
     if (inArray(item.Marque, arr) === -1) {
     arr.push(item.Marque);
     names.push({
     'id': item.Marque,
     'title': item.Marque
     });
     }
     });

     $scope.nameOptions = names;

     def.resolve(names);
     return def;
     //  });
     };


     $scope.ages = function (column, name) {
     console.log('name:', name);

     var def = $q.defer(),
     arr = [],
     ages = [];
     // qDocs.promise.then(function (result) {
     angular.forEach(data, function (item) {
     if (inArray(item.age, arr) === -1) {
     if (angular.isUndefined(name) || item.name === name) {
     arr.push(item.Famille);
     ages.push({
     'id': item.Famille,
     'title': item.Famille
     });
     }
     }
     //    });

     $scope.ageOptions = ages;

     def.resolve(ages);
     return def;
     });
     };*/

    /*$scope.docNames = function (column) {
     var def = $q.defer(),
     arr = [],
     docNames = [];
     qDocs.promise.then(function (result) {
     angular.forEach(result.data, function (item) {
     if (inArray(item.Marque, arr) === -1) {
     arr.push(item.Marque);
     docNames.push({
     'id': item.Marque,
     'title': item.Marque
     });
     }
     });
     });
     def.resolve(docNames);
     return def;
     };
     */

    /*    $scope.docFamilles = function () {
     var def = $q.defer(),
     arr = [],
     docFamilles = [];
     // $scope.documents = '';
     $scope.$watch('changed', function () {
     if (typeof $scope.orderedData !== 'undefined' && $scope.orderedData.length < $scope.maxlength) {
     docFamilles.splice(1, docFamilles.length);
     angular.forEach($scope.orderedData, function (item) {
     if (inArray(item.Famille, arr) === -1) {
     arr.push(item.Famille);
     docFamilles.push({
     'id': item.Famille,
     'title': item.Famille
     });
     }
     });
     }
     }, true);
     def.resolve(docFamilles);
     return def;
     };*/

    /*    var inArray = Array.prototype.indexOf ?
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
     };*/


// Show Car detail
    $scope.showCarDetail = function (_id) {
        $window.location = '#/carDetails/' + _id;
    };
});


autoPrivilegeApp.controller('CarDetailsCtrl', function ($scope, $routeParams, $window, autoPrivilegeFactory) {
    autoPrivilegeFactory.getCarDetails($routeParams.id).then(function (data) {
        if (data) {
            $scope.carDetails = data;
            // Set of Photos
            $scope.photos = [
                {src: 'images/img00.jpg', desc: 'Image 01'},
                {src: 'images/img01.jpg', desc: 'Image 02'},
                {src: 'images/img02.jpg', desc: 'Image 03'},
                {src: 'images/img03.jpg', desc: 'Image 04'},
                {src: 'images/img04.jpg', desc: 'Image 05'},
                {src: 'images/img05.jpg', desc: 'Image 06'},
                {src: 'images/img06.jpg', desc: 'Image 07'},
                {src: 'images/img07.jpg', desc: 'Image 08'},
                {src: 'images/img08.jpg', desc: 'Image 09'},
                {src: 'images/img09.jpg', desc: 'Image 10'}
            ];

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

        }
    });
});
autoPrivilegeApp.controller('ContactCtrl', function ($scope) {

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
});