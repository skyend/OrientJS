/**
 * Created by seonwoong on 15. 6. 16..
 */

$(function() {
    console.log( "ready!" );
    $("#menu-list li").on("click", "a", function(){
        $(this).attr("class", "actvie");
        console.log( ".on" );
    });
});