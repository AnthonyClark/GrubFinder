var lat=43;
var lng=-79;
var map;
var service;
var infowindow;

function initialize(lat, lng) {

	var init_pos = new google.maps.LatLng(lat,lng);
	var mapOptions = {
		center: init_pos,
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),
	mapOptions);
	document.getElementById("map_canvas").style.zIndex="1";
	
	var request = {
		location: init_pos,
		radius: '2000',
		types: ['food']
	};
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function getLocation()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(centerOnPos);
	}
	else
	{
		initialize(lat,lng);
	}
}
function centerOnPos(position)
{
	initialize(position.coords.latitude, position.coords.longitude);
}

function callback(results, status) {
	if (status != google.maps.places.PlacesServiceStatus.OK) {
		alert(status);
		return;
	}
	for (var i = 0, result; result = results[i]; i++) {
		var marker = new google.maps.Marker({
		map: map,
		position: result.geometry.location
		});
	}
}