var init_done = false;
var map;
var userPosition = new google.maps.LatLng();
var maxDistance = String(2000);
var geocoder;
var infowindow;
var placeForGrub;

// Make the autocomplete work for address search

var PI = {

    onReady: function () {
        console.log("onReady");
        GEO.getNavLoc();
        $("#searchForm").submit(PI.searchHandler);

    },

    searchHandler: function () {
        if (!init_done) {
            MAP.initialize(
                GEO.addrToLatLng( $("#search").val() )
            );
        }
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

    latLngToAddr: function (pos) {

        console.log("latLngToAddr");
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': pos }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var str = results[0].formatted_address;

                // Setting the search value here, be careful!
                $("#search").val(str)

                return str;
            } else {
                console.log("GeocoderStatus is NOT OK");
                return;
            }
        });

    },

    getNavLoc : function () {
        console.log("getNavLoc");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                geoLocSuccess,
                geoLocFail,
                { timeout: 10000 }
            );
        } else {
            console.log("Geolocation from the browser failed");
            return;
        }

        function geoLocSuccess(position) {

            console.log("geoLocSuccess");
            var navLoc = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
            );

            GEO.latLngToAddr(navLoc);
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


$(document).ready(PI.onReady);

function initialize() {

    //var pos = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        center: userPosition,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
	       mapOptions);

    var inputField = document.getElementById('addrSearch');
    var inputFieldOptions = {
        types: ['(regions)'],
        componentRestrictions: { country: 'ca' }
    };
        autocomplete = new google.maps.places.Autocomplete(inputField, inputFieldOptions);
        console.log(Err.message);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            geoLocSuccess,
            geoLocFail,
            { timeout: 1000 }
        );

        function geoLocSuccess(position) {

            userPosition = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
            );
            initialize();

        }
    }
    else {
        geoLocFail();
    }
}

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

function geoLocFail() {
}

function getGrub() {

    var request = {
        location: userPosition,
        radius: maxDistance,
        types: ['food','restaurant','meal_delivery','meal_takeaway']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, randomSpot);
}

function randomSpot(grubResults, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var i = Math.floor((Math.random() * grubResults.length));
        console.log("random place int: " + i);
        placeForGrub = grubResults[i];
        createMarker(placeForGrub);
    }
    else {
        alert("Status NOT OKAY from Places Request.");
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}