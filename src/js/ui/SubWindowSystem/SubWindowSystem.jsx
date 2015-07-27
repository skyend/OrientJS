(function(){
   require('./SubWindowSystem.less');

   var React = require('react');

   var SubWindow = require('./SubWindow.jsx');

   var windowRefPrefix = "subWindow";

   var SubWindowSystem = React.createClass({
      mixins: [require('../reactMixin/EventDistributor.js')],

      getInitialState(){
         return {
            subWindowItems : [1,2,3],
            startZIndex: 10
         }
      },

      onThrowCatcherFocusedMe(_eventData, _pass){
         console.log(arguments);
         //var focusedWindowRef = _eventData.refPath[0];


      },

      mapWindowItem( _windowItem, _i ){
         console.log(_i);
         return <SubWindow ref={windowRefPrefix+_i} width={300} height={100} positionX={10} positionY={20} text={_windowItem}/>
      },


      render(){
         return (
            <div className='SubWindowSystem'>
               { this.state.subWindowItems.map( this.mapWindowItem ) }
            </div>
         );
      }
   });

   module.exports = SubWindowSystem;
})();
