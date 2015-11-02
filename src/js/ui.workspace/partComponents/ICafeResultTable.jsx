
require('./ICafeResultTable.less');

var React = require("react");

var ICafeResultTable = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getDefaultProps(){
      return {
        result:null
      }
    },

    getInitialState(){
      return {
        columnTypeList: null
      }
    },

    renderHeadColumn(_type){
      return (
        <th>
          { _type.name }
          <br/>
          <small>{_type.pid}</small>
        </th>);
    },

    renderHeadRow(){


      let propertytypes = this.props.result.type.propertytypes;
      let pKeys = Object.keys( propertytypes);

      let propList = pKeys.map(function(_key){
          return propertytypes[_key];
      });

      // order로 정렬
      propList = propList.sort(function(_A,_B){
        return parseInt(_A.order) > parseInt(_B.order)? 1:-1;
      });


      this.state.columnTypeList = propList;

      return (
        <tr>
          { this.state.columnTypeList.map( this.renderHeadColumn )}
        </tr>
      );
    },

    renderRow(_item){


      return (
        <tr>
          { this.state.columnTypeList.map(function( _type ){
            return (
              <td>
                { typeof _item[_type.pid] !== 'object'? _item[_type.pid]: _item[_type.pid].display !== undefined? _item[_type.pid].display: _item[_type.pid].value}
              </td>
            );
          })}
        </tr>
      );
    },

    renderBodyRows(){
      return (
        this.props.result.items.map( this.renderRow )
      );
    },

    render(){
        var classes = ['ICafeResultTable', this.props.theme];
        console.log(this.props);
        if( this.props.result === null ) return <div> error </div>;

        if( this.props.result.count > 0 ){
          return (
              <div className={classes.join(' ')}>
                <table>
                  <thead>
                    { this.renderHeadRow() }
                  </thead>
                  <tbody>
                    { this.renderBodyRows() }
                  </tbody>
                </table>
              </div>
          )
        } else {
          return <div> another type result </div>
        }

    }
});


 module.exports = ICafeResultTable;
