//this view allows you to add a deck
import React from 'react';
import Backbone from 'backbone';


export default React.createClass({



submitHandler(x){
  x.preventDefault();
  this.props.onSubmitClick(this.state.Title);
},

updateTitle(x) { 
    let newTitle = x.currentTarget.value;

    this.setState({
      Title: newTitle
    });
  },

backBtnHandler(){
  this.props.onBackBtnClick();
},

  render() {
    return(
      <div className='addDeckContainer'>
        <div className='addDeck form'>
          <button className='backBtn' onClick={() => this.backBtnHandler()}>Back</button>
       
          <h1> Enter your deck title: </h1>
          <form className='addForm'>
            <input type='text' placeholder='Title' className='enterTitle' onChange={this.updateTitle}></input>
            <button onClick={this.submitHandler}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}); 