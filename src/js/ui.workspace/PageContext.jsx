import React from 'react';
import './PageContext.less';
import IFrameStage from './partComponents/IFrameStage.jsx';
import PreviewScene from './PageContext/PreviewScene.jsx';
import GridManageScene from './PageContext/GridManageScene.jsx';

export default React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      stageWidth:1024,
      stageHeight:768,
      selectedElementNode: null,
      currentScene:'grid'
    };
  },
  //
  // getDefaultProps(){
  //   width:0,
  //   height:0
  // },

  goingToContextStop(){
    if (this.state.showElementNavigator) {
      this.closeElementNavigator();
    }

    this.contextController.pause();
  },

  goingToContextRunning(){
    this.contextController.resume();

    this.emit("ContextFocused", {
      contextType: 'page',
      contextController: this.getContextController()
    });
  },

  getContextController(){
    return this.props.contextController;
  },

  feedSaveStateChange(){
    this.emit("ChangedSaveState");
  },

  save(){
    this.getContextController().save();
  },

  getContextType(){
    return this.props.contextType;
  },

  switchGridScene(){
    if( this.state.currentScene !== 'grid' ) this.setState({currentScene:'grid'});
  },

  switchMetaScene(){
    if( this.state.currentScene !== 'meta' ) this.setState({currentScene:'meta'});
  },

  switchPreviewScene(){
    if( this.state.currentScene !== 'preview' ) this.setState({currentScene:'preview'});
  },

  onThrowCatcherAppendNewRow( _eventData ){
    let targetNodeId = _eventData.targetId;

    this.getContextController().modifyAppendNewGrid(targetNodeId, 'row');

    this.forceUpdate();
  },

  onThrowCatcherAppendNewColumn(_eventData){
    let targetNodeId = _eventData.targetId;

    this.getContextController().modifyAppendNewGrid(targetNodeId, 'column');

    this.forceUpdate();
  },

  onThrowCatcherAppendBeforeNewRow(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyAppendBeforeNewGrid(targetNodeId, 'row');

    this.forceUpdate();
  },

  onThrowCatcherAppendAfterNewRow(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyAppendAfterNewGrid(targetNodeId, 'row');

    this.forceUpdate();
  },

  onThrowCatcherAppendBeforeNewColumn(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyAppendBeforeNewGrid(targetNodeId, 'column');

    this.forceUpdate();
  },

  onThrowCatcherAppendAfterNewColumn(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyAppendAfterNewGrid(targetNodeId, 'column');

    this.forceUpdate();
  },

  onThrowCatcherClearGridElement(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyClearGridElement(targetNodeId);

    this.forceUpdate();
  },

  onThrowCatcherRemoveGridElement(_eventData){
    let targetNodeId = _eventData.targetId;
    this.getContextController().modifyRemoveGridElement(targetNodeId);
    
    this.forceUpdate();
  },

  onThrowCatcherAttachFragment(_eventData){
    let targetNodeId = _eventData.targetId;
    let fragmentId = _eventData.fragmentId;

    this.getContextController().modifyGridElementProp(targetNodeId, 'fragmentId', fragmentId);

    this.forceUpdate();
  },

  onThrowCatcherClickElementInStage(_eventData){
    console.log(_eventData);
  },

  onThrowCatcherCreateRootGrid(){
    this.getContextController().modifyCreateRootGrid();

    this.forceUpdate();
  },

  componentWillUpdate(_nextProps, _nextState){
    this.state.prevStageWidth = this.state.stageWidth;
    this.state.prevStageHeight = this.state.stageHeight;

    if (_nextState.sizing !== this.getContextController().getScreenSizing()) {
      this.mustRedrawStage = true;
    }

    // contextController 의 디스플레이모드를 변경한다.
    this.getContextController().setScreenSizing(_nextState.sizing);
  },

  componentDidUpdate(){

    if (this.props.runningState === this.getContextController().running) return;

    if (this.mustRedrawStage) {
      // Todo...

      this.mustRedrawStage = false;
    }

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){

    // contextController 연결
    this.contextController = this.getContextController();
    this.contextController.setContext(this);

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  renderScene(){
    var sceneWidth = (this.state.stageWidth > this.props.width) ? this.props.width : this.state.stageWidth;
    var sceneHeight = (this.state.stageHeight > this.props.height) ? this.props.height : this.state.stageHeight;
    sceneWidth -= 10;
    sceneHeight -= 10;
    var stageX = ( this.props.width - sceneWidth ) / 2;
    var stageY = ( this.props.height - sceneHeight ) / 2;



    if( this.state.currentScene === 'grid' ){
      this.props.contextController.setScreenSize(sceneWidth, sceneHeight-40);

      return <div className="grid-manage-scene">
        <GridManageScene rootGridElement={this.getContextController().getRootGridElement()} left={ stageX } top={ stageY+40 } width={sceneWidth} height={sceneHeight-40}/>
      </div>
    } else if( this.state.currentScene === 'meta' ){
      return <div className="meta-manage-scene">

      </div>
    } else if( this.state.currentScene === 'preview' ){
      return <PreviewScene left={ stageX } top={ stageY+40 } width={sceneWidth} height={sceneHeight-40} page={this.props.contextController.page}/>
    }
  },

  render(){


    var style = {
      display: 'none',
      width: this.props.width,
      height: this.props.height
    };

    if (this.props.runningState) {
      style.display = 'block';
    }



    return (
      <div className='PageContext' style={style}>
        <div className='head-options-bar'>
          <div className='full-area'>
            <ul>
              <li className={this.state.currentScene === 'grid'? "active":""} onClick={this.switchGridScene}>
                <i className='fa fa-th'/>
                <div className='title'>Grid Board</div>
              </li>
              <li className={this.state.currentScene === 'meta'? "active":""} onClick={this.switchMetaScene}>
                <i className='fa fa-cogs'/>
                <div className='title'>Meta Board</div>
              </li>
              <li className={this.state.currentScene === 'preview'? "active":""} onClick={this.switchPreviewScene}>
                <i className='fa fa-rocket'/>
                <div className='title'>Preview</div>
              </li>
            </ul>
          </div>
        </div>

        { this.renderScene() }
      </div>
    )
  }
});
