import React from 'react';
import EventDistributor from "../../ui.workspace/reactMixin/EventDistributor.js";
import CSS from './Lobby.useable.less';
import avatarImage from '../../../images/avatar.jpg';

var Lobby = React.createClass({
    mixins:[EventDistributor],
    getInitialState(){
      return {
        'user-info':{},
        'project-list':[],
        'message':undefined,
        selectedProject:null
      };
    },

    cancel(){
      this.emit("ReturnSignIn");
    },

    signout(){
      this.emit("UserSignout");
    },

    newProject(){
      var name = this.refs['field-new-project-name'].getDOMNode().value;
      if(! /^[\w\s]+$/.test(name) ) return this.setState({message:'프로젝트명을 입력해 주세요.'});


      this.emit("CreateNewProject", {
        name: name
      });

      this.requestGiveMeData(['project-list']);
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

    selectProject( _project ){
      this.setState({selectedProject:_project});
      this.emit("NeedServiceListOfProject", {
        project_real_id:_project._id
      });
    },

    componentDidMount(){
      var self = this;
      setTimeout(function(){
        self.requestGiveMeData(['user-info', 'project-list'])
      }, 200);
    },

    componentWillMount(){
      CSS.use();

    },

    componentWillUnmount(){
      CSS.unuse();
    },



    renderProjectItem(_project){
      var self = this;
      var selected = false;
      if( this.state.selectedProject !== null && this.state.selectedProject._id === _project._id){
        selected = true;
      }

      return (
        <li className={selected? "selected":''} onClick={function(){self.selectProject(_project)}}>
          { _project.name }
        </li>
      )
    },

    renderProjectList(){
      if( this.state['user-info'] === null ) return '';

      return (
        <div className='column'>
          <div className='row-division'>
            <form method="post" action="#">
              <div className="field">
                <input type="text" name="new-project-name" placeholder="Project Name" ref="field-new-project-name"/>
              </div>
              <ul className="actions">
                <li><a href="#" className="button" onClick={this.newProject}>add new Project</a></li>
              </ul>
            </form>
          </div>
          <div className='row-division'>
            <ul>
              {this.state['project-list'].map(this.renderProjectItem)}
            </ul>
          </div>

        </div>
      )
    },

    renderServiceList(){
      if( this.state.selectedProject === null ) return '';
      return (
        <div className='column'>
          <div className='row-division'>
            <form method="post" action="#">
              <div className="field">
                <input type="text" name="new-service-name" placeholder="Service Name" ref="field-new-service-name"/>
              </div>
              <ul className="actions">
                <li><a href="#" className="button" onClick={this.newService}>add new Service</a></li>
              </ul>
            </form>
          </div>
          <div className='row-division'>
            <ul>
              <li>
                Test
              </li>
              <li>
                Test2
              </li>
            </ul>
          </div>
        </div>
      )
    },

    render(){
      console.log(this.state);
      return (
				<section id="main">

					<header>
						<h1>ICE Service Builder Lobby</h1>
					</header>
          <h4>{this.state.message}</h4>
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

            {this.renderProjectList()}

            { this.renderServiceList() }
          </div>

				</section>
      )
    }
});


export default Lobby;
