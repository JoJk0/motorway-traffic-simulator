function ViewController(){
    
    // Set up listeners
    $(".zoomIn").click(function(){zoomIn()});
    $(".zoomOut").click(function(){zoomOut()});
    
}
function zoomIn(){
    viewport.zoom(-800, true);
}
function zoomOut(){
    viewport.zoom(800, true);
}