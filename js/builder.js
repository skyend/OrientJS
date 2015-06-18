/**
 * Created by seonwoong on 15. 6. 16..
 */

$(function() {
    console.log( "ready!" );
    $("#menu-list li a").on("click", function(e){
        $("#menu-list i").find("span").remove();
        $("#menu-list i").removeClass("active");
        $(e.target).addClass("active");
        $(e.target).append("<span class='glyphicon glyphicon-triangle-left tri'></span>");

    });
});