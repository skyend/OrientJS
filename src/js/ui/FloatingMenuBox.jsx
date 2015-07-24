/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var React = require("react");
    require('./FloatingMenuBox.less');

    var FloatingMenuBox = React.createClass({
        mixins:[ require('./reactMixin/EventDistributor.js') ],

        getInitialState(){

            return {
               display:"off",
               x:0,
               y:0,
               memuItems : [
                  { title : "Delete", type:"button", action:{ name:"", type:"" } },
                  { title : "Clone", type:"button", action:{ name:"", type:"" } },
                  { title : "Edit", type:"button", action:{ name:"", type:"" } },
                  "spliter",
                  { title : "Select Parent", type:"button", action:{ name:"", type:"" } }
               ]
            };
        },


        menuItemRender( _item ){
           return <li> _item </li>
        },

        componentDidMount(){

        },

        render() {
            var styles = {
               display:"none"
            };

            if( this.state.display === 'off' ){
               styles.display = "none";
            } else if ( this.state.display === "on" ){
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
                           { this.state.memuItems.map(this.menuItemRender) }
                        </ul>
                    </div>
                </div>
            );
        }
    });

    module.exports = FloatingMenuBox;

})();
