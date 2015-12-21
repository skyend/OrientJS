import React from 'react';
import './Column.less';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0,
      name:'scriptCanvas',
      folding:false, // 접기
    };
  },

  fold(){
    this.emit("Fold");
  },

  unfold(){
    this.emit("Unfold")
  },

  renderReactElement(){
    if( !this.props.folding){

      return <div className='element-zone'>
        {this.props.reactElement}
      </div>
    } else {
      return '';
    }
  },

  renderTopArea(){
    if( this.props.folding ){
      return (
        <div className='top-area'>
          <ul className='navigator right-navigator'>
            <li onClick={this.unfold}>
              <i className='fa fa-toggle-off'/>
            </li>
          </ul>
        </div>
      )
    }
    let self = this;

    return (
      <div className='top-area'>
        <div className='title'>
          {this.props.name}
        </div>

        <ul className='navigator right-navigator'>
          <li className='button' onClick={this.fold}>
            <i className='fa fa-toggle-on'/>
          </li>
        </ul>
      </div>
    );
  },

  renderFoldingHolder(){
    return (
      <div className='folding-holder'>
        <i className={'fa fa-'+ this.props.icon}/>
      </div>
    )
  },

  render(){
    let classes = ['Column'];
    let style = {
      width: this.props.width,
      height: this.props.height,
      //left: this.props.left,
      top: this.props.top
    };

    return (
      <div className={classes.join(' ')} style={style}>
        {this.renderTopArea()}
        {this.props.folding? this.renderFoldingHolder():''}
        {this.renderReactElement()}

      </div>
    )
  }
});
