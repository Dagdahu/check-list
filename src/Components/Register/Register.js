import React from 'react';
import { serverBaseUrl } from '../../Constants.js';
import Loading from '../Loading/Loading';

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
            alert:'',
            isLoading: false
        }
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onKeyPressed = (event) => {
        const keyCode = event.keyCode || event.which;
        if(keyCode === 13) {
            this.onSubmitRegister();
        }  
    }

    wrongForm = (newAlert) => {
        this.setState({
            alert: newAlert,
            password:'',
            password2:'',
            isLoading: false
        })
    }

    onSubmitRegister = () => {
        const {
            name,
            email,
            password,
            password2
        } = this.state;
        this.setState({
            alert:'',
            isLoading: true
        });
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
                    this.wrongForm('An account already exists with this mail address.');
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
                                <div className="mt3">
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
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                    <input 
                                        className="b pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100" 
                                        type="password" 
                                        name="password"
                                        minLength='8'
                                        maxLength='64'
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password2">Confirm password</label>
                                    <input 
                                        className="b pa2 ba bw1 br2 b--black-20 bg-transparent hover-bg-light-gray w-100" 
                                        type="password" 
                                        name="password2"
                                        minLength='8'
                                        maxLength='64'
                                        id="password2"
                                        value={this.state.password2}
                                        onChange={this.onInputChange}
                                        onKeyPress={(e) => this.onKeyPressed(e)}
                                    />
                                </div>
                            </form>
                            <div className="h2 mv3 tc">
                                {this.state.alert &&
                                    <div className="b dark-red f6 tl">
                                        <p className="ma0">{this.state.alert}</p>
                                    </div>
                                }
                                {this.state.isLoading && <Loading />}
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