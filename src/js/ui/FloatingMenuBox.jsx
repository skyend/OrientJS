/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var MenuItem = {
   title: "",
   type: "button | input | select | ...",
   action: {}
};

(function() {
   var React = require("react");
   require('./FloatingMenuBox.less');

   var MenuItem = React.createClass({
      mixins: [require('./reactMixin/EventDistributor.js')],

      onClick(_e){
         this.emit(this.props.eventName, {}, _e, "ReactMouseClick");
      },

      render(){

         return (
            <li className={this.props.type} onClick={this.onClick}>  {this.props.title} </li>
         );
      }
   });

   var FloatingMenuBox = React.createClass({
      mixins: [require('./reactMixin/EventDistributor.js')],

      getInitialState() {

         return {
            display: "off",
            x: 0,
            y: 0,
            memuItems: [
            
            ]
         };
      },



      menuItemRender(_item) {
         if( typeof _item === "object" ){
            return <MenuItem ref={ _item.key } title={_item.title} type={_item.type} eventName={_item.eventName} />;
         } else if( _item === 'spliter' ) {
            return <hr/>
         }
      },

      componentDidMount() {},

      render() {
         var styles = {
            display: "none"
         };

         if (this.state.display === 'off') {
            styles.display = "none";
         } else if (this.state.display === "on") {
            styles.display = "block";
         }

         styles.left = this.state.x + "px";
         styles.top = this.state.y + "px";

         return (
            <div className='FloatingMenuBox black' style={styles}>
               <div className='header'>
                  Stage Context Menu
               </div>
               <div className='body'>
                  <ul>
                     {this.state.memuItems.map(this.menuItemRender)}
                  </ul>
               </div>
            </div>
         );
      }
   });

   module.exports = FloatingMenuBox;

})();
