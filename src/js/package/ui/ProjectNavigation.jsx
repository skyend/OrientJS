/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function(){

    var React = require("react");

    var ProjectNavigation = function(){

    };

    ProjectNavigation.prototype.getSkeleton = function(){
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.


        var ReactSekeleton = React.createClass({
            render: function () {
                return (
                    <nav class="menu">
                        <ul id="menu-list" className="menu-list">
                            <li>
                                <a id="menu-1">
                                    <i className="glyphicon glyphicon-th"></i>
                                </a>
                            </li>
                            <li>
                                <a id="menu-2">
                                    <i className="fa fa-desktop"></i>
                                </a>
                            </li>
                        </ul>
                        <ul className="menu-list">
                            <li>
                                <a>
                                    <i className="fa fa-folder-open"></i>
                                </a>
                            </li>
                            <li>
                                <a>
                                    <i className="fa fa-search"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                )
            }
        });

        return ReactSekeleton;
    }



    module.exports = ProjectNavigation;

})();


