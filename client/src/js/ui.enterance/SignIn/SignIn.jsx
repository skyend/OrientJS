import React from 'react';
import EventDistributor from "../../ui.workspace/reactMixin/EventDistributor.js";

var SignIn = React.createClass({
  mixins: [EventDistributor],
  getInitialState(){
    return {
      message: undefined

    };
  },

  gotoSignup(){
    this.emit("GotoSignUp");
  },

  signin(){
    var id = this.refs['field-id'].getDOMNode().value;
    var password = this.refs['field-password'].getDOMNode().value;

    if (id === '') return this.setState({'message': '아이디를 입력해 주세요.'});
    if (password === '') return this.setState({'message': '비밀번호를 입력해 주세요.'});

    this.setState({'message': <span>처리중입니다.<i className='fa fa-spinner fa-spin'/></span>});

    this.emit("UserSignIn", {
      id: id,
      password: password
    });
  },

  successSignIn(){

    this.setState({'message': <span>로그인 성공</span>});
    this.emit('SuccessSignIn');
  },

  failSignIn(_reason){
    this.setState({'message': <span>로그인 실패. {_reason}</span>});
  },

  render(){
    return (
      <section id="main">
        <header>
          <h1>ICE Service Builder</h1>
        </header>

        <hr />
        <form method="post" action="#">
          <div className="field">
            <input type="text" name="id" placeholder="ID" ref="field-id"/>
          </div>
          <div className="field">
            <input type="password" name="password" placeholder="Password" ref="field-password"/>
          </div>
          <div className='field'>
            { /^.+$/.test(this.state.message) ? <p>{this.state.message}</p> : ''}
          </div>
          <ul className="actions">
            <li><a href="#" className="button" onClick={this.gotoSignup}>SignUp</a></li>
            <li><a href="#" className="button" onClick={this.signin}>SignIn</a></li>
          </ul>
        </form>
      </section>
    )
  }
});


export default SignIn;
