import React from 'react';
import './ModifyList.css';

class ModifyList extends React.Component {
    constructor (props) {
        super (props);

        /// Add inList attribute to everyitems
        const itemsArray = this.props.itemsArray.map(item => {
            item.inList = true;
            return item;
        })
        const commonItems = this.props.commonItems.map(item => {
            item.inList = Boolean(this.props.itemsArray.find(i => i.id === item.id));
            item.enable = true;
            return item;
        })
        

        this.state = {
            listName: this.props.modifiedList.name,
            searchField: '',
            itemsArray: itemsArray,
            commonItems: commonItems,
            alert: ''
        };
    }

    onDeleteCommonItem = (target) => {
        this.setState({
            commonItems:this.state.commonItems.filter(item => item.id.toString() !== target.id)
        })
    }

    items = (itemsArray, list) => {
        itemsArray = itemsArray.filter(item => ((list === 'common' && !item.inList) || list !== 'common') && item.name.toLowerCase().includes(this.state.searchField.toLowerCase()));
        return (
            itemsArray.length ?
            itemsArray.map(item =>
                    <li
                        className='dt center link button item pa2 w-90'
                        key={item.name}
                        id={item.name}
                    >
                        {
                            list === 'common' ?
                                <span className='dtc tc w-10 ba bw1 br-pill pv1 ph2 b green'>
                                    +
                                </span>
                                :
                                ''
                        }
                        <span
                            className='dtc tc link ma2 button'
                        >
                            {item.name}
                        </span>
                        {
                            list === 'common' ?
                                <span className='dtc tc w-20 itemTail'>
                                    <span className="ph2 silver">
                                        ({item.count})
                                    </span>
                                    <span 
                                        className=" ba bw1 br-pill pb1 ph2 b delete washed-red hover-red"
                                        id={item.id}
                                    >
                                        x
                                    </span>
                                </span>
                                :
                                <span className='dtc tc w-10 ba bw1 br-pill pv1 ph3 b blue'>
                                    -
                                </span>
                        }
                    </li>
                )
                :
                <li className='silver'>
                    No item
                </li>
        )
    }
 
    onInputChange = (target) => {
        this.setState({[target.name]:target.value});
    }

    onKeyPressed = (event) => {
        const keyCode = event.keyCode || event.which;
        if(keyCode === 13) {
            this.onAddItem();
        }  
    }

    onAddItem = () => {
        /// Search for item in Common items list
        let addedItem = this.state.commonItems.find(item => item.name.toLowerCase() === this.state.searchField.toLowerCase())
        if(addedItem) {
            addedItem.inList = true;
        }
        else {
            addedItem = {
                id: undefined,
                name: this.state.searchField,
                count:1,
                enable: true,
                inList: true
            }
        }
        /// Add it to items array if it is not already their
        if (this.state.itemsArray.find(item => item.name.toLowerCase() === addedItem.name.toLowerCase())) {
            this.setState({
                searchField:''
            })
        }
        else {
            this.setState({
                itemsArray:this.state.itemsArray.concat(addedItem),
                searchField:''
            });
        }
    }

    onButtonClick = (target) => {
        if (target.id === 'saveList') {
            /// Check if list name is filled
            if (!this.state.listName) {
                this.setState({alert:'Please give a name to your list.'})
            }
            else {
                const newList = {
                    id: this.props.modifiedList.id,
                    name: this.state.listName,
                    user_id: this.props.modifiedList.user_id,
                }
                this.props.onSaveList(
                    newList,
                    this.state.itemsArray,
                    this.state.commonItems
                )
            }
        }
        else {
            /// Cancel, back to lists
            this.props.onRouteChange('list');
        }
    }

    toggleItemInList = (items, id) => {
        return items.map(item => {
            if(item.name.toLowerCase() === id.toLowerCase()) {
                item.inList = !item.inList;
            }
            return item;
        });
    }

    onItemClick = (target,list) => {
        if (target.classList.contains('delete')) {
            this.onDeleteCommonItem(target);
        }
        else {
            target = target.closest('li');
            if(list === 'common') {
                /// Add common item to the list
                const newItem = Object.assign(this.state.commonItems.find(item => item.name.toLowerCase() === target.id.toLowerCase()));
                this.setState({
                    itemsArray: this.state.itemsArray.concat(newItem)
                })
            }
            else {
                /// Remove item from list
                this.setState({
                    itemsArray: this.state.itemsArray.filter(item => item.name.toLowerCase() !== target.id.toLowerCase())
                })
            }
            /// Toggle item from common list
            this.setState({
                commonItems: this.toggleItemInList(this.state.commonItems, target.id)
            })
        }
    }

    render() {
        const {listName, itemsArray, commonItems} = this.state;
        return (
            <div className='dt'>
                <div className='dtc list tc w-30-l w-40-m ph2 ph3-m ph4-l w-50'>
                    <div className='dt w-100'>
                        <h4 className='dtc tl mh2 dark-gray'>
                            List name :
                        </h4>
                        <input 
                            type='text'
                            name='listName'
                            placeholder='List name'
                            defaultValue={listName}
                            className='dtc tc w-100'
                            maxLength='64'
                            onChange={(e) => this.onInputChange(e.target)}
                        />
                    </div>
                    <div className="tr pa1 dark-red">
                        {this.state.alert}
                    </div>
                    <h4 className='tl mv3 dark-gray'>
                        Items :
                    </h4>
                    <div className='ba bw1 br3 b--light-silver pa2'>
                        <div className='dt center w-90'>
                            <input 
                                type='search'
                                name='searchField'
                                placeholder='Search and Add'
                                className='dtc tc w-90'
                                maxLength='64'
                                value={this.state.searchField}
                                onChange={(e) => this.onInputChange(e.target)}
                                onKeyPress={(e) => this.onKeyPressed(e)}
                            />
                            <div 
                                className='dtc link dim button ba bw1 br-pill ma5 pv2 ph3 blue'
                                onClick={() => this.onAddItem()}
                            >
                                Add
                            </div>
                        </div>
                        <ul 
                            className='list tc ph0'
                            onClick={(e) => this.onItemClick(e.target,'list')}
                        >
                            {this.items(itemsArray, 'list')}
                        </ul>
                    </div>
                    <div 
                        className='dt center w-100 mt4'
                        onClick={(e) => this.onButtonClick(e.target)}
                    >
                        <div className='dtc v-mid w-50'>
                            <div 
                                className='tc link dim ba bw1 pv2 ph3 br-pill green mh2 button'
                                id='saveList'
                            >
                                Save
                            </div>
                        </div>
                        <div className='dtc v-mid w-50'>
                            <div 
                                className='tc link dim ba bw1 pv2 ph3 br-pill light-red mh2 button'
                                id='cancelList'
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dtc w-30-l w-40-m w-50 bl bw1 b--gray'>
                    <h2 className='tc'>
                        Common items
                    </h2>
                    <ul 
                        className='list tc ph0'
                        onClick={(e) => this.onItemClick(e.target,'common')}
                    >
                        {this.items(commonItems, 'common')}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ModifyList;