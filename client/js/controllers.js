'use strict'

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

/*autoPrivilegeApp.controller('ContactCtrl', function ($scope) {
 $scope.map = {center: {latitude: 45, longitude: -73}, zoom: 8};
 });*/

autoPrivilegeApp.controller('AutoPrivilegeCtrl', function ($rootScope, $scope, $q, $filter, $window, autoPrivilegeFactory, ngTableParams) {
    $scope.cars = [];
    $scope.isEditable = [];
// get all Cars on Load
    autoPrivilegeFactory.getCars().then(function (data) {

        //$scope.cars = data.data;
        var data = data.data;
        $scope.cars = data.data;

        $scope.$watch("filter.$", function () {
            $scope.tableParams.reload();
        });

        $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                filter: {
                    Marque: ''       // initial filter
                },
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, /*{
             total: data.length, // length of data
             getData: function ($defer, params) {
             // use build-in angular filter
             var orderedData = params.filter() ?
             $filter('filter')(data, params.filter()) :
             data;

             $scope.cars = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

             params.total(orderedData.length); // set total for recalc pagination
             $defer.resolve($scope.cars);
             }
             });*/
            {
                total: data.length, // length of data

                getData: function ($defer, params) {
                    var filteredData = $filter('filter')(data, $scope.filter);
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        filteredData;
                    params.total(orderedData.length); // set total for recalc pagination

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                },
                $scope: $scope
            });
    });
// Show Car detail
    $scope.showCarDetail = function (_id) {
        $window.location = "#/carDetails/" + _id;
    };

// Save a Car to the server
    $scope.save = function ($event) {
        if ($event.which == 13 && $scope.carInput) {
            autoPrivilegeFactory.saveCars({
                "car": $scope.carInput,
                "isCompleted": false
            }).then(function (data) {
                $scope.cars.push(data.data);
            });
            $scope.carInput = '';
        }
    };
//update the status of the Car
    $scope.updateStatus = function ($event, _id, i) {
        var cbk = $event.target.checked;
        var _t = $scope.cars[i];
        autoPrivilegeFactory.updateCars({
            _id: _id,
            isCompleted: cbk,
            car: _t.car
        }).then(function (data) {
            if (data.data.updatedExisting) {
                _t.isCompleted = cbk;
            } else {
                alert('Oops something went wrong!');
            }
        });
    };
// Update the edited Car
    $scope.edit = function ($event, i) {
        if ($event.which == 13 && $event.target.value.trim()) {
            var _t = $scope.cars[i];
            autoPrivilegeFactory.updateCars({
                _id: _t._id,
                car: $event.target.value.trim(),
                isCompleted: _t.isCompleted
            }).then(function (data) {
                if (data.data.updatedExisting) {
                    _t.car = $event.target.value.trim();
                    $scope.isEditable[i] = false;
                } else {
                    alert('Oops something went wrong!');
                }
            });
        }
    };
// Delete a Car
    $scope.delete = function (i) {
        autoPrivilegeFactory.deleteCars($scope.cars[i]._id).then(function (data) {
            if (data.data) {
                $scope.cars.splice(i, 1);
            }
        });
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
                {src: 'images/img09.jpg', desc: 'Image 10'},
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
autoPrivilegeApp.controller('ContactCtrl', function ($scope, $http) {

    $scope.map = { center: { latitude: 47.300014, longitude: -1.750570 }, zoom: 14 };
    $scope.options = {scrollwheel: false};

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 47.300014,
            longitude: -1.750570
        },
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker dragend');
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lon);

                $scope.marker.options = {
                    animation:1,
                    draggable: true,
                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

   // $scope.marker: {"id":1,"latitude":47.300014,"longitude":-1.750570,"showWindow":true,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels"}}

    $scope.result = 'hidden'
    $scope.resultMessage;
    $scope.formData; //formData is an object holding the name, email, subject, and message
    $scope.submitButtonDisabled = false;
    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
    $scope.submit = function (contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
            $http({
                method: 'POST',
                url: '/partials/contact-form.php',
                data: $.param($scope.formData),  //param method from jQuery
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  //set the headers so angular passing info as form data (not request payload)
            }).success(function (data) {
                console.log(data);
                if (data.success) { //success comes from the return json object
                    $scope.submitButtonDisabled = true;
                    $scope.resultMessage = data.message;
                    $scope.result = 'bg-success';
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.resultMessage = data.message;
                    $scope.result = 'bg-danger';
                }
            });
        } else {
            $scope.submitButtonDisabled = false;
            $scope.resultMessage = 'Failed :( Please fill out all the fields.';
            $scope.result = 'bg-danger';
        }
    }
});