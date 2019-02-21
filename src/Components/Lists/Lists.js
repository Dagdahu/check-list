import React from 'react';
import Items from '../Items/Items';


const newListButtonText = 'New List';

class Lists extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            lists: this.props.listArray,
            currentList:'',
            currentItems:[]
        };
    }

    /// Create html list out of list array
    readList = (listArray) => {
        return listArray.map(list => 
            <li 
                className='link dim pa2 ma2 ba br-pill b--silver button'
                key={list.name}
            >
                {list.name}
            </li>
        );
    }

    /// Update state on list click
    listClicked = (event) => {
        if (event.target.innerText === newListButtonText) {
            console.log('New list');
        }
        else {
            for (let list of this.state.lists) {
                if (event.target.innerText === list.name) {
                    this.setState({
                        currentList:list.name,
                        currentItems:list.items
                    });
                    break;
                }
            };
        }
    }


    render () {
        return (
            <div className='mt5 mh3 dark-gray'>
                <h1>
                    Hello {this.props.username}, please select a list :
                </h1>
                <div className='db dt'>
                    <ul 
                        className='db dtc list tc w-30-l w-40-m ph3 w-50'
                        onClick={(event) => this.listClicked(event)}
                    >
                        {this.readList(this.state.lists)}
                        <li className='link button green dim mt2 tc ba bw1 br-pill pa2'>
                            {newListButtonText}
                        </li>
                    </ul>
                    <div className='db dtc w-30-l w-40-m w-50 bl bw1 b--gray'>
                        <Items
                            listName={this.state.currentList}
                            itemsArray={this.state.currentItems}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Lists;