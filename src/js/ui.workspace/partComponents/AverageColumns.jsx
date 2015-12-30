import Column from './AverageColumns/Column.jsx';
var React = require("react");

let AverageColumns = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      columns: [],
      width:0,
      height:0
    };
  },

  getInitialState(){
    let state = {};

    this.props.columns.map(function(_column){
      state['fold_'+_column.name] = _column.defaultFold;
    });

    return state;
  },

  onThrowCatcherFold(_e){
    let name = _e.name;
    let nextState = {};
    nextState['fold_'+name] = true;

    this.setState(nextState);
  },

  onThrowCatcherUnfold(_e){
    let name = _e.name;
    let nextState = {};
    nextState['fold_'+name] = false;

    this.setState(nextState);
  },

  renderColumn(_column, _width){
    return <Column reactElement={_column.element} width={_width} icon={_column.icon} height={this.props.height} name={_column.name} folding={this.state['fold_'+_column.name]}/>
  },

  renderColumns(){
    let that = this;
    let totalColumns = this.props.columns.length;
    let foldedColumnCount = 0;
    this.props.columns.map(function(_column){
      if( that.state['fold_'+_column.name] ){
        foldedColumnCount++;
      }
    });

    let divideWidth = (this.props.width-(foldedColumnCount*30)) / (totalColumns-foldedColumnCount);

    return this.props.columns.map(function(_column){
      return that.renderColumn(_column, that.state['fold_'+_column.name] ? 30: divideWidth)
    });
  },

  render(){
    console.log(this.props, this.state);
    return (
      <div className="AverageColumns">
        { this.renderColumns() }
      </div>
    )
  }
});

export default AverageColumns;
