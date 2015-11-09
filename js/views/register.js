import React from 'react';
import Backbone from 'backbone';
import $ from 'jquery';


export default React.createClass({

  onLoginHandler(x) {
    x.preventDefault();
    this.props.onLoginClick(this.state.username, this.state.password);
  },

  updateUsername(x) { 
    let newUsername = x.currentTarget.value;

    this.setState({
      username: newUsername
    });
  },

  updatePassword(x) { 
    let newPassword = x.currentTarget.value;

    this.setState({
      password: newPassword
    });
  },

  updateFullname(x) { 
    let newFullname = x.currentTarget.value;

    this.setState({
      fullname: newFullname
    });
  },

  updateEmail(x) { 
    let newEmail = x.currentTarget.value;

    this.setState({
      email: newEmail
    });
  },
  
  registerHandler(x) {
    x.preventDefault();
    this.props.onRegisterClick(this.state.username,this.state.password,this.state.fullname,this.state.email)
  },

  render() {
    return (
      <div className='registerWrap'>
        <div className="signup">
          <h2>Create a new Account</h2>
          <form>
            <label className='regfield'><span className='span'>Full Name: </span><input onChange={this.updateFullname} id='fullname' type="text" className="fullname"/></label>
            <label className='regfield'><span className='span'>Email: </span><input onChange={this.updateEmail} id='email' type="text" className="email"/></label>
            <label className='regfield'><span className='span'>Username: </span><input onChange={this.updateUsername} id='username' type="text" className="user"/></label>
            <label className='regfield'><span className='span'>Password: </span><input onChange={this.updatePassword} id='password' type="password" className="password"/></label><br/>
            <label className='regfield'><span className='span'>Re-enter Password: </span><input type="password" className="pass2"/></label>
            <button id='registerUser' onClick={this.registerHandler} value='Register'>Register</button>
          </form>
        </div>
      </div>
    );
  },

});