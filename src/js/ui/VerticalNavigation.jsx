/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function(){
    var Utils = require('../builder.Utils.js'); // 상속 라이브러리 유틸
    var EventEmitter = require('../lib/EventEmitter.js');

    var React = require("react");


    var ReactSekeleton = React.createClass({
        clickNaviItem(e, _naviItem){

            if( this.fold ){
                this.unfoldPanel();
            } else {
                // 한번더 클릭하면 패널을 닫는다.

                this.foldPanel();
                return;
            }

            // panel표시 이벤트 호출
            this.props.onDisplayPanel(_naviItem.itemKey);
        },

        resize( _width ){
            this.getDOMNode().style.width = _width + 'px';

            this.props.onResize(_width);
        },

        foldPanel(){
            this.resize(this.props.naviWidth);

            this.refs['fold-trigger'].getDOMNode().style.display = 'none';
            this.refs['unfold-trigger'].getDOMNode().style.display = 'block';

            this.fold = true;
        },

        unfoldPanel(){
            this.resize(this.props.naviWidth + this.props.panelWidth);

            this.refs['unfold-trigger'].getDOMNode().style.display = 'none';
            this.refs['fold-trigger'].getDOMNode().style.display = 'block';

            this.fold = false;
        },

        naviItemRender( _naviItem ){
            var self = this;
            return (
                <li title={_naviItem.itemTitle} onClick={function(e){ self.clickNaviItem(e, _naviItem); }}>
                    <span className={"glyphicon glyphicon-"+_naviItem.itemIcon}></span>
                </li>
            )
        },

        componentDidMount(){
            this.foldPanel();
        },
        render() {

            this.props.naviItems = this.props.naviItems || [];

            var foldIcon, unfoldIcon;
            if( this.props.panelPosition === 'left' ){
                foldIcon = 'right';
                unfoldIcon = 'left';
            } else {
                foldIcon = 'left';

                unfoldIcon = 'right';
            }


            return (
                <div className={'navigation-with-panel vertical-navigation panel-is-'+this.props.panelPosition+' '+this.props.naviType}>
                    <div className='navigation-area'>
                        <ul className='navigation-bar' style={{width:this.props.naviWidth}}>
                            <li title='fold-panel' onClick={this.foldPanel} ref='fold-trigger' >
                                <span className={"glyphicon glyphicon-chevron-"+foldIcon}></span>
                            </li>
                            <li title='unfold-panel' onClick={this.unfoldPanel} ref='unfold-trigger'>
                                <span className={"glyphicon glyphicon-chevron-"+unfoldIcon}></span>
                            </li>
                        </ul>
                        <div className='seperator'></div>
                        <ul className='navigation-bar'>
                            { this.props.naviItems.map(this.naviItemRender) }

                        </ul>
                    </div>
                    <div className='panel-area'>

                    </div>
                </div>
            );
        }
    });





    module.exports = ReactSekeleton;

})();


