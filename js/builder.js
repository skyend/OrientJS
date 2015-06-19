/**
 * Created by seonwoong on 15. 6. 16..
 */

var gridAccordian = React.createClass({
    render: function () {
        return
    }
});

$(function () {
    console.log("ready!");
    $("#menu-list li a").on("click", function (e) {
        $("#menu-list i").find("span").remove();
        $("#menu-list i").removeClass("active");
        $(e.target).addClass("active");
        $(e.target).append("<span class='glyphicon glyphicon-triangle-left tri'></span>");
    });
    $("#menu-1").on("click", function () {
        $("#side-contents").empty();
        $("#side-contents").append('<div class="accordion"> <dl> <dt> <a href="#accordion1" aria-expanded="false" aria-controls="accordion1" class="accordionTitle js-accordionTrigger">LAYOUT</a> </dt> <dd class="accordionItem is-collapsed" id="accordion1" aria-hidden="true"> <p id="grid">Grid 1</p> <p>Grid 2</p> </dd> <dt> <a href="#accordion1" aria-expanded="false" aria-controls="accordion1" class="accordionTitle js-accordionTrigger">PLAIN</a> </dt> <dd class="accordionItem is-collapsed" id="accordion2" aria-hidden="true"> <p>Title</p> <p>Address</p> <p>Form</p> </dd> </dl> </div>');
        accFuncLoad();
    });
    $("#menu-2").on("click", function () {
        $("#side-contents").empty();
        $("#side-contents").append('<div id="device-mode" class="device-mode"> <dt>DEVICE MODE</dt> <dd>Desktop <i class="fa fa-desktop"></i></dd> <dd>Tablet <i class="fa fa-tablet"></i></dd> <dd>Mobile <i class="fa fa-mobile"></i></dd> </div>');
    });

});