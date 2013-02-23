var map;
var userPosition = new google.maps.LatLng();
var geocoder;
var userInput = document.getElementById('addrSearch');

function initialize() {

    //var pos = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        center: userPosition,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
	       mapOptions);

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
