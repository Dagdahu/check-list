import React, { Component } from 'react';
/// Import Components
import Navigation from './Components/Navigation/Navigation';
import Home from './Components/Home/Home';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Lists from './Components/Lists/Lists';

const initialState = {
  route : 'user',
  isSignedIn: true,
  user: {
    id : '123',
    name: 'John',
    email: 'john@gmail.com'
  }
}

const shoppingList = [
  {
    name: 'Gateau au chocolat',
    items: [
      {
        name: 'farine',
        enable: true
      },
      {
        name: 'oeufs',
        enable: true
      },
      {
        name: 'chocolat',
        enable: false
      }
    ]
  },
  {
    name: 'Vaisselle',
    items: [
      {
        name: 'liquide vaisselle',
        enable: true
      },
      {
        name: 'éponge',
        enable: true
      }
    ]
  },
  {
    name: 'Pas d\'articles',
    items:[]
  }
];

class App extends Component {
  constructor (props) {
    super (props);
    this.state = initialState;
  }

  onRouteChange = (newRoute, userLog = '') => {
    if (userLog === 'LOGIN') {
      this.setState({isSignedIn:true})
    }
    else if (userLog === 'LOGOUT') {
      this.setState(initialState);
    }
    this.setState({route:newRoute});
  }

  render() {
    return (
      <div className="App">
        <Navigation 
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {
          this.state.route === 'user' ?
            <Lists 
              username={this.state.user.name}
              listArray={shoppingList}
            />
            :
            this.state.route === 'signin' ?
              <SignIn 
                onRouteChange={this.onRouteChange}
              />
              :
              this.state.route === 'register' ?
                <Register 
                  onRouteChange={this.onRouteChange}
                />
                :
                <Home 
                  onRouteChange={this.onRouteChange}
                  isSignedIn={this.state.isSignedIn}
                />
        }
      </div>
    );
  }
}

export default App;
