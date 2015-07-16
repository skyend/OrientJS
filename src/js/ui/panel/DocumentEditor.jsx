/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./DocumentEditor.less');

    var React = require("react");
    var ReactAce = require('react-ace');

    require('brace/mode/html');
    require('brace/theme/monokai');

    var reactClass = React.createClass({
        getInitialState(){
            return {
                documentText:"<html> Wating for load.. </html>"
            }
        },

        getDefaultProps(){
            return {
                width:0,
                height:0
            }
        },

        changeDocumentText(_value){
            if( typeof this.props.onChange === 'function'){
                this.props.onChange(_value);
            }
        },

        render() {
            return (
                <div className='DocumentEditor night-dark'>
                    <div className='header'>
                        <div className='block-area'>
                            <ul>
                                <li></li>
                            </ul>

                        </div>
                        <div className='block-area'>

                        </div>

                    </div>
                    <div className='body'>
                        <div className='ReactAceContainer'>
                            <ReactAce mode="html"
                                      theme="monokai"
                                      width='100%'
                                      height='100%'
                                      value={this.state.documentText}
                                      onChange={this.changeDocumentText}
                                      ref='ace'/>
                        </div>
                    </div>

                </div>
            );
        }
    });
    module.exports = reactClass;
})();
