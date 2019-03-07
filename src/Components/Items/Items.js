import React from 'react';

let timers = [];

class Items extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            items: this.props.itemsArray
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.itemsArray !== this.props.itemsArray){
            this.setState({          
                items: this.props.itemsArray
            });
        }
    }

    itemList = (items) => {
        return (
            items.length ?
            items.map(item =>
                <li 
                    className='link dim ma2'
                    key={item.name}
                >
                    <input 
                        className="mr2"
                        type="checkbox"
                        id={item.id}
                        value={item.name}
                        checked={!item.enable}
                        onChange={() => this.onToggleItemCheck(item.id)}
                    />
                    <label className='button' htmlFor={item.name}>
                        {item.name}
                    </label>
                </li>
            )
            :
            <li className='ma2 silver'>
                No item
            </li>
        );
    }

    onToggleItemCheck = (id) => {
        let newState;
        this.setState({
            items: this.state.items.map(item => {
                if (item.id === id) {
                    newState = item.enable ? 0 : 1;
                    item.enable = newState;
                }
                return item;
            })
        })
        /// Wait for the item to stop being clicked for .5s before fetching
        clearTimeout(timers[id]);
        timers[id] = setTimeout(() => {
            this.props.itemClicked(id, newState);
        }, 500)
    }

    render () {
        const {listName, onRouteChange, onDeleteList} = this.props;
        return (
            <div className='pa2'>
                {
                    listName !== '' ?
                        <div>
                            <h2 className='tc'>
                                {listName}
                            </h2>
                            <ul 
                                className='list tc ph0'
                                // onClick={(event) => onItemClicked(event.target)}
                            >
                                {this.itemList(this.state.items)}
                            </ul>
                            <div className='dt center'>
                                <div className='dtc v-mid tl'>
                                    <div 
                                        className='tc link dim ba bw1 pa2 br-pill blue ma3 button'
                                        onClick={() => onRouteChange('modifyList')}
                                    >
                                        Modify
                                    </div>
                                </div>
                                <div className='dtc v-mid tr'>
                                    <div 
                                        className='tc link dim ba bw1 pa2 br-pill light-red ma3 button'
                                        onClick={() => onDeleteList()}
                                    >
                                        Delete
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='tc silver'>
                            Select a list
                        </div>
                }
            </div>
        );
    }

}

export default Items;