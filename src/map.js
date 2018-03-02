
var google = google || {}

var repeatOnXAxis = false // Do we need to repeat the image on the X-axis? Most likely you'll want to set this to false


// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  if (!repeatOnXAxis) return coord

  var y = coord.y
  var x = coord.x

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  var tileRange = 1 << zoom

  // don't repeat across Y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null
  }

  // repeat across X-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange
  }

  return {
    x: x,
    y: y
  }

}

function initMap() {
  // Define our custom map type
  var customMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      var normalizedCoord = getNormalizedCoord(coord, zoom)
      var path = "http://www.skwalweb.net/dnd-map/"
      if (normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
        return path + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".jpg"
      } else {
        return path + "empty.jpg"
      }
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 5,
    name: "SeagulIsland"
  })

  var eastbarrow = { lat: -72.781, lng: -0.336 }
  var westbarrow = { lat: -49.178, lng: -78.031 }

  // Basic options for our map
  var myOptions = {
    center: new google.maps.LatLng(-64, -6),
    zoom: 4,
    minZoom: 0,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ["custom"]
    }
  }

  // Init the map and hook our custom map type to it
  var map = new google.maps.Map(document.getElementById("map"), myOptions)
  map.mapTypes.set("custom", customMapType)
  map.setMapTypeId("custom")

  google.maps.event.addListener(map, "click", function(event) {
    var marker = new google.maps.Marker({position: event.latLng, map: map})
    var infowindow = new google.maps.InfoWindow({
      content: event.latLng.lat() + ", " + event.latLng.lng()
    })
    infowindow.open(map, marker)
  })

}
