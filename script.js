var init_done = false;
var map;
var userPosition = new google.maps.LatLng();
var maxDistance = String(2000);
var geocoder;
var infowindow;
var placeForGrub;

// Global Variables
var GV = {
    mapInitComplete: false,
    savedAddress: "",
    userPostion: {}
    
}

// Page initialization
var PI = {

    onReady: function () {
        
        console.log("onReady");
        GEO.getNavLoc(PI.initializeAutoComplete);
        $("#search-form").submit(PI.searchHandler);

    },

    searchHandler: function () {
        
        GV.savedAddress = $("#search").val();

        if (!init_done) {
            GEO.addrToLatLng(GV.savedAddress);
        }
    },

    initializeAutoComplete: function () {

        var inputField = document.getElementById('search');
        var inputFieldOptions = {
            types: ['(regions)']
        };
        autocomplete = new google.maps.places.Autocomplete(inputField, inputFieldOptions);
    }

}

var GEO = {
    addrToLatLng: function (addr) {

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': addr }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                console.log("addrToLatLng status okay");
                MAP.initialize( results[0].geometry.location);
            } else {
                console.log("GeocoderStatus is NOT OK");
                return;
            }
        });
    },

    latLngToAddr: function (pos, callback) {

        console.log("latLngToAddr");
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': pos },

            function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var str = results[0].formatted_address;

                if($.isFunction(callback)) {
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

    initialize: function (init_pos) {

        var mapOptions = {
            center: init_pos,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    }

}

var GRUB = {
    createMarker: function (Place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        //google.maps.event.addListener(marker, 'click', function () {
        //    infowindow.setContent(place.name);
        //    infowindow.open(map, this);
        //});
    },

    getGrub: function () {
        var request = {
            location: userPosition,
            radius: maxDistance,
            types: ['food', 'restaurant', 'meal_delivery', 'meal_takeaway']
        };

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, GRUB.randomSpot);
    },

    randomSpot: function () {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var i = Math.floor((Math.random() * grubResults.length));
            console.log("random place int: " + i);
            placeForGrub = grubResults[i];
            GRUB.createMarker(placeForGrub);
        }
        else {
            console.log("Status NOT OKAY from Places Request.");
        }
    }
}


$(document).ready(PI.onReady);


function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("addrSearch").value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            userPosition = results[0].geometry.location;
            if (map && false) {
                map.setCenter(userPosition);
                var marker = new google.maps.Marker({
                    map: map,
                    position: userPosition
                });
            }
            else {
                initialize(
                    userPosition.lat,
                    userPosition.lng
                 );
            }
        }
        else {
            //TODO: Handle error
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}