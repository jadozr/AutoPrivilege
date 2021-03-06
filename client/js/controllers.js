'use strict';
var autoPrivilegeApp;
autoPrivilegeApp.controller('NavbarCtrl', function NavbarController($scope, $location) {
    $scope.routeIs = function (routeName) {
        return $location.path() === routeName;
    };
    if (screen.availHeight < 500 || screen.availWidth < 700) {
        alert('Notre site n\'est pas optimisé pour les smartphones et les tablettes\nl\'équipe d\'AutoPrivilège.');
    }
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


autoPrivilegeApp.directive('checkImage', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                $http.get(ngSrc).success(function () {
                }).error(function () {
                    element.attr('src', '../images/no_pic_available.png'); // set default image
                });
            });
        }
    };
});


autoPrivilegeApp.filter('unique', function () {
    return function (arr, field) {
        return _.uniq(arr, function (a) {
            return a[field];
        });
    };
});

autoPrivilegeApp.controller('AutoPrivilegeCtrl', function ($scope, $q, $filter, $window, $location, $anchorScroll, autoPrivilegeFactory, NgTableParams) {

    $scope.getSrc = function (photos) {
        if (photos) {
            return photos.split('|')[0];
        } else {
            return '../photos/noPic.png';
        }
    };

    $scope.map = {center: {latitude: 47.300014, longitude: -1.750570}, zoom: 14};
    $scope.options = {scrollwheel: false};
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 47.300014,
            longitude: -1.750570
        },
        options: {draggable: true, animation: 1},
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

    var qDocs = $q.defer();
    qDocs.resolve(autoPrivilegeFactory.getCars());

    $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 12           // count per page
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
                $scope.totalsCars = orderedData.length;
                if (orderedData.slice(0, 3).length === 1) {
                    $scope.colonne1 = true;
                } else {
                    $scope.colonne1 = false;
                }
                if (orderedData.slice(0, 3).length === 2) {
                    $scope.colonne2 = true;
                } else {
                    $scope.colonn2 = false;
                }
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

    $scope.scrollToAnchor = function (id) {
        $location.hash(id);
        $anchorScroll();
    };
});


autoPrivilegeApp.controller('CarDetailsCtrl', function ($scope, $routeParams, autoPrivilegeFactory) {
    autoPrivilegeFactory.getCarDetails($routeParams.id).then(function (data) {
        if (data) {

            $scope.photos = [];
            var str = data.data.Photos;
            if (str) {
                //Comes inside only if the data is not empty and not null
                var res = str.split('|');
                angular.forEach(res, function (item) {
                    var line = {src: 'photos/' + item, desc: item};
                    if ($scope.photos.length <= 10) {
                        $scope.photos.push(line);
                    }
                });
            } else {
                var line = {src: 'photos/noPic.png', desc: 'photos/noPic.png'};
                $scope.photos.push(line);
            }


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
            if (data.data.EquipementsSerieEtOption) {
                data.data.EquipementsSerieEtOption = data.data.EquipementsSerieEtOption.split('|');
            } else {
                data.data.EquipementsSerieEtOption = {0: 'Pas renseigné'};
            }
            $scope.car = data.data;

            var nomList = new Array('Nombre de portes', 'Puissance Fiscale', 'Boite de vitesse', 'Energie', 'Mise en circulation', 'Nombre de places', 'Couleur extérieure', 'Première main');
            if (data.data.PremiereMain === 'FAUX') {
                data.data.PremiereMain = 'Non';
            } else {
                data.data.PremiereMain = 'Oui';

            }
            var dataList = new Array(data.data.NbPortes, data.data.PuissanceFiscale, data.data.BoiteLibelle, data.data.EnergieLibelle, data.data.Date1Mec, data.data.NbPlaces, data.data.Couleur, data.data.PremiereMain);

            //create the objectArray
            $scope.infoList = [];
            for (var i = 0; i < nomList.length; i++) {
                $scope.infoList.push({
                    left: nomList[i],
                    middle: dataList[i]
                });
            }
            //create the objectArray
            $scope.objList = [];
            for (var k = 0; k < data.data.EquipementsSerieEtOption.length; k += 3) {
                $scope.objList.push({
                    left: data.data.EquipementsSerieEtOption[k],
                    middle: data.data.EquipementsSerieEtOption[k + 1],
                    right: data.data.EquipementsSerieEtOption[k + 2]
                });
            }

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

autoPrivilegeApp.controller('ChartCtrl', function ($scope) {
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Jour de la semaine'
            },
            yAxis: {
                axisLabel: 'Nombres de véhicules disponibles',
                axisLabelDistance: 30
            }
        }
    };

    $scope.data = [
        {
            key: 'Cumulative Return',

            values: [
                {
                    'label': 'Lun',
                    'value': 89
                },
                {
                    'label': 'Mar',
                    'value': 84
                },
                {
                    'label': 'Mer',
                    'value': 85
                },
                {
                    'label': 'Jeu',
                    'value': 84
                },
                {
                    'label': 'Ven',
                    'value': 87
                },
                {
                    'label': 'Sam',
                    'value': 85
                },
                {
                    'label': 'Dim',
                    'value': 85
                }
            ]
        }
    ];
});