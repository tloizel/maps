var clicksOnMap = 0;
var wait = false;

function amountClicks(){
    clicksOnMap ++ ;
    if(!LeafletBug && clicksOnMap > 10 || LeafletBug && clicksOnMap > 20){
        document.getElementById('map').style.pointerEvents = 'none';
    }
}

function calculating(state){
    if (state){
        wait = true;
        document.getElementById('map').style.pointerEvents = 'none'; 
    }
    else {
        wait = false;
        document.getElementById('map').style.pointerEvents = 'auto';
    }
}