(function(){
   require('./SubWindowSystem.less');

   var React = require('react');

   var SubWindow = require('./SubWindow.jsx');

   var SubWindowSystem = React.createClass({
      mixins: [require('../reactMixin/EventDistributor.js')],

      getInitialState(){
         return {
            subWindowItems : [1,2,3]
         }
      },


      mapWindowItem( _windowItem ){

         return <SubWindow onThrow={this.getOnThrow()} width={300} height={100} positionX={10} positionY={20} text={_windowItem}/>
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
