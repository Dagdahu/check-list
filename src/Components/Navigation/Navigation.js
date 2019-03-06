import React from 'react';
import Logo from '../Logo/Logo';


const Navigation = ({onRouteChange, isSignedIn}) => {
    return (
        <div> 
            <nav className="db dt dark-gray w-100 border-box ph4">
                <div 
                    className="db dtc v-mid link dim tl mb2 mb0-l button" 
                    title="Home"
                    onClick={() => onRouteChange('home')}
                >
                    <Logo />
                </div>
                {
                    isSignedIn ?
                    <div className="db dtc v-mid tr">
                        <h4
                            className="link dim dib pa2 ba bw1 br-pill button normal"
                            title="Log out"
                            onClick={() => onRouteChange('home', 'logout')}
                        >
                            Log out
                        </h4>
                    </div>
                    :
                    <div className="db dtc v-mid tr">
                        <h4 
                            className="link dim green dib mh2 mv1 pa2 ba bw1 br-pill button normal"
                            title="Log in your account"
                            onClick={() => onRouteChange('signin')}
                        >
                            Sign In
                        </h4>
                        <h4 
                            className="link dim dib mh2 mv1 pa2 ba bw1 br-pill button normal"
                            title="Create an account"
                            onClick={() => onRouteChange('register')}
                        >
                            Register
                        </h4>
                    </div>
                }
            </nav>
        </div>
    )
}

export default Navigation;