
require('./ICafeResultTable.less');

var React = require("react");

var ICafeResultTable = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getDefaultProps(){
      return {
        result:null,
        propertytypes: null
      }
    },

    getInitialState(){
      return {
        columnTypeList: null
      }
    },

    getSortedPropertytypeList(){
      let self = this;
      let pKeys = Object.keys( this.props.propertytypes );

      let propList = pKeys.map(function(_key){
          return self.props.propertytypes[_key];
      });

      // order로 정렬
      propList = propList.sort(function(_A,_B){
        return parseInt(_A.order) > parseInt(_B.order)? 1:-1;
      });

      return propList
    },

    renderSingleHeadRow(){
      return (<tr>
        <th>
          FieldName
        </th>
        <th>
          Display
        </th>
        <th>
          Value
        </th>
        <th>
          nid
        </th>
      </tr>);
    },

    renderSingleFieldRow(_prop){
      var fieldData = this.props.result[_prop.pid];

      return (
        <tr>
          <td>
            { _prop.name }
          </td>
          <td>
            { fieldData.display || fieldData}
          </td>
          <td>
            { fieldData.value }
          </td>
          <td>
            {fieldData.type}#{ fieldData.nid }
          </td>
        </tr>
      );
    },

    renderSingleBodyRows(){
      let sotedProps = this.getSortedPropertytypeList();
      let self = this;

      return sotedProps.map(function(_prop){
        return self.renderSingleFieldRow(_prop);
      });
    },

    renderMultiHeadColumn(_type){
      return (
        <th>
          { _type.name }
          <br/>
          <small>{_type.pid}</small>
        </th>);
    },

    renderMultiHeadRow(){




      this.state.columnTypeList = this.getSortedPropertytypeList();

      return (
        <tr>
          { this.state.columnTypeList.map( this.renderMultiHeadColumn )}
        </tr>
      );
    },

    renderMultiRow(_item){
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

    renderMultiBodyRows(){
      return (
        this.props.result.items.map( this.renderMultiRow )
      );
    },

    render(){
        let classes = ['ICafeResultTable', this.props.theme];
        console.log(this.props);

        if( this.props.result === null ) return <div> error </div>;

        let mountElement;

        if( this.props.result.count > 0 ){
          mountElement =(
            <table>
              <thead>
                { this.renderMultiHeadRow() }
              </thead>
              <tbody>
                { this.renderMultiBodyRows() }
              </tbody>
            </table>);

        } else if( this.props.result.read == 1){

          mountElement = (
            <table>
              <thead>
                { this.renderSingleHeadRow() }
              </thead>
              <tbody>
                { this.renderSingleBodyRows() }
              </tbody>
            </table>
          );
        } else {
          mountElement = <div> Not supported result type </div>
        }

        return (
          <div className={classes.join(' ')}>
            {mountElement}
          </div>
        )
    }
});


 module.exports = ICafeResultTable;
