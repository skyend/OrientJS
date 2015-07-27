(function(){
   require('./SubWindow.less');

   var React = require('react');

   var Position = function(){
      this.x = 0;
      this.y = 0;
   }

   var SubWindowSystem = React.createClass({
      mixins: [require('../reactMixin/EventDistributor.js')],

      getDefaultProps(){
         return {
            positionX : 0,
            positionY : 0,
            width:300,
            height:200
         };
      },

      getInitialState(){
         return {
            theme: 'black',
            title : 'temp',
            fullScreen:false,
            x: 0,
            y: 0
         };
      },

      closeMe(){

      },

      minimalize(){

      },


      toggleFullScreen(){

         if( this.state.fullScreen ){
            this.setState({fullScreen:false});
         } else {
            this.setState({fullScreen:true});
         }

      },

      styleProcFullScreen( _style ){

         if( this.state.fullScreen ){

            _style.width = 'auto';
            _style.height = 'auto';
            _style.left = "0px";
            _style.right = "0px";
            _style.top = "0px";
            _style.bottom = "0px";
         } else {

            _style.width = this.props.width + 'px';
            _style.height = this.props.height + 'px';
            _style.left = this.state.x + 'px';
            _style.top = this.state.y + 'px';
         }

         return _style;
      },


      onMouseDownToHeader(){

         if( !this.state.fullScreen ){
            // GlobalDrag 자원 획득( 획득한 자원은 반드시 반환하고 상태를 종료 해주어야 한다.)
            app.ui.occupyGlobalDrag(this);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();
         }
      },

      onGlobalDragStartFromUI(_e){
      },

      onGlobalDragFromUI(_e){

          if( typeof this.prevMouseX !== 'undefined' ){
             var selfDom = this.getDOMNode();
             var ymoveStep = this.prevMouseY - _e.clientY;
             var xmoveStep = this.prevMouseX - _e.clientX;

             this.setState({x: this.state.x - xmoveStep, y: this.state.y - ymoveStep});
          }

          this.prevMouseY = _e.clientY;
          this.prevMouseX = _e.clientX;
      },

      onGlobalDragStopFromUI(_e){
         console.log('return');

          /* Global Drag 자원 반환 */
          app.ui.disableGlobalDrag();
          app.ui.returnOccupyMouseDown();
          app.ui.returnOccupiedGlobalDrag();
          //this.emit('StoppedDrag', {}, _e, "MouseEvent");

          this.prevMouseY = undefined;
          this.prevMouseX = undefined;
      },


      render(){


         var classes = ['SubWindow', this.state.theme];
         var styles = {};

         styles = this.styleProcFullScreen(styles);


         return (
            <div className={classes.join(' ')} style={styles}>
               <div className='head-title-bar' onMouseDown={this.onMouseDownToHeader}>
                  <div className='title'>
                     { this.state.title }
                  </div>
                  <div className='left-area'>
                     <ul>
                        <li onClick={this.closeMe}>
                           <i className='fa fa-times'></i>
                        </li>
                        <li onClick={this.toggleFullScreen}>
                           <i className={ this.state.fullScreen? 'fa fa-square-o':'fa fa-plus'}></i>
                        </li>
                        <li onClick={this.minimalize}>
                           <i className='fa fa-minus'></i>
                        </li>
                     </ul>
                  </div>
                  <div className='right-area'>

                  </div>
               </div>
               <div className='window-description'>
                  {this.props.text}
               </div>
            </div>
         );
      }
   });

   module.exports = SubWindowSystem;
})();
