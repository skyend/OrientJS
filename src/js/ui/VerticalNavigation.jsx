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

    var ProjectNavigation = function( _options ){
        Utils.extends(EventEmitter, this);

        this.options = _options;
        this.naviWidth = this.options.naviWidth;
        this.panelWidth = this.options.initialPanelWidth;

        this.fold = false;
    };

    ProjectNavigation.prototype.foldPanel = function() {
        this.realElement.style.width = this.naviWidth + 'px';

        this.insideReactElementSelf.refs['fold-trigger'].getDOMNode().style.display = 'none';
        this.insideReactElementSelf.refs['unfold-trigger'].getDOMNode().style.display = 'block';

        this.fold = true;
    };

    ProjectNavigation.prototype.unfoldPanel = function() {
        this.realElement.style.width = (this.naviWidth + this.panelWidth) + 'px';

        this.insideReactElementSelf.refs['unfold-trigger'].getDOMNode().style.display = 'none';
        this.insideReactElementSelf.refs['fold-trigger'].getDOMNode().style.display = 'block';

        this.fold = false;
    };

    ProjectNavigation.prototype.mountedSkeleton = function( _reactElement, _mountedElement ){
        this.insideReactElementSelf = _reactElement;
        this.realElement = _mountedElement;

        this.foldPanel();
    };

    ProjectNavigation.prototype.getSkeleton = function(){
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.


        var ReactSekeleton = React.createClass({
            clickNaviItem : function(e, _naviItem){

                // 자신의 책임자를 통해 이벤트 Inject 시킨다.
                skeletonOffer.emit('clickNaviItem', {
                    itemKey : _naviItem.itemKey
                });
            },

            foldPanel : function(){
                skeletonOffer.foldPanel();
            },

            unfoldPanel : function(){
                skeletonOffer.unfoldPanel();

            },

            naviItemRender : function( _naviItem ){
                var self = this;
                return (
                    <li title={_naviItem.itemTitle} onClick={function(e){ self.clickNaviItem(e, _naviItem); }}>
                        <span className={"glyphicon glyphicon-"+_naviItem.itemIcon}></span>
                    </li>
                )
            },

            componentDidMount : function(){
                skeletonOffer.mountedSkeleton(this, this.getDOMNode() );
            },
            render: function () {

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
                    <div className={'navigation-with-panel vertical-navigation panel-is-'+this.props.panelPosition}>
                        <div className='navigation-area'>
                            <ul className='navigation-bar'>
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

        return ReactSekeleton;
    }



    module.exports = ProjectNavigation;

})();


