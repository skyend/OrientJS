/**
 * InputBoxWithSelector ReactClass
 *
 *  선택상자가 부착된 input 박스
 *
 * Requires : InputBoxWithSelector.less, ReactJS
 *
 * Event:
 *   onChanged( my field name, changed value)
 *   onKeyUp( _e )
 *
 * Props:
 *   fieldName : "emul-ip-address"
 *     뛰어쓰기를 지양하는 필드의 unique한 id
 *
 *   selectorItems : ['value1', 'value2', ... ]
 *     필드의 선택가능한 입력 문자열의 배열
 *
 *   autoLoad : "http://.."
 *   moreLoadCursor :
 */


(function () {
    require('./InputBoxWithSelector.less');
    var React = require("react");

    var ReactClass = React.createClass({
        getInitialState() {
            return {
                valueControl: undefined,
                spreadDisplay: 'none',
                itemCursor: -1
            }
        },

        getItemElement(_item, _index) {
            var classes = [];

            if (this.state.itemCursor === _index) {
                classes.push('cursor-here');
            }

            return (<li className={classes.join(' ')} value={_item} onClick={this.selectItem} data-index={_index} >{ _item }</li>)
        },

        onKeyUp(_e) {
            switch (_e.nativeEvent.keyCode) {

                /* Arrow Down */
                case 40 :
                    if (this.state.spreadDisplay === 'block') {
                        this.cycleItemCursor('down');
                    } else {
                        this.toggleSpread();
                    }
                    break;

                /* Arrow Up */
                case 38 :
                    if (this.state.spreadDisplay === 'block') {
                        var cursorResult = this.cycleItemCursor('up');
                        if (cursorResult == -1) {
                            this.toggleSpread();
                        }
                    }
                    break;

                /* Enter */
                case 13 :
                    if (this.state.spreadDisplay === 'block') {
                        this.setValue(this.props.selectorItems[this.state.itemCursor]);
                        this.toggleSpread();
                    }
            }

            if( typeof this.props.onKeyUp === 'function' ){
                this.props.onKeyUp( _e );
            }
        },

        cycleItemCursor(_direct) {
            var currentCursor = this.state.itemCursor;
            var nextCursor;
            if (_direct === 'down') {
                nextCursor = currentCursor + 1;

                if (nextCursor >= this.props.itemCount) return -1;
            } else {
                nextCursor = currentCursor - 1;

                if (nextCursor < 0) return -1;
            }

            this.setState({itemCursor: nextCursor});
            return nextCursor;
        },


        inputClick(){
            // 인풋박스에 직접 입력할 수 없도록 설정된 경우 toggleSpread를 호출하여 셀렉트 리스트를 토글한다.
            if( this.props.dontEnter == true ){
                this.toggleSpread();
            }
        },

        toggleSpread() {
            if (this.state.spreadDisplay === 'block') {
                this.setState({spreadDisplay: 'none'});
            } else {
                this.setState({spreadDisplay: 'block'});
            }
        },

        selectItem(_e) {
            this.toggleSpread();

            this.setValue(_e.target.getAttribute('value'));
            this.setState({itemCursor: parseInt(_e.target.getAttribute('data-index'))});
        },

        setValue(_value) {
            this.refs['input'].getDOMNode().value = _value;
            this.changedValue();
        },

        changedValue() {
            var value = this.refs['input'].getDOMNode().value;

            this.props.value = value;

            if (typeof this.props.onChanged === 'function') {
                this.props.onChanged(this.props.fieldName, value);
            }
        },

        componentDidMount() {

            if (typeof  this.props.selectorItems === 'object') {
                this.setValue(this.props.selectorItems[0]);
            }
        },

        componentDidUpdate(prevProps, prevState) {
            if (typeof prevState.valueControl !== 'undefined') {
                console.log(prevState.valueControl);
            }
        },

        render() {
            var classes = ['InputBoxWithSelector', this.props.color]

            if (typeof this.props.selectorItems === 'object') {
                this.props.itemCount = this.props.selectorItems.length;
            } else {
                this.props.itemCount = 0;
            }



            return (
                <div className={classes.join(' ')}>
                    <div className="input-wrapper">
                        <input autoComplete="off" className={this.props.dontEnter? 'clickable':''} onClick={this.inputClick} onKeyUp={this.onKeyUp} onChange={this.changedValue} ref='input' disabled={this.props.dontEnter}/>
                        <div className='spread-out' onClick={this.toggleSpread} >
                            <i className='fa fa-sort-down'></i>
                        </div>

                        <div className="selector-wrapper" style={{'display': this.state.spreadDisplay}} ref='spread'>
                            <ul className='selector'>
                                { this.props.selectorItems.map(this.getItemElement)}
                            </ul>
                        </div>
                    </div>

                </div>
            )
        }
    });


    module.exports = ReactClass;

})();
