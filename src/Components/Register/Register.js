import React from 'react';
import { serverBaseUrl } from '../../Constants.js';

const checkEmail = (email) => {
    const mailRegex = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
    return String(email).toLowerCase().match(mailRegex);
}

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            email : '',
            password : '',
            password2 : '',
            alert:''
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
            password:'',
            password2:''
        })
    }

    onSubmitRegister = () => {
        const {
            name,
            email,
            password,
            password2
        } = this.state;
        /// Check for blank input
        if (!name || !email || !password || !password2) {
            this.wrongForm('Please fill up all the fields to register.');
        }
        /// Check for mail
        else if (!checkEmail(email)) {
            this.wrongForm('Wrong email format.');
        }
        /// Check passwords
        else if (password.length < 8 || password.length > 64) {
            this.wrongForm('Passwords should have between 8 and 64 chararcters.');
        }
        else if (password !== password2) {
            this.wrongForm('Passwords do not match.');
        }
        else {
            fetch(serverBaseUrl + '/register', {
                method:'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
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
        return (
            <div>
                <article className="ba bw2 br3 bg-white dark-gray b--black-20 mv4 w-40-l w-60-m w-90 center">
                    <main className="black-80">
                        <div className="center pa4">
                            <form id="sign_up" className="ph0 b--transparent">
                                <legend className="f4 fw6 ph0 mh0">Create your account</legend>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                    <input 
                                        className="pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100 border-box"
                                        type="name" 
                                        name="name"
                                        maxLength='64'
                                        id="name"
                                        value={this.state.name}
                                        onChange={this.onInputChange} 
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input 
                                        className="pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100"
                                        type="email" 
                                        name="email"
                                        maxLength="256"
                                        id="email-address"
                                        value={this.state.email}
                                        onChange={this.onInputChange} 
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                    <input 
                                        className="b pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100" 
                                        type="password" 
                                        name="password"
                                        maxLength='64'
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password2">Confirm password</label>
                                    <input 
                                        className="b pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100" 
                                        type="password" 
                                        name="password2"
                                        maxLength='64'
                                        id="password2"
                                        value={this.state.password2}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                            </form>
                            <div className="b tc red f6">
                                <p>{this.state.alert}</p>
                            </div>
                            <div className="tc">
                                <input 
                                    className="b ba bw1 br2 ph3 pv2 ba b--black bg-transparent pointer f6 dim" 
                                    type="submit" 
                                    value="Register"
                                    onClick={this.onSubmitRegister}
                                />
                            </div>
                        </div>
                    </main>
                </article>
            </div>
        );
    }
}

export default Register;