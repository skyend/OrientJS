
//using('less');

var BasicButton = React.createClass({
    getDefaultProps: function(){
      return {
          color:"primary",
          size:"normal",
          desc:"blank"
      }
    },
    render : function() {
        var classes = [];
        classes.push('BasicButton');
        classes.push( this.props.color );
        classes.push( this.props.size );
        return (
            <button className={classes.join(' ')}>
                { this.props.desc }
            </button>
        );
    }
});


module.exports = {
  class :BasicButton,
  renderType:'static',
  struct: {},
  positionHints : {
    width:100,
    height:100,
    display:'inline-block'
  }
};
