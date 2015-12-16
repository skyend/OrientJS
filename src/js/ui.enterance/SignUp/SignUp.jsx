let React = require('react');
let EventDistributor = require("../../ui.workspace/reactMixin/EventDistributor.js");

var SignUp = React.createClass({
  mixins: [EventDistributor],

  getInitialState(){
    return {
      message: undefined

    };
  },

  cancel(){
    this.emit("ReturnSignIn");
  },

  submit(){
    var id = this.refs['field-id'].getDOMNode().value;
    var email = this.refs['field-email'].getDOMNode().value;
    var name = this.refs['field-name'].getDOMNode().value;
    var password = this.refs['field-password'].getDOMNode().value;
    var conPassword = this.refs['field-con-password'].getDOMNode().value;

    if (id === '') return this.setState({'message': '아이디를 입력해 주세요.'});
    if (password === '') return this.setState({'message': '비밀번호를 입력해 주세요.'});
    if (password !== conPassword) return this.setState({'message': "비밀번호를 정확히 입력해 주세요."});

    this.setState({'message': <span>처리중입니다.<i className='fa fa-spinner fa-spin'/></span>});

    this.emit("UserSignUp", {
      id: id,
      email: email,
      name: name,
      password: password
    });

  },

  successSignUp(){
    var id = this.refs['field-id'].getDOMNode().value;
    var password = this.refs['field-password'].getDOMNode().value;

    this.emit("ReturnSignInWithAccountInfo", {
      id: id,
      password: password
    });
  },

  failSignUp(){
    this.setState({'message': <span>회원가입 실패. 일단 관리자에게 문의하세요.</span>});
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
            <input type="text" name="email" placeholder="Email" ref="field-email"/>
          </div>
          <div className="field">
            <input type="text" name="name" placeholder="Name" ref="field-name"/>
          </div>
          <div className="field">
            <input type="password" name="password" placeholder="Password" ref="field-password"/>
          </div>
          <div className="field">
            <input type="password" name="password" placeholder="Confirm Password" ref="field-con-password"/>
          </div>
          <div className='field'>
            { /^.+$/.test(this.state.message) ? <p>{this.state.message}</p> : ''}
          </div>
          <ul className="actions">
            <li><a href="#" className="button" onClick={this.cancel}>Cancel</a></li>
            <li><a href="#" className="button" onClick={this.submit}>Submit</a></li>
          </ul>
        </form>
      </section>
    )
  }
});


export default SignUp;
