import React from 'react';
import EventDistributor from "../../ui.workspace/reactMixin/EventDistributor.js";
import CSS from './Lobby.useable.less';
import avatarImage from '../../../images/avatar.jpg';

var Lobby = React.createClass({
    mixins:[EventDistributor],
    getInitialState(){
      return {
        'user-info':{}
      };
    },

    cancel(){
      this.emit("ReturnSignIn");
    },

    signout(){
      this.emit("UserSignout");
    },

    setData(_fieldName, _data){
      console.log('recieve data', _fieldName, _data);
      var state = {};
      state[_fieldName] = _data;

      this.setState(state);
    },

    requestGiveMeData(_dataFieldNames){
      this.emit('GiveMeData',{
        fieldNames:_dataFieldNames,
      });
    },

    componentDidMount(){
      var self = this;
      setTimeout(function(){
        self.requestGiveMeData(['user-info', 'project-info'])
      }, 200);
    },

    componentWillMount(){
      CSS.use();

    },

    componentWillUnmount(){
      CSS.unuse();
    },

    render(){
      console.log(this.state);
      return (
				<section id="main">

					<header>
						<h1>ICE Service Builder Lobby</h1>
					</header>

          <div className='horizon-parts'>
            <div className='column'>
              <div className="profile">
                <div className='user-avatar'>
                  <img src={avatarImage} alt="" />
                </div>
              </div>
              <h1>{this.state['user-info'].name || this.state['user-info'].userid}</h1>
              <h3>{this.state['user-info'].email}</h3>
              <a href="#" className="button" onClick={this.signout}>Sign Out</a>
            </div>
            <div className='column'>
a
            </div>
            <div className='column'>
a
            </div>
          </div>

				</section>
      )
    }
});


export default Lobby;
