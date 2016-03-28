var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');

var RefTypeElementNode = React.createClass({
  mixins: [
    require('../../reactMixin/EventDistributor.js'),
    require('../mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      elementNode: null
    };
  },

  getInitialState(){
    return {
      loaded : false,
      availableTargetList: null
    }
  },

  onThrowCatcherChangedValue(_eventData, _pass){
    if( _eventData.name === 'refType' ){
      this.loadTargetList(_eventData.data);
    }

    _pass();
  },

  loadTargetList(_type){
    let that = this;

    this.setState({loaded:false, availableTargetList:null});


    if( _type === 'ElementNode' ){
      this.emit('NeedSharedElementNodeList', {
        callback: function(_sharedElementNodeList){
          console.log(_sharedElementNodeList);

          that.setState({loaded:true, availableTargetList:_sharedElementNodeList});
        }
      });
    } else if (_type === 'Fragment'){
      this.emit("NeedDocumentList", {
        callback: function(_fragmentList){
          console.log(_fragmentList);

          that.setState({loaded:true, availableTargetList:_fragmentList});
        }
      });
    }
  },

  getTargetOptionList(){
    if( this.state.loaded === false ){
      return [];
    }

    if( this.props.elementNode.refType === 'Fragment' ){
      let list = this.state.availableTargetList.map(function(_fragment){
        return {
          value: _fragment._id,
          title: _fragment.title
        };
      });

      list.unshift({
        value:'',
        title:'없음'
      });

      return list;
    } else if (this.props.elementNode.refType === 'ElementNode' ){
      return [{ value:'', title:'미확정'}];
    }
  },


  isAvailableTargetListLoaded(){
    return this.state.loaded;
  },

  componentDidMount(){
    this.loadTargetList( this.props.elementNode.refType);
  },

  render() {
    var rootClasses = ['part', this.props.theme, this.getMySizeClass()];
    var elementNode = this.props.elementNode;

    let fieldSet = [];
    fieldSet.push({
      "name": "refType",
      title: "참조 타입",
      initialValue: elementNode.refType,
      type:'select',
      options: [
        {value:'NONE', title:'없음'},
        {value:'ElementNode', title:"공통요소"},
        {value:'Fragment', title:"프래그먼트"}
      ],
      enterable: true
    });

    if( elementNode.refType !== 'NONE' ){
      fieldSet.push({
        "name": "refTargetId",
        title: "참조 대상",
        loading: !this.isAvailableTargetListLoaded(),
        initialValue: elementNode.refTargetId,
        type:'select',
        options: this.getTargetOptionList(),
        enterable: true
      });
    }


    return (
      <div className={rootClasses.join(' ')}>
        <HorizonFieldSet title="Refference Properties" theme='dark' nameWidth={130} fields={ fieldSet } ref='refComponentProps'/>
      </div>
    );
  }
});

export default RefTypeElementNode;
