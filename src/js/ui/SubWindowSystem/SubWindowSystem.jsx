(function(){
   require('./SubWindowSystem.less');

   var React = require('react');

   var SubWindow = require('./SubWindow.jsx');

   var windowRefPrefix = "subWindow";

   var SubWindowSystem = React.createClass({
      mixins: [require('../reactMixin/EventDistributor.js')],

      getInitialState(){
         return {
            subWindowItems : [{
               empty:false,
               key:"A",
               desc: "A"
            },{
               empty:false,
               key:"B",
               desc: "B"
            },{
               empty:false,
               key:"C",
               desc: "C"
            }],
            startZIndex: 10
         }
      },

      onThrowCatcherFocusedMe(_eventData, _pass){
         console.log(arguments);
         var focusedWindowRef = _eventData.refPath[0];


      },

      onThrowCatcherCloseMe( _eventData, _pass ){
         var windowRef = _eventData.myRef;

         var filteredSubWindowItems = this.state.subWindowItems;

         for(var i = 0; i < filteredSubWindowItems.length; i++ ){
            var item = this.state.subWindowItems[i];

            if( windowRef === item.key ){
               filteredSubWindowItems[i] = { empty:true };
            }
         }

         this.setState({subWindowItems: filteredSubWindowItems});
      },




      mapWindowItem( _windowItem, _i ){
         if( _windowItem.empty ){
            return <div style={{display:'none'}}/>
         } else {
            return <SubWindow ref={ _windowItem.key } width={300} height={100} positionX={10} positionY={20} text={_windowItem.desc}/>
         }
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
