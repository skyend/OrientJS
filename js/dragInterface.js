var setDnd = function () {
    $('.contents-frame').attr('src','main.html').load(function () {
        $('.grid').draggable({
            connectWith: $('.sortable', $(".contents-frame")[0].contentDocument)
        });
    });
};