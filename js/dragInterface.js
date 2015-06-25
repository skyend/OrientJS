var setDraggable = function () {
    var $iframe = $('#contents-frame');
    $(".grid").draggable({
        appendTo: 'parent',
        helper: "clone",
        iframeFix: true,
        connectToSortable: $("#contents-frame").contents().find("#sortable"),
        cursorAt: {top: 0, left: 0},
        start: function (e, ui) {
            console.log("drag start");
            console.log("x : " + e.pageX + ", " + "y : " + e.pageY);
        },
        drag: function (e, ui) {
            //var offset = $iframe.offset();
            //if (offset.left < e.clientX &&
            //    offset.top < e.clientY &&
            //    offset.top + $iframe.height() > e.clientY &&
            //    offset.left + $iframe.width() > e.clientX) {
            //} else {
            //}
            //console.log("x : " + e.pageX + ", " + "y : " + e.pageY);
        },
        stop: function (e, ui) {
        }
    });
}

