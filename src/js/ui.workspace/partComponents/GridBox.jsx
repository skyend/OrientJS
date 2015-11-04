import './GridBox.less';
import React from "react";

var GridBox = React.createClass({
  getDefaultProps () {
    return {
      width: 100,
      height: 100,
      placements: []
    }
  },

  renderColumns (_columns) {
    var columnCount = _columns.length;
    var eachColumnWidth = this.props.width / columnCount;
    var columnElements = [];
    let style = {
      width: eachColumnWidth,
      height: '100%',
      float: 'left'
    };

    for (var i = 0; i < columnCount; i++) {

      columnElements.push(
        <div style={style}>
          {_columns[i]}
        </div>
      );
    }

    return columnElements;
  },

  renderRows (_rows) {
    var rowCount = _rows.length;
    var eachRowHeight = this.props.height / rowCount;
    var rowElements = [];
    let style = {
      width: this.props.width,
      height: eachRowHeight
    };
    for (var i = 0; i < rowCount; i++) {
      rowElements.push(
        <div style={style}>
          {this.renderColumns(_rows[i])}
        </div>
      )
    }

    return rowElements;
  },

  renderGrid () {

    return this.renderRows(this.props.placements);
  },

  render () {
    var classes = [];
    classes.push('GridBox');
    classes.push('color-' + this.props.color);
    var style = {
      width: this.props.width,
      height: this.props.height
    };

    return (
      <div className={classes.join(' ')} onClick={this.props.onClick} style={style}>
        {this.renderGrid()}
      </div>
    );
  }
});

export default GridBox;
