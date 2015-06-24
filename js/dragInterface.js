var setDraggable = function () {
    var $iframe = $('#contents-frame');
    $(".grid").draggable({
        connectToSortable: $("#contents-frame").contents().find("#sortable"),
        helper: "clone",
        revert: "invalid",
        iframeFix: true,
        drag: function (e, ui) {
            var offset = $iframe.offset();
            if (offset.left < e.clientX &&
                offset.top < e.clientY &&
                offset.top + $iframe.height() > e.clientY &&
                offset.left + $iframe.width() > e.clientX) {

                //console.log('in');

                //ui.helper.css('left',e.clientX - offset.left);
                //ui.helper.css('top',e.clientY - offset.top);
                ui.position.top = e.clientY - offset.top;
                ui.position.left = e.clientX - offset.left;

            } else {
                //console.log('out');
            }
            //console.log(e, ui);

            //ui.position.left = ui.position.left - 200;
            //ui.offset.top = ui.offset.top - 59;
            //ui.offset.left = ui.offset.left - 52;
            //ui.originalPosition.top = 0;
            //ui.originalPosition.left = 0;
            //console.log("x : " + e.pageX + ", " + "y : " + e.pageY);
        }
    });
}

