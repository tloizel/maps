// Isochron starting point
var mapStart = [48.85703068536193, 2.3405350766242536];
var barycenterMarker;
var coverage = 'fr-idf';

// Limit isochron duration (required, or may trigger timeout when there is more data)
var maxDuration = 2000;
const link = '1IjoidGxvaXplbCIsImEiOiJja2kxdjJqcTcweTZsMnpxa3pucjh0cDlqIn0.ipiemX96csHDUZvs8LELSg'; 

//limits to paris
var corner1 = L.latLng(48.938, 2.160),
corner2 = L.latLng(48.794, 2.463),
mybounds = L.latLngBounds(corner1, corner2);


var map = L.map('map').setView(mapStart, 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_to{link}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  minZoom: 12,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  bounds: mybounds,
  link: 'ken='+'pk'+'.eyJ'+link //i tried, please i'm learning
}).addTo(map);

//marker creation
var markerBlack = L.icon({
  iconUrl: 'markerBlack.png',
  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
});

var markerGreen = L.icon({
  iconUrl: 'markerGreen.png',
  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
});

//interact with map
function onMapClick(e) {
  L.marker(e.latlng, {icon: markerBlack}).addTo(map);
  getCallIso(e.latlng) //new
  //callIso(e.latlng);
  amountClicks();
  calculating(true)
  //document.getElementById('test').innerHTML= clicksOnMap + ' clicks and LeafletBug is ' + LeafletBug;
}

map.on('click', onMapClick);

function drawBarycentre(baryCoord){
  let minClick = 2;
  if (barycenterMarker == undefined) {
    barycenterMarker = L.marker(baryCoord, {icon: markerGreen}).addTo(map);
  }
  else if (!LeafletBug && clicksOnMap > minClick || LeafletBug && clicksOnMap > minClick && barycenterMarker != undefined){
    barycenterMarker.setLatLng(baryCoord);
  }
  
}


/**
 * Display points returned by navitia isochron, and colored red/green depending on journey duration.
 *
 * @param {Object} result
 */
function drawIsochron(result) {
  var isochron = [];

  $.each(result.journeys, function(i, journey) {
    isochron.push({
      to: [
        parseFloat(journey.to.stop_point.coord.lat),
        parseFloat(journey.to.stop_point.coord.lon)
      ],
      duration: journey.duration,
      data: journey
    });
  });

  createGeoJsonFromIsochron(isochron);

}

var locations = [];

/**
 * Create a geoJson object contening all points and their colors.
 *
 * @param {Array} isochron
 *
 * @returns {Object} GeoJson object
 */
function createGeoJsonFromIsochron(isochron) {
  var geojson = {
    name: 'Points',
    type: 'FeatureCollection',
    features: []
  };

  $.each(isochron, function(i, point) {

    var pointName = point.data.to.stop_point.name;
    var pointCoord = point.data.to.stop_point.coord;
    var pointDuration = {duration: point.duration};
    var pointID = point.data.to.id;
    var pointNameCoordDuration = {pointID, pointName, ...pointCoord, ...pointDuration}
    locations.push(pointNameCoordDuration);
  });

  onlyDuplicates(locations);

}

//only keep duplicate values
function onlyDuplicates(arr){
  let minClick = 1;
  if(!LeafletBug && clicksOnMap > minClick || LeafletBug && clicksOnMap > minClick*2){
    var byID = arr.slice(0);
    byID.sort(function(a,b) {
    var x = a.pointID;
    var y = b.pointID;
    return x < y ? -1 : x > y ? 1 : 0;
  });

  //console.log('by id:');
  //console.log(byID);

  let duplicates = [];
  for (let i = 0; i < byID.length - 1; i++) {
    if (byID[i + 1].pointID == byID[i].pointID) {
      let pointID = byID[i].pointID;
      let pointName = byID[i].pointName;
      let duration = byID[i+1].duration + byID[i].duration;
      var toPush = {pointID, pointName, duration};
      duplicates.push(toPush);
    }
  }
  locations = duplicates;    
}    

var byDuration = locations.slice(0);
byDuration.sort(function(a,b) {
  var x = a.duration;
  var y = b.duration;
  return x < y ? -1 : x > y ? 1 : 0;
});

locations = byDuration;
//console.log(locations);
updateBarycentre(); 
}

function updateBarycentre(){
  let minClick = 1;
  if (!LeafletBug && locations.length > 0 && clicksOnMap > minClick || LeafletBug && locations.length > 0 && clicksOnMap > minClick*2){
    getCallMetro(locations[0].pointID);
    //callMetro(locations[0].pointID);
    //console.log(locations[0].pointID);
  } 
  else if (!LeafletBug && clicksOnMap > minClick || LeafletBug && clicksOnMap > minClick*2){
    getCallMetro('1:')
  }
  if (!LeafletBug && clicksOnMap <= minClick || LeafletBug && clicksOnMap <= minClick*2){
    calculating(false)
  }
}

function metroIs(result) {
  if(result.places_nearby != undefined){
    //console.log(result);
    drawBarycentre(result.places_nearby[0].stop_area.coord);
    document.getElementById('res').innerHTML = result.places_nearby[0].stop_area.name;
    } 
  else {
    document.getElementById('res').innerHTML = 'un call sur zoom';
  }
  calculating(false);
}








