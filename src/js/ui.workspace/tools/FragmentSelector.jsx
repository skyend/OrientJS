let React = require('react');
let HorizonField = require('../partComponents/HorizonField.jsx');
let OutlineButton = require('../partComponents/OutlineButton.jsx');
let GridBox = require("../partComponents/GridBox.jsx");
import './FragmentSelector.less';



export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message:'Select fragment',
      fragments:null
    }
  },

  cancel(){
    this.emit("Close");
  },

  select(){
    if( this.state.fragments === null ){
      this.setState({message:"아직 fragment 리스트가 로딩 중 입니다."})
      return;
    }

    let fragmentId = this.refs['fragmentId'].getValue();
    if( fragmentId === '' ){
      this.setState({message:"정상적인 값을 선택해 주세요."});
      return;
    }

    this.props.params['input-data-callback'](fragmentId);
    this.emit("Close");
  },

  renderFragmentSelector(){
    if( this.state.fragments === null ){
      return (
        <div>
          <i className="fa fa-spinner fa-pulse loading"/>
        </div>
      );
    }

    let options = this.state.fragments.map(function(_fragment){
      return {
        value: _fragment._id,
        title: _fragment.title
      };
    });

    options.unshift({
      value:'',
      title:'선택되지않음'
    });

    return <HorizonField fieldName='fragmentId' title='Fragment' theme="dark" enterable={true} type='select'
                  onChange={ this.onChange }
                  options={options}
                  defaultValue={''} height={40} ref='fragmentId'
                  nameWidth={150}/>;
  },

  componentDidMount(){
    this.emit("NeedDocumentList");
  },

  render(){


    return (
      <div className='FragmentSelector'>
        <div className='fields'>
          { this.renderFragmentSelector() }
        </div>

        <div className='message'>
          {this.state.message}
        </div>

        <div className='buttons'>
          <OutlineButton color='red' title='Cancel' width="70" height="40" onClick={this.cancel}/>
          <OutlineButton color='blue' title='Select' width="70" height="40" onClick={this.select}/>
        </div>
      </div>
    )
  }
});
