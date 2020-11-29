// Navitia query for this isochron
function getIsochronUrl(coords){
    return 'https://api.navitia.io/v1/coverage/' + coverage + '/journeys?from=' + coords.lng + ';' + coords.lat + '&max_duration=' + maxDuration;
}

// Navitia query for nearest metro stop
function getMetroUrl(stopID){
    return 'https://api.navitia.io/v1/coverage/' + coverage + '/commercial_modes/commercial_mode%3AMetro/stop_areas/' + convertID(stopID) + '/places_nearby?type%5B%5D=stop_area&distance=1000&count=1&';
    }

function convertID(dt){
    var res = dt.replace(':', '%3A');
    return res
}

// Call navitia api for isochron
function callIso(coords){
    $.ajax({
        type: 'GET',
        url: getIsochronUrl(coords),
        dataType: 'json',
        headers: {
        Authorization: 'Basic ' + btoa(navitiaToken)
        },
        success: drawIsochron,
        error: function(xhr, textStatus, errorThrown) {
            alert('Error when trying to process isochron: "' + textStatus + '", "' + errorThrown + '"');
        }
    });
}

// Call navitia api for nearest metro
function callMetro(stopID){
    $.ajax({
        type: 'GET',
        url: getMetroUrl(stopID),
        dataType: 'json',
        headers: {
            Authorization: 'Basic ' + btoa(navitiaToken)
        },
        success: metroIs,
        error: function(xhr, textStatus, errorThrown) {
            document.getElementById('res').innerHTML = 'a zoom call';
        //alert('Error when trying to process isochron: "' + textStatus + '", "' + errorThrown + '"');
        }
    });
}