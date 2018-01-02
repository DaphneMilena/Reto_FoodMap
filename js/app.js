var addFilters = (function(element) {
  var filtersArr = [];
  for (var i = 0; i < restaurants.length; i++) {
    for (var n = 0; n < restaurants[i].filters.length; n++) {
      filtersArr.push(restaurants[i].filters[n]);
    }
  }
  var uniqueFilters = [...new Set(filtersArr)];
  var filtersFinal = uniqueFilters.sort();
  for (var a = 0; a < filtersFinal.length; a++) {
    element.append("<option value='"+filtersFinal[a]+"'>"+filtersFinal[a]+"");
  };
  return filtersFinal;
});



var myLocation;

var initMap = (function() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 14
  });
  var infoWindow = new google.maps.InfoWindow({map: map});
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    myLocation = pos;
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    var thisPlace = new google.maps.LatLng(myLocation.lat,myLocation.lng);
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: thisPlace,
      radius: 1500,
      type: ["food"]
    }, callback);
    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    };
    function createMarker(thisPlace) {
      var placeLoc = thisPlace.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: thisPlace.geometry.location
      });
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(thisPlace.name);
        infoWindow.open(map, this);
      });
    };

    map.setCenter(pos);
  }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
      handleLocationError(false, infoWindow, map.getCenter());
  }
});

var handleLocationError = (function(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
});

  //var thisPlace = new google.maps.LatLng(myLocation.lat,myLocation.lng);

$(document).ready(function() {
  /**
  * Function that creates new options according to the tags
  */
  addFilters($("#filter"));
  /**
  * Function that makes the loader fadeout after 6 seconds
  */
  setTimeout(function(){
    $("#loader").fadeOut();
    $("#main-container").fadeIn();
  },1000);
  setTimeout(function() {
    initMap();
  },1000);

  /**
  * Makes the images show when the value of a selection matches the filters of the restaurant
  */
  $("#filter").change(function() {
    $("#restaurants-container").children().remove();
    var selection = $("select").val();
    for (var i = 0; i < restaurants.length; i++) {
      for(var n = 0; n < restaurants[i].filters.length; n++) {
        if (restaurants[i].filters[n] == selection) {
          var image = restaurants[i].photo;
          $("#restaurants-container").append("<div class='col s12 l6 xl6'><div class='container-img-p'><p class='overlay-text'>"+restaurants[i].name+"</p>"+image+"</div></div>");
        }
      }
    };
    /**
    * Mouseover effect
    */
    $(".container-img-p").mouseover(function() {
      $(":nth-child(1)", this).css({"opacity": "1"});
    });

    $(".container-img-p").mouseout(function() {
      $(":nth-child(1)", this).css({"opacity": "0"});
    });

    /**
    * Determining the content of the modal
    */
    $(".container-img-p").click(function() {
      var place = $(this).children("img").attr("alt");
      for (var i = 0; i < restaurants.length; i++) {
        if (place == restaurants[i].name) {
        console.log(restaurants[i].name);
      }
    }
  });
      /**
      * If the user clicks on the modal overlay, the search resets itself
      */


    });
  });
