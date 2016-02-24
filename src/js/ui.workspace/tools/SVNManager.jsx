import React from "react";
import './StandAlonePublisher.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var SVNManager = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {

    }
  },


  render(){
    var classes = ['SVNManager'];


    return (
      <div className={classes.join(' ')}>

  

      </div>
    )
  }
});

export default SVNManager;
