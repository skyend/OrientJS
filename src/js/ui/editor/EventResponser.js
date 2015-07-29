var _ = function (_editor) {

    var editorPointX = 0, editorPointY = 0, hightLightBorderSize = 3;
    var windowScrollY = 0, viewerScrollY = 0;

    require('./EventResponser.less');
    this.element = null;
    this.highLightElement = null;

    this.eventBind = function () {
        var responser = this;
        windowScrollY = window.scrollY
        window.addEventListener('scroll', function (event) {
            windowScrollY = window.scrollY;
        });
        this.element.addEventListener("click", function (event) {
            var stack = _editor.vController.click(event.clientX - editorPointX, windowScrollY + event.clientY - editorPointY);
            responser.showHighLight(stack);
            event.preventDefault();
        });
        this.element.addEventListener("mouseover", function (event) {
            console.log('mouseover');
            event.preventDefault();
        });
        this.element.addEventListener("mouseout", function (event) {
            console.log('mouseout');
            event.preventDefault();
        });

        this.element.addEventListener("drop", function (event) {
            console.log('drop');
            event.preventDefault();
        });
        this.element.addEventListener("dragover", function (event) {
            console.log('dragover');
            event.preventDefault();
        });

        this.element.addEventListener("mousemove", function (event) {
            var stack = _editor.vController.click(event.clientX - editorPointX, windowScrollY + event.clientY - editorPointY);
            responser.showHighLight(stack);
            console.log('mousemove');
            event.preventDefault();
        });
    };

    this.showHighLight = function (_stack) {
        if (_stack && _stack.length > 0) {
            var targetNode = _stack[_stack.length - 1];
            var targetNodeoffset = targetNode.element.offset
            this.highLightElement.style.top = (targetNodeoffset.y - hightLightBorderSize) + 'px';
            this.highLightElement.style.left = (targetNodeoffset.x - hightLightBorderSize) + 'px';
            this.highLightElement.style.width = targetNodeoffset.width + 'px';
            this.highLightElement.style.height = targetNodeoffset.height + 'px';
            this.highLightElement.style.display = 'block';

        }
    };

    (function (responser) {
        var editorRect = _editor.mountElement.getBoundingClientRect();
        editorPointX = editorRect.left;
        editorPointY = editorRect.top;

        //이벤트 영역 태그 생성.
        var responserTag = document.createElement("div");
        responserTag.setAttribute("id", "editor_event");
        _editor.mountElement.appendChild(responserTag);
        responser.element = responserTag;

        //HighLight 영역 생성.
        var highLightTag = document.createElement("div");
        highLightTag.setAttribute("class", "highLight");
        responserTag.appendChild(highLightTag);
        highLightTag.style.display = 'none';
        responser.highLightElement = highLightTag;

    })(this);
}
module.exports = _;