import React from 'react';

export default React.createClass({


  submitHandler(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.Question, this.state.Answer);
  },

  // e stands for event
  // setting changed state to new state (question and answer)
  updateQuestion(e) { 
    let newQuestion = e.currentTarget.value;

    this.setState({
      Question: newQuestion
    });
  },

  updateAnswer(e) { 
    let newAnswer = e.currentTarget.value;

    this.setState({
      Answer: newAnswer
    });
  },

  cancelHandler(e) {
    e.preventDefault();
    this.props.onCancelClick();
  },

  render() {
    return (
      <div className='cardWrap'>
        <div className='addCard form'>
          <form className='addForm'>
            <h2>Question</h2>
            <input type="textarea" 
              onChange={this.updateQuestion} />
            <h2>Answer</h2>
            <input type="text" 
              onChange={this.updateAnswer} />
            <button onClick={this.cancelHandler}>Cancel</button>
            <button type="submit" value="Save Card" onClick={this.submitHandler}>Save Card</button>
          </form>
        </div>
      </div>
    );
  }
}); 