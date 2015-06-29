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

    var HelperNavigation = function(){

    };

    HelperNavigation.prototype.getSkeleton = function(){
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.


        var ReactSekeleton = React.createClass({
            render: function () {
                return (
                    <div class='panel-include-navigation'>
                        <div class='navigation-area'>
                            <ul class='vertical-navigation'>

                            </ul>
                        </div>
                        <div class='panel-area panel-is-left'>

                        </div>
                    </div>
                );
            }
        });

        return ReactSekeleton;
    }



    module.exports = HelperNavigation;

})();


