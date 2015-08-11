var _ = function(_editor) {

  var editorPointX = 0,
    editorPointY = 0,
    hightLightBorderSize = 3;
  var windowScrollY = 0,
    viewerScrollY = 0;

  var svgNS = "http://www.w3.org/2000/svg";

  require('./EventResponser.less');
  this.element = null;
  this.highLightElement = null;
  this.placeholderElement = null;

  this.eventBind = function() {
    var responser = this;
    windowScrollY = window.scrollY
    window.addEventListener('scroll', function(event) {
      windowScrollY = window.scrollY;
    });
    this.element.addEventListener("click", function(event) {
      var stack = _editor.vController.click(event.clientX - editorPointX, windowScrollY + event.clientY - editorPointY);
      responser.showHighLight(stack);
      event.preventDefault();
    });
    this.element.addEventListener("mouseover", function(event) {
      console.log('mouseover');
      var stack = _editor.vController.click(event.clientX - editorPointX, windowScrollY + event.clientY - editorPointY);
      responser.showHighLight(stack);
      event.preventDefault();
    });
    this.element.addEventListener("mouseout", function(event) {
      console.log('mouseout');
      event.preventDefault();
    });

    this.element.addEventListener("drop", function(event) {
      console.log('drop');
      event.preventDefault();
    });
    this.element.addEventListener("dragover", function(event) {
      console.log('dragover');
      event.preventDefault();
    });

    this.element.addEventListener("mousemove", function(event) {
      var stack = _editor.vController.click(event.clientX - editorPointX, windowScrollY + event.clientY - editorPointY);
      responser.placeholder(stack);
      console.log('mousemove');
      event.preventDefault();
    });
  };

  this.showHighLight = function(_targetStack) {
    if (_targetStack === undefined || _targetStack === null || _targetStack.length == 0) {
      return;
    }
    var targetNode = _targetStack[_targetStack.length - 1];
    var targetNodeoffset = targetNode.element.offset
    this.highLightElement.style.top = (targetNodeoffset.y - hightLightBorderSize) + 'px';
    this.highLightElement.style.left = (targetNodeoffset.x - hightLightBorderSize) + 'px';
    this.highLightElement.style.width = targetNodeoffset.width + 'px';
    this.highLightElement.style.height = targetNodeoffset.height + 'px';
    this.highLightElement.style.display = 'block';

  };

  this.placeholder = function(_targetStack) {
    if (_targetStack === undefined || _targetStack === null || _targetStack.length == 0) {
      return;
    }
    var targetNode = _targetStack[_targetStack.length - 1];
    var targetNodeoffset = targetNode.element.offset;
    var horizontality = false;
    var triangleLength = 8,
      triangleHeight = Math.sqrt((Math.pow(triangleLength, 2) - Math.pow(triangleLength / 2, 2)));
    var linePointX = triangleLength / 2,
      lineLength = targetNodeoffset.height;
    var width = triangleLength + 2,
      height = lineLength + (triangleHeight * 2);
    if (!horizontality) {
      var _temp = width;
      width = height;
      height = _temp;
    }

    var placeholder = document.getElementById('placeholder');
    placeholder.style.top = (targetNodeoffset.y - triangleHeight) + 'px';
    placeholder.style.left = (targetNodeoffset.x) + 'px';
    placeholder.style.width = width + 'px';
    placeholder.style.height = height + 'px';


    var svg = document.getElementById('placeholderSvg');
    svg.setAttribute("viewbox", "0 0 " + width + " " + height);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);


    var g = document.getElementById('placeholder_g');
    if (horizontality) g.setAttribute("transform", "translate(1,0) rotate(0 8 0)");
    else g.setAttribute("transform", "translate(-8,1) rotate(270 8 0)");

    document.getElementById('triangle1').setAttribute("points", "0,0 " + (triangleLength) + ",0 " + (linePointX) + "," + triangleHeight);

    var line = document.getElementById('line');
    line.setAttribute("x1", linePointX);
    line.setAttribute("y1", triangleHeight);
    line.setAttribute("x2", linePointX);
    line.setAttribute("y2", triangleHeight + lineLength);

    document.getElementById('triangle2').setAttribute("points", linePointX + "," + (triangleHeight + lineLength) + " " + triangleLength + "," + (triangleHeight * 2 + lineLength) + " 0," + (triangleHeight * 2 + lineLength));

  };

  (function(responser) {
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

    var placeholderTag = document.createElement("div");
    placeholderTag.setAttribute("id", "placeholder");
    var svgTag = document.createElementNS(svgNS, "svg");
    svgTag.setAttribute("id", "placeholderSvg");
    var gTag = document.createElementNS(svgNS, "g");
    gTag.setAttribute("id", "placeholder_g");
    svgTag.appendChild(gTag);
    gTag.appendChild((function() {
      var polygon = document.createElementNS(svgNS, "polygon");
      polygon.setAttribute("id", "triangle1");
      return polygon;
    })());
    gTag.appendChild((function() {
      var polygon = document.createElementNS(svgNS, "polygon");
      polygon.setAttribute("id", "triangle2");
      return polygon;
    })());
    gTag.appendChild((function() {
      var line = document.createElementNS(svgNS, "line");
      line.setAttribute("id", "line");
      return line;
    })());
    placeholderTag.appendChild(svgTag);
    _editor.mountElement.appendChild(placeholderTag);
    responser.placeholderElement = placeholderTag;

  })(this);
}
module.exports = _;