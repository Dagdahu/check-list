import React from 'react';

const Home = ({onRouteChange, isSignedIn}) => {
    return (
        <div className='tc'>
            <h1 className='dark-gray'>
                Create your shopping list now !
            </h1>
            <h2 className='gray'>
                The time you always forgot the shopping list at home is over !
            </h2>
            <div 
                className="link dim f3 dib ma3 pa3 br-pill white bg-green button"
                onClick={() => isSignedIn ?
                    onRouteChange('user')
                    :
                    onRouteChange('signin')
                }
            >
                Start now !
            </div>
            <div className='center'>
                <ul className='tl gray'>
                    <li>
                        Create multiple lists.
                    </li>
                    <li>
                        Check purchased items.
                    </li>
                    <li>
                        Retrieve your commonly purchased items.
                    </li>
                    <li>
                        It's all on your phone !
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Home;