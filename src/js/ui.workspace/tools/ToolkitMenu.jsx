/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function() {
  var React = require("react");
  require('./ToolkitMenu.less');

  var ToolkitMode = React.createClass({
    renderItems (_group) {
      return (
        <div className="item">
          <div className="title">{_group.itemTitle}</div>
          <ul className="inventory">
            {_group
              .items
              .map(function(item) {
                return (
                  <li draggable="true">
                    <span>{item}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )
    },
    render () {
      return (
        <div className='ToolkitMenu white'>
          {this
            .props
            .items
            .map(this.renderItems)}
        </div>
      );
    }
  });
  module.exports = ToolkitMode;
})
();
