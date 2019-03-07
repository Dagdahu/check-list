import React from 'react';
import { serverBaseUrl } from '../../Constants.js';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            alert: ''
        }
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    wrongForm = (newAlert) => {
        this.setState({
            alert: newAlert,
            password:''
        })
    }

    onSubmitSignIn = () => {
        const {email, password} = this.state;
        /// Check for blank input
        if (!email || !password) {
            this.wrongForm('Please fill up all the fields to register.');
        }
        else {
            fetch(serverBaseUrl + '/signin', {
                method:'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })  
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                }
                else {
                    this.wrongForm('Wrong email/password combination.');
                }
            })
            .catch(err => {
                this.wrongForm('An error has occured, please try again later.');
                console.log(err)
            })
        }
    }

    render() {
        const {onRouteChange} = this.props;
        return (
            <div>
                <article className="ba bw2 br3 mv4 w-40-l w-60-m w-90 bg-white dark-gray b--black-20 center">
                    <main className="pa4 black-80">
                        <div className="measure center">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input 
                                        className="pa2 br2 ba bw1 b--black-20 bg-transparent hover-bg-light-gray w-100"
                                        type="email" 
                                        name="email"  
                                        id="email-address"
                                        maxLength='256'
                                        value={this.state.email}
                                        onChange={this.onInputChange} 
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                    <input 
                                        className="b pa2 br2 ba bw1 b--black-20 bg-transparent hover-bg-light-gray w-100" 
                                        type="password" 
                                        name="password" 
                                        id="password"
                                        maxLength='64'
                                        value={this.state.password}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                            </fieldset>
                            <div className="b dark-red f6">
                                <p>{this.state.alert}</p>
                            </div>
                            <div className="tc">
                                <input 
                                    className="b ba bw1 br2 ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dim" 
                                    type="submit" 
                                    value="Sign in"
                                    onClick={this.onSubmitSignIn}
                                />
                            </div>
                        </div>
                        <hr />
                        <h3 className="tc">
                            New user ?
                        </h3>
                        <div 
                            className="b ba bw1 br2 pv2 tc pointer f6 dim"
                            onClick={() => onRouteChange('register')}
                        >
                            Create an account
                        </div>
                    </main>
                </article>
            </div>
        );
    }
}

export default SignIn;