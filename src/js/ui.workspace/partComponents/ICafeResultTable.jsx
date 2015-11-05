require('./ICafeResultTable.less');

var React = require("react");

var ICafeResultTable = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      result: null,
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
    let pKeys = Object.keys(this.props.propertytypes);

    let propList = pKeys.map(function (_key) {
      return self.props.propertytypes[_key];
    });

    // order로 정렬
    propList = propList.sort(function (_A, _B) {
      return parseInt(_A.order) > parseInt(_B.order) ? 1 : -1;
    });

    return propList
  },

  onClickPager(_e){
    var pagenumber = _e.target.getAttribute('data-pagenum');


    this.emit("GoToPage", {
      to: pagenumber
    });
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

    return sotedProps.map(function (_prop) {
      return self.renderSingleFieldRow(_prop);
    });
  },

  renderMultiPagenation(){
    if (this.props.result.page === undefined) return "";
    let current = this.props.result.page.current;
    let pages_count = this.props.result.page.pages.length;

    let start_point = Math.max(current - 3, 1);
    let end_point = Math.min(pages_count - 1, current + 4);


    var pagerButtonList = [];

    for (var i = start_point; i < end_point; i++) {
      var classes = [];

      if (current == i) {
        classes.push('current');
      }

      pagerButtonList.push(<button className={classes.join(' ')} data-pagenum={i}
                                   onClick={this.onClickPager}>{i}</button>);
    }

    return (
      <div className='pagenation'>
        {pagerButtonList}
      </div>);
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
        <th> No.</th>
        { this.state.columnTypeList.map(this.renderMultiHeadColumn)}
      </tr>
    );
  },

  renderMultiRow(_item, _i){

    let order = _i + 1;

    if (this.props.result.page !== undefined) {
      order += this.props.result.page.count * this.props.result.page.current;
    }

    return (
      <tr>
        <td>{order}</td>
        { this.state.columnTypeList.map(function (_type) {
          return (
            <td>
              { typeof _item[_type.pid] !== 'object' ? _item[_type.pid] : _item[_type.pid].display !== undefined ? _item[_type.pid].display : _item[_type.pid].value}
            </td>
          );
        })}
      </tr>
    );
  },

  renderMultiBodyRows(){
    return (
      this.props.result.items.map(this.renderMultiRow)
    );
  },

  renderMulti(){
    return (
      <div className='wrapper'>
        <div className='header'>
          <span className='text-wrapper'>List Result Sheet <small> Count : {this.props.result.count} </small> </span>
        </div>
        <div className='body'>
          <table>
            <thead>
            { this.renderMultiHeadRow() }
            </thead>
            <tbody>
            { this.renderMultiBodyRows() }
            </tbody>
          </table>
        </div>
        <div className='foot'>
          { this.renderMultiPagenation() }
        </div>
      </div>);
  },

  renderSingle(){
    return (
      <div className='wrapper'>
        <div className='header'>
          <span className='text-wrapper'>Single Result Sheet</span>
        </div>
        <div className='body'>
          <table>
            <thead>
            { this.renderSingleHeadRow() }
            </thead>
            <tbody>
            { this.renderSingleBodyRows() }
            </tbody>
          </table>
        </div>
      </div>);

  },

  renderObjectHeadRow(){
    return (
      <tr>
        <th> FieldAccessKey</th>
        <th> Value</th>
      </tr>
    );
  },

  renderObjectRow(_item, _path){
    let currentPath = _path;

    if (_path !== undefined) {
      currentPath = _path + '/' + _item.fieldName;
    }


    return (
      <tr>
        <td title={_item.fieldName}>
          {_item.fieldName }
          { currentPath ? (<code className='hidden'> { currentPath } </code>) : '' }
        </td>
        <td> {typeof _item.fieldValue === 'object' ? this.renderObject(_item.fieldValue, currentPath) : _item.fieldValue } </td>
      </tr>
    );
  },

  renderObjectBodyRows(_object, _path){
    let self = this;
    var convertedToArray = Object.keys(_object).map(function (_key) {
      return {
        fieldName: _key,
        fieldValue: _object[_key]
      };
    });

    return convertedToArray.map(function (_item) {
      return self.renderObjectRow(_item, _path)
    })

  },

  renderObject(_object, _path){
    return (
      <table>
        <thead>
        { this.renderObjectHeadRow() }
        </thead>
        <tbody>
        { this.renderObjectBodyRows(_object, _path) }
        </tbody>
      </table>);
  },

  renderUnknown(_object){
    return (
      <div className='wrapper'>
        <div className='header'>
          <span className='text-wrapper'>Not supported result type Sheet</span>
        </div>
        <div className='body'>
          {this.renderObject(_object, '')}
        </div>
      </div>);
  },

  renderContent(){

    if (this.props.result.count >= 0) {
      return this.renderMulti();
    } else if (this.props.result.read == 1) {
      return this.renderSingle();
    } else {
      return this.renderUnknown(this.props.result);
      //return <div> Not supported result type <pre>{stringify(this.props.result)}</pre> </div>
    }

  },

  render(){
    let classes = ['ICafeResultTable', this.props.theme];
    console.log(this.props);

    if (this.props.result === null) return <div className={classes.join(' ')}> Error
      <pre>{stringify(this.props.result)}</pre>
    </div>;

    return (
      <div className={classes.join(' ')}>
        {this.renderContent()}
      </div>
    )
  }
});

function stringify(_object) {
  if (typeof _object !== 'object') return _object;

  if (_object !== undefined) {
    return JSON.stringify(_object);
  } else {
    return "undefined";
  }
}


module.exports = ICafeResultTable;
