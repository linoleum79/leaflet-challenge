// Creating the map object
let Mymap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3
  });
  
  // Adding the tile layer
  let baseMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  
  // Display base map
  baseMap.addTo(Mymap);
  
  // Load the GeoJSON Data
  let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Get the data with d3.
  d3.json(queryUrl).then(function (data) {
  
  
    // Create a new data layer with a circleMarker
    L.geoJson(data, {
      pointToLayer: function (feature, location) {
        return L.circleMarker(location);
      },
      // Call createFeatures function to display circles on the map with magnitude and depth
      style: createFeatures,
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
        );
      }
    }).addTo(Mymap);
  
    // The createFeatures Function returns the magnitude "properties.mag" and the depth of the quake,
    // "geometry.coordinates[2]". Pass to createRadius and createColor for the radius
    // and the depth.
    function createFeatures(feature) {
      return {
        opacity: 1,
        fillOpacity: 2,
        fillColor: createColor(feature.geometry.coordinates[2]),
        color: "white",
        radius: createRadius(feature.properties.mag),
        stroke: true,
        weight: 0.9
      };
    }
  
  
    // createColor function sets the color based on the depth of the earthquake.
    function createColor(depth) {
      switch (true) {
        case depth > 90:
          return "#0066ff";
        case depth > 70:
          return "#cc33ff";
        case depth > 50:
          return " #b3b300";
        case depth > 30:
          return "#00b8e6";
        case depth > 10:
          return "#800000";
        default:
          return "#400080";
      }
    }
  
    // createRadius function sets the radius of the earthquake based on its magnitude.
    function createRadius(magnitude) {
      return magnitude * 5;
    }
  
    // Set up the legend
    let legend = L.control({ position: "topright" });
  
    // Then add all the details for the legend
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10, 10, 30, 50, 70, 90];
      let colors = [
        "#400080",
        "#800000",
        "#00b8e6",
        "#b3b300",
        "#cc33ff",
        "#0066ff"];
      let labels = [];
  
  
      // Add the minimum and maximum.
      let legendInfo = "<h1>Depth of Earthquake<h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Add legend to the map.
    legend.addTo(Mymap);
  
  })