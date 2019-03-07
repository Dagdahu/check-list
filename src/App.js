import React, { Component } from 'react';
/// Import Components
import Navigation from './Components/Navigation/Navigation';
import Home from './Components/Home/Home';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Lists from './Components/Lists/Lists';
import Footer from './Components/Footer/Footer';
/// Other
import { serverBaseUrl } from './Constants.js';
import './App.css';

const initialState = {
  route : 'home',
  isSignedIn: false,
  user: {
    id : '',
    name: '',
    email: '',
    lists: []
  }
}

class App extends Component {
  constructor (props) {
    super (props);
    this.state = initialState;
  }

  loadUser = (newUser) => {
    fetch(serverBaseUrl + '/lists/' + newUser.id, {
      method:'get'
    })
      .then(response => response.json())
      .then(response => {
        if (response === 'Not found') {
          response = [];
        }
        this.setState({
          user: {
            id : newUser.id,
            name: newUser.name,
            email: newUser.email,
            lists: response
          }
        })
        this.onRouteChange('user', 'login')
      })
  }

  onRouteChange = (newRoute, userLog = '') => {
    if (userLog === 'login') {
      this.setState({isSignedIn:true})
    }
    else if (userLog === 'logout') {
      this.setState(initialState);
    }
    this.setState({route:newRoute});
  }

  render() {
    return (
      <div className="App">
        <div className="content">
          <Navigation 
            onRouteChange={this.onRouteChange}
            isSignedIn={this.state.isSignedIn}
          />
          {
            this.state.route === 'user' ?
              <Lists 
                user={this.state.user}
              />
              :
              this.state.route === 'signin' ?
                <SignIn 
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
                :
                this.state.route === 'register' ?
                  <Register 
                    onRouteChange={this.onRouteChange}
                    loadUser={this.loadUser}
                  />
                  :
                  <Home 
                    onRouteChange={this.onRouteChange}
                    isSignedIn={this.state.isSignedIn}
                  />
          }
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
