// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
console.log(queryUrl)

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
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
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
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
    layers: [streetmap, earthquakes]
  });



// legend colors   
    function getColor(d) {
      return d > 4 ? "DarkRed" :
          d > 3 ? 'Red' :
          d > 2 ? 'Orange' :
          d > 1.5 ? 'Yellow' :
          d > 0.75 ? 'LimeGreen' :
          'DarkGreen';
  };

  // Adding legend
  var legend = L.control({
      position: 'bottomright'
  });

  legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend'),
          category = [0, 0.75, 1.5, 2, 3, 4],
          labels = [];
      for (var i = 0; i < category.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(category[i] + .5) + '"></i> ' +
              category[i] + (category[i + 1] ? '&ndash;' + category[i + 1] + '<br>' : '+');
      }
      return div;
  };
  legend.addTo(myMap);

  // Functions to create the earthquake points
  d3.json(queryUrl, function(data) {
      // Once we get a response, send the data.features object from queryUrl to the createFeature function
      createFeature(data.features);
  });

  // create circles
  function createFeature(earthquakeData) {
      console.log(earthquakeData)
      for (var i = 0; i < earthquakeData.length; i++) {
    
          function getColor(d) {
              return d > 4 ? "DarkRed" :
                  d > 3 ? 'Red' :
                  d > 2 ? 'Orange' :
                  d > 1.5 ? 'Yellow' :
                  d > 0.75 ? 'LimeGreen' :
                  'DarkGreen';
          };
     
          var circle = L
              .circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
                  color: getColor(earthquakeData[i].properties.mag),
                  opacity: 0.5,
                  fillColor: getColor(earthquakeData[i].properties.mag),
                  fillOpacity: 0.5,
                  radius: earthquakeData[i].properties.mag * 30000
              })
              .addTo(myMap);
      }
  } 

  // Create overlay object to hold our overlay layer for the earthquake points
  var overlayMaps = {
      "Earthquake Popup": earthquakes,
  };

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}