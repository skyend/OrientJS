import React from 'react';
import CSS from './Enterance.useable.css';
import EventDistributor from "../ui.workspace/reactMixin/EventDistributor.js";

import avatarImage from '../../images/avatar.jpg';
import SignUp from './SignUp/SignUp.jsx';
import Lobby from './Lobby/Lobby.jsx';
import SignIn from './SignIn/SignIn.jsx';
//console.log(avatarImage);

var Enterance = React.createClass({
  mixins: [EventDistributor],

  /** Initial **/
  getDefaultProps () {
    return {
      defaultMainType: 'signIn'
    };
  },

  getInitialState () {

    return {
      mainType: this.props.defaultMainType
    };
  },

  /** Event Catch **/
  onThrowCatcherReturnSignIn () {
    this.loadingMain();
    this.setState({
      'mainType': 'signin'
    });
  },

  onThrowCatcherGotoSignUp () {
    this.loadingMain();
    this.setState({
      'mainType': 'signup'
    });
  },

  onThrowCatcherReturnSignInWithAccountInfo () {
    this.loadingMain();
    this.setState({
      'mainType': 'signin'
    });
  },

  onThrowCatcherSuccessSignIn () {
    this.loadingMain();
    this.setState({
      'mainType': 'lobby'
    });
  },

  /** Effect **/
  loadingMain () {
    document.body
      .setAttribute('class', 'is-loading');
  },

  showMain () {
    setTimeout(function() {
      document.body
        .setAttribute('class', '');
    }, 500);
  },

  /** over Life cycle **/
  componentDidUpdate () {
    this.showMain();
  },

  componentWillMount () {
    CSS.use();
    this.loadingMain();
  },

  componentDidMount () {
    this.showMain();
  },

  componentWillUnmount () {
    CSS.unuse();
  },

  /** Renders **/
  renderMain () {

    switch (this.state.mainType.toLowerCase()) {
      case "signin":
        return <SignIn/>
      case "signup":
        return <SignUp/>
      case "lobby":
        return <Lobby/>
    }
  },

  render () {
    return (

      <div id="wrapper">
        {this.renderMain()}
        <footer id="footer">
          <ul className="copyright">
            <li>&copy; I-ON Communications SDP headquarters.</li>
            <li>version
              {window.gelateriaVersion}</li>
            <li>Design:
              <a href="http://html5up.net">HTML5 UP</a>
            </li>
          </ul>
        </footer>
      </div>

    )
  }
});

/*

<section id="main">
  <header>
    <span className="avatar"><img src={avatarImage} alt="" /></span>
    <h1>Gelateria</h1>
    <p>ICE Service Builder</p>
  </header>

  <hr />
  <h2>Extra Stuff!</h2>
  <form method="post" action="#">
    <div className="field">
      <input type="text" name="name" id="name" placeholder="Name" />
    </div>
    <div className="field">
      <input type="email" name="email" id="email" placeholder="Email" />
    </div>
    <div className="field">
      <div className="select-wrapper">
        <select name="department" id="department">
          <option value="">Department</option>
          <option value="sales">Sales</option>
          <option value="tech">Tech Support</option>
          <option value="null">/dev/null</option>
        </select>
      </div>
    </div>
    <div className="field">
      <textarea name="message" id="message" placeholder="Message" rows="4"></textarea>
    </div>
    <div className="field">
      <input type="checkbox" id="human" name="human" /><label for="human">I'm a human</label>
    </div>
    <div className="field">
      <label>But are you a robot?</label>
      <input type="radio" id="robot_yes" name="robot" /><label for="robot_yes">Yes</label>
      <input type="radio" id="robot_no" name="robot" /><label for="robot_no">No</label>
    </div>
    <ul className="actions">
      <li><a href="#" className="button">Get Started</a></li>
    </ul>
  </form>
  <hr />

  <footer>
    <ul className="icons">
      <li><a href="#" className="fa-twitter">Twitter</a></li>
      <li><a href="#" className="fa-instagram">Instagram</a></li>
      <li><a href="#" className="fa-facebook">Facebook</a></li>
    </ul>
  </footer>


</section>



<footer id="footer">
  <ul className="copyright">
    <li>&copy; Jane Doe</li>
    <li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
  </ul>
</footer>

*/
export default Enterance;
