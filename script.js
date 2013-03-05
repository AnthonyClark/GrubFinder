var map;
var infowindow;
var markersArray = [];
// Global Variables
var GV = {
    mapInitComplete: false,
    savedAddress: "",
    savedPosition: {},
    placeForGrub: {},
    init_done: false,
    maxDistance: String(2000),
    markerImage: "images/ico1.png",
    directionsOptions: { suppressMarkers: true },
    travelMode: google.maps.TravelMode.DRIVING,
    infoWinfow: {}
}

// Global Services
var GS = {
    geocoder: {},
    placesService: {},
    directionsDisplay: {},
    directionsService: {}
}

// Page initialization
var PI = {

    onReady: function () {
        
        console.log("onReady");

        // Initialize Global Services
        GS.geocoder = new google.maps.Geocoder();
        GS.directionsService = new google.maps.DirectionsService();
        GS.directionsDisplay = new google.maps.DirectionsRenderer(GV.directionsOptions);

        GEO.getNavLoc(PI.initializeAutoComplete);
        $("#search-form").submit(PI.searchHandler);
    },

    searchHandler: function () {
        
        GV.savedAddress = $("#search").val();

        
        GEO.addrToLatLng(GV.savedAddress);
        

        $('#search-form').walkabout({ location: '#footer', animation: 'slide' }, function () { $(".content").center(); });
    },

    initializeAutoComplete: function () {

        var inputField = document.getElementById('search');
        var inputFieldOptions = {
            //types: ['(cities)'],
            //componentRestrictions: { country: 'ca' }
        };
        autocomplete = new google.maps.places.Autocomplete(inputField, inputFieldOptions);
    }

}

var GEO = {
    addrToLatLng: function (addr) {

        GS.geocoder.geocode({ 'address': addr }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                console.log("addrToLatLng status okay");
                GV.savedPosition = results[0].geometry.location;
                MAP.initialize(GV.savedPosition);
                GRUB.getGrub();
            } else {
                console.log("GeocoderStatus is NOT OK");
                return;
            }
        });
    },

    latLngToAddr: function (pos, callback) {

        console.log("latLngToAddr");

        GS.geocoder.geocode({ 'latLng': pos },

            function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var str = results[0].formatted_address;

                if ($.isFunction(callback)) {
                    callback.call(this);
                }
                GV.savedAddress = str;
                $("#search").val(GV.savedAddress);

            } else {
                console.log("GeocoderStatus is NOT OK");
            }
        });

    },

    getNavLoc : function (callback) {
        console.log("getNavLoc");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                geoLocSuccess,  // on successful location retrieval
                geoLocFail,     // on failed
                { timeout: 10000 }
            );

        } else {
            console.log("Geolocation from the browser failed");
        }

        function geoLocSuccess(position) {

            console.log("geoLocSuccess");
            var navLoc = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
            );

            GEO.latLngToAddr(navLoc, callback); // Convert to address string.
        }
        function geoLocFail() {
            console.log("geoLocFail called");
        }
    }
}

var MAP = {

    initialize: function (position) {

        if (!GV.init_done) {
            var mapOptions = {
                center: position,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            GS.placesService = new google.maps.places.PlacesService(map);
            GS.directionsDisplay.setMap(map);
            GV.init_done = 1;
        } else {
            console.log("else");
            MAP.center(position);
        }
        GRUB.createUserMarker(position);

    },
    center: function (position) {
        console.log("set center");
        map.setCenter(position);
    },
    calcRoute: function(dest) {
        var request = {
            origin:GV.savedPosition,
            destination:dest,
            travelMode: GV.travelMode
        };
        GS.directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                GS.directionsDisplay.setDirections(result);
            }
        });
    }
}

var GRUB = {
    createPlaceMarker: function (place) {

        // TODO: Remove marker function
        if(markersArray[1]){
            markersArray[1].setMap(null);
        }

        // Create the place marker on the map
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        markersArray[1] = marker;

        // Add directions to the map!
        MAP.calcRoute( place.geometry.location );

    },

    createUserMarker: function (place) {
        if (markersArray[0]) {
            markersArray[0].setMap(null);
        }

        var marker = new google.maps.Marker({
            map: map,
            position: place,
            icon: GV.markerImage
        });
        markersArray[0] = marker;
    },

    getGrub: function () {
        var request = {
            location: GV.savedPosition,
            radius: GV.maxDistance,
            types: ['food', 'restaurant', 'meal_delivery', 'meal_takeaway']
        };
        GS.placesService.nearbySearch(request, GRUB.randomSpot);
    },

    randomSpot: function (grubResults, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var i = Math.floor((Math.random() * grubResults.length));
            console.log("random place int: " + i);
            GV.placeForGrub = grubResults[i];
            GRUB.createPlaceMarker(GV.placeForGrub);
            // Request more places details
            GS.placesService.getDetails(GV.placeForGrub, GRUB.placeInfo);
        }
        else {
            console.log("Status NOT OKAY from Places Request.");
        }
    },

    placeInfo: function ( place, status ) {
        if (status == google.maps.places.PlacesServiceStatus.OK){
            //https://developers.google.com/maps/documentation/javascript/places#place_details
            GV.placeForGrub = place;
        }
    }
}

$(document).ready(PI.onReady);