var React = require('react');

var DropSupporter = React.createClass({

  render(){
    return (
      <div style={{width:100, height:100}}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10">
          <g clip-path="url(#p.0)">
            <path fill="#cfe2f3" d="m96.0 8.0l-24.0 24.0l-40.0 0l0 40.0l-24.0 24.0l0 -88.0z" fill-rule="nonzero" />
            <path fill="#cfe2f3" d="m32.0 32.0l40.0 0l0 16.0l-40.0 0z" fill-rule="nonzero" />
            <path fill="#cfe2f3" d="m32.0 56.0l40.0 0l0 16.0l-40.0 0z" fill-rule="nonzero" />
            <path fill="#cfe2f3" d="m96.0 8.0l-24.0 24.0l0 40.0l-40.0 0l-24.0 24.0l88.0 0z" fill-rule="nonzero" />
          </g>
        </svg>
      </div>
    )
  }
});


module.exports = DropSupporter;
