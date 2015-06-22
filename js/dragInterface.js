/**
 * Created by seonwoong on 15. 6. 18..
 */

var dragInterface = function (){
    $('.grid').draggable({
        connectToSortable: $('.contents-frame').contents().find('.sortable'),
        iframeFix: true,
        helper: "clone",
        revert: "invalid",
        zIndex: 2,
        opacity: 0.74,
        appendTo: 'body',
        distance: 15
        //start: function (event, ui) {
        //    var $script = $(event.currentTarget).children('script');
        //    $(ui.helper).html($script.html());
        //},
        //drag: function (event, ui) {
        //    $(ui.helper).css('width', 400);
        //},
        //stop: function (event, ui) {
        //    $(ui.helper).css('width', '');
        //    $(ui.helper).css('height', '');
        //    $('.container .column').sortable({opacity: .35, connectWith: ".column", handle: '#drag-row'});
        //}
    });
    $('.contents-frame').load(function () {
        $(".sortable").sortable({
            connectWith: ".sortable",
            revert: true
        });
    });
};

var iframeOption = function(){
    // Create new object to cache iframe offsets
    $.ui.ddmanager.frameOffsets = {};
// Override the native `prepareOffsets` method. This is almost
// identical to the un-edited method, except for the last part!
    $.ui.ddmanager.prepareOffsets = function (t, event) {
        var i, j,
            m = $.ui.ddmanager.droppables[t.options.scope] || [],
            type = event ? event.type : null, // workaround for #2317
            list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack(),
            doc, frameOffset;

        droppablesLoop: for (i = 0; i < m.length; i++) {

            //No disabled and non-accepted
            if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
                continue;
            }

            // Filter out elements in the current dragoged item
            for (j = 0; j < list.length; j++) {
                if (list[j] === m[i].element[0]) {
                    m[i].proportions().height = 0;
                    continue droppablesLoop;
                }
            }

            m[i].visible = m[i].element.css("display") !== "none";
            if (!m[i].visible) {
                continue;
            }

            //Activate the droppable if used directly from draggables
            if (type === "mousedown") {
                m[i]._activate.call(m[i], event);
            }

            // Re-calculate offset
            m[i].offset = m[i].element.offset();

            // Re-calculate proportions (jQuery UI ~1.10 introduced a `proportions` cache method, so support both here!)
            proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };
            typeof m[i].proportions === 'function' ? m[i].proportions(proportions) : (m[i].proportions = proportions);

            /* ============ Here comes the fun bit! =============== */

            // If the element is within an another document...
            if ((doc = m[i].document[0]) !== document) {
                // Determine in the frame offset using cached offset (if already calculated)
                frameOffset = $.ui.ddmanager.frameOffsets[doc];
                if (!frameOffset) {
                    // Calculate and cache the offset in our new `$.ui.ddmanager.frameOffsets` object
                    frameOffset = $.ui.ddmanager.frameOffsets[doc] = $(
                        // Different browsers store it on different properties (IE...)
                        (doc.defaultView || doc.parentWindow).frameElement
                    ).offset();
                }

                // Add the frame offset to the calculated offset
                m[i].offset.left += frameOffset.left;
                m[i].offset.top += frameOffset.top;
            }
        }
    };
}