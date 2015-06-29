/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function(){

    var React = require("react");

    var BuilderNavigation = function(){

    };

    BuilderNavigation.prototype.getSkeleton = function(){
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.


        var ReactSekeleton = React.createClass({
            render: function () {
                return (
                    <ul className="nav navbar-right">
                        <li>
                            <a>
                                <i className="fa fa-columns"></i>
                            </a>
                        </li>
                    </ul>
                )
            }
        });

        return ReactSekeleton;
    }



    module.exports = BuilderNavigation;

})();


