import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import Backbone from 'backbone';
import React from 'react';
import ReactDom from 'react-dom';

import Cookies from 'js-cookie';

import {
  UserCollection,
  UserModel,
  CardCollection,
  CardModel,
  DeckCollection,
  DeckModel
} from './resources';

import {
  AddDeckView,
  RegisterPage,
  UserView,
  DeckView,
  NavView,
  EditCardView,
  AddCardView,
  LoginPage,
} from './views';

let Router = Backbone.Router.extend({
  
  routes: {
    ''                            : 'home',
    'loginPage'                   : 'loginPage',
    'login'                       : 'login',
    'isLogged'                    : 'isLogged',
    'logout'                      : 'logout', 
    'registerPage'                : 'registerPage',
    'decks'                       : 'dash',
    'decks/:deckID'               : 'deckView',
    'addDeck'                     : 'addDeck',
    'decks/:deckID/cards/:cardID' : 'cardView',
    'decks/:deckID/addCard'       : 'addCard'
  },

  start() {
    Backbone.history.start();
    return this;
  },

  initialize(appElement) {
    this.el = appElement;
    this.deck = new DeckCollection();
    this.card = new CardCollection();
    this.user = new UserCollection();
    let router = this;
  },

  goto(route) {
    this.navigate(route, {
      trigger: true,
      replace: true
    });
  },

  render(component){
    ReactDom.render(component, this.el);
  },

// Setting Auth Token in Cookies.
  setHeaders() {
    let cookie = JSON.parse(Cookies.get('user'));
      $.ajaxSetup({
        headers: {
         'Access-Token': cookie.user.auth_token
      }
    })
    // OLD VERSION - Not working
      // let user = Cookies.get('user');
      // // console.log(user);
      // if (user) {
      //   let auth = JSON.parse(user).user.access_token;
      //   // console.log(auth);
      //   $.ajaxSetup({
      //     headers: {
      //       'Access-Token': auth
      //     }
      //   });
      // } else {
      //   this.goto('');
      // }
  },

// Nav and Home Route (redirect)
  
  nav() {
    this.render(<NavView
      onHomeClick={()=>this.goto('')}
      onLogoutClick={()=>this.goto('logout')}
    />
    );
  },

  home() {
    // this.user.fetch({url: 'https://rocky-garden-9800.herokuapp.com/login'}).then(() => {
    //   this.render(<HomeView
    //     onHomeClick={() => this.goto('')}
    //     onLoginClick={() => this.goto('login')}
    //     onLogoutClick={()=> this.goto('logout')}
    //     onRegisterClick={() => this.goto('register')}/>
    //   );
    // });
    this.goto('isLogged');
  },

// Login Page and function, Login check, Logout.

  hideBanner() {
    $('.banner').addClass('hidden')
  },

  showBanner() {
    $('.banner').removeClass('hidden')
  },

  loginPage() {
    this.hideBanner();
    ReactDom.render(
      <LoginPage
        user={Cookies.getJSON('user')}
        onLoginClick={(user,pass) =>  this.login(user,pass)}
        // onLogoutClick={() => this.navigate('logout', {trigger: true})}
        onRegisterClick={() =>  this.navigate('registerPage', {trigger: true})}/>,
        document.querySelector('.app')
    );
  },

  login(user,pass) {
    this.showBanner();
    let request = $.ajax({
      url: `https://rocky-garden-9800.herokuapp.com/login`,
      method: 'POST',
      data: {
        username: user,
        password: pass,
      }
    });
    $('.app').html('loading...');
    request.then((data) => {
      Cookies.set('user', data);
      $.ajaxSetup({
        headers: {
          'Access-Token': data.user.auth_token,
        }
      });
      this.goto('decks');
    }).fail(() => {
      $('.app').html('Try again');
      this.goto('loginPage');
    });
  },

  isLogged() {
    if (Cookies.get('user')) {
      let cookie = JSON.parse(Cookies.get('user'));
      $.ajaxSetup({
        headers: {
         'Access-Token': cookie.user.auth_token
        }
      })
      this.goto('decks');
    } else {
      this.goto('loginPage');
    }
  },

  logout()  {
    this.setHeaders();
    Cookies.remove('user');
    $.ajaxSetup ({
      headers: {
        'Access-Token': null
      }
    });
    console.log(Cookies.get('user'))
    this.goto('')
  },

// Registration

  registerPage() {
    this.showBanner();
    this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <RegisterPage 
          user={Cookies.getJSON('user')}
          onRegisterClick={(user,pass,fullname,email) => {
            let newUser = new UserModel({
              username: user,
              password: pass,
              full_name: fullname,
              email: email
            })
            newUser.save({},{url: 'https://rocky-garden-9800.herokuapp.com/signup'}).then(()=>{this.goto('loginPage')})
          }
        }/>
      </wrap>
    )
  },

// Initial Content View - showing the Decks (with routes to add/view decks)

  dash() {
    this.deck.fetch().then((data) => {
      this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <UserView
        data={data}
        onDeckClick={(id)=> this.goto('decks/'+id)}
        onAddDeckClick={()=> this.goto('addDeck')}/>
      </wrap>
      );
    });
  },

  addDeck() {
    this.setHeaders();

    let cookie = JSON.parse(Cookies.get('user'));
      $.ajaxSetup({
        headers: {
         'Access-Token': cookie.user.auth_token
      }
    })
    this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <AddDeckView
          onBackBtnClick={() => this.goto('decks')}
          onSubmitClick={(title) =>{
            this.setHeaders();
            let newDeck = new DeckModel ({
              title: title,
            })
            newDeck.save().then(() => {this.goto('decks')})
          }
        }/>
      </wrap>
    );
  },

  deckView(id) {
    this.setHeaders();
    let baseUrl = 'https://rocky-garden-9800.herokuapp.com/decks/';
    let thisId = `${id}`;
    // console.log(`${baseUrl}${id}/cards`);
    // THIS IS UNNECESSARY - USE FETCH()
        // let request = $.ajax({
        //   url: `${baseUrl}${id}/cards`,
        //   method:'GET',
        // });
    //---------------------------------
    this.card.fetch({url: baseUrl+thisId+'/cards'}).then((data) => {
      this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <DeckView
        data={data}
        onCardSelect = {(cardId) => this.goto('decks/'+thisId+'/cards/'+cardId)}
        onAddCardClick = {() => this.goto('decks/'+thisId+'/addCard')}
        onBackBtnClick = {() => this.goto('decks')}
        onDeleteClick={
          () => {
            this.setHeaders();
            let deadDeck = new DeckModel({
              id: thisId
            })
            deadDeck.destroy({
              url: 'https://rocky-garden-9800.herokuapp.com/decks/'+thisId,
              wait: true
            }).then(this.goto('decks'))
          }
        }/>
      </wrap>
      );
    });
  },
 
// Card Views and edit/add routes.

  cardView(deckId, cardId) {
    this.setHeaders();

    let baseUrl = 'https://rocky-garden-9800.herokuapp.com/decks/';
    let thisId = `${deckId}`;
    let thatId = `${cardId}`;

    this.card.fetch({url: baseUrl+thisId+'/cards'})
    .then((data) => 
    this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <EditCardView 
          data={(data.cards.filter((x) => {
            return x.id === Number(thatId)
          })).pop()}
          onSubmitClick={(quest,ans) => {
            let newCard = new CardModel ({
              id: thatId,
              question: quest,
              answer: ans
            })
            newCard.save({},{url: 'https://rocky-garden-9800.herokuapp.com/cards/'+thatId}).then(() => {this.goto('decks/'+thisId)})
          }}
          onDeleteClick={
            () => {
              this.setHeaders();
              let deadCard = new CardModel({
                id: thatId
              })
              deadCard.destroy({
                url: 'https://rocky-garden-9800.herokuapp.com/cards/'+thatId,
                wait: true
              }).then(this.goto('decks/'+thisId))
            }
          }
        />
      </wrap>
    )
  )},

  // saveEdit(quest, ans, cardId) {
  //   let thatId = `${cardId}`;
  //   console.log(this.card.get(thatId));
  //   this.setHeaders();
  //   this.card.get(thatId).then(()=> save({
  //     Question: quest,
  //     Answer: ans
  //   })).then(() => this.goto('deck/'+ deckId));
  // },

  addCard(deckId) {
    this.setHeaders();

    let baseUrl = 'https://rocky-garden-9800.herokuapp.com/decks/'; 
    let thisId = `${deckId}`;
    // let endofurl = '/cards';
    this.render(
      <wrap>
        <NavView
          onHomeClick={()=>this.goto('')}
          onLogoutClick={()=>this.goto('logout')}
        />
        <AddCardView 
          onCancelClick={()=> this.goto('decks/'+ deckId)}
          onSubmit={(quest, ans) => {
            this.setHeaders();
            this.card.create({
              question: quest,
              answer: ans
            },{url: baseUrl + thisId + '/cards'})
            this.goto('decks/'+thisId)
          }}
        />
      </wrap>
    );
   },

});

export default Router;
