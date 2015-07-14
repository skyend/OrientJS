/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var $ = require('jquery');

(function () {
    require('./Contents.less');
    var React = require("react");
    var Contents = React.createClass({
        getDefaultProps(){
            return {
                tabItemList : [
                    { id:'a' , name: 'tab test'},
                    { id:'b' , name: 'tab test2'}
                ]
            }
        },
        clickTabItem( _tabID ){
            console.log(_tabID);
        },
        clickTabAdd(){
            console.log('tab add');
        },

        componentDidMount(){
            var before_select_id = '#index-iframe';
            var now_select_id;

            $('.tab-area > li').on('click', function (e) {
                now_select_id = '#' + e.target.id + '-iframe';
                if (now_select_id != before_select_id) {
                    $(before_select_id).hide();
                    $(now_select_id).show();
                    before_select_id = now_select_id;
                } else {
                    $(now_select_id).show();
                    before_select_id = now_select_id;
                }
            });
        },

        getTabItemElement( _tabItem ){
            var self = this;
            var _tabID = _tabItem.id;

            var closure = function(){
                self.clickTabItem( _tabID);
            };

            return (
                <li onClick={closure}>{_tabItem.name}</li>
            )
        },

        render: function () {
            return (
                <section className="Contents Contents-tab-support black" id="ui-contents">
                    <div className='tab-switch-panel'>
                        <ul className='tab-list' ref='tab-list'>
                            { this.props.tabItemList.map( this.getTabItemElement )}
                            <li onClick={this.clickTabAdd}><i className='fa fa-plus'></i></li>
                        </ul>
                    </div>

                    <div className='tab-context'>
                        <iframe src='//getbootstrap.com/examples/non-responsive/'></iframe>
                    </div>

                </section>
            )
        }
    });

    module.exports = Contents;

})();


