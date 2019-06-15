// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});



function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //    onEachFeature: onEachFeature
  // });

  

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var radiusValue = feature.properties.mag;
      var fillColor = "#ff7800";
      if (radiusValue <= 1) {
        fillColor = "#78e30e";
      } 
      else if (radiusValue > 1 && radiusValue <= 2) {
        fillColor = "#e6f507";
      } 
      else if (radiusValue > 2 && radiusValue <= 3) {
        fillColor = "#f5cd07";
      } 
      else if (radiusValue > 3 && radiusValue <= 4) {
        fillColor = "#f59e07";
      } 
      else if (radiusValue > 4 && radiusValue <= 5) {
        fillColor = "#f57007";
      } 
      else {
        fillColor = "#f51907";
      } 

  var geojsonMarkerOptions = {
    radius: radiusValue * 10,
    fillColor: fillColor,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };


        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
});


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + 
     "access_token=pk.eyJ1IjoiamNyb3NzcnUiLCJhIjoiY2p3YjhvenZ6MGRnbDQ5cDRtamJuazJ3ciJ9." +    
     "cFLWQ2QYGgxoqBU7cs52dA")

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,legend, {
    collapsed: false
  }).addTo(myMap);

  

  //popUp.addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    //var limits = geojson.options.limits;
    //var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h4>Magnitude</h4>";
    //  +
    //   "<div class=\"labels\">" +
    //     "<div class=\"min\">" + 0 + "</div>" +
    //     "<div class=\"max\">" + 6 + "</div>" +
    //   "</div>";

    div.innerHTML = legendInfo;

      labels.push("<li style=\"background-color: " + "#78e30e" + "\"> 0 - 1 </li>");
      labels.push("<li style=\"background-color: " + "#e6f507" + "\"> 1 - 2 </li>");
      labels.push("<li style=\"background-color: " + "#f5cd07" + "\"> 2 - 3 </li>");
      labels.push("<li style=\"background-color: " + "#f59e07" + "\"> 3 - 4 </li>");
      labels.push("<li style=\"background-color: " + "#f57007" + "\"> 4 - 5 </li>");
      labels.push("<li style=\"background-color: " + "#f51907" + "\"> > 5 </li>");

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  
  legend.addTo(myMap);

}
