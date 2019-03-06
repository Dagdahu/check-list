import React from 'react';
import Items from '../Items/Items';
import ModifyList from '../ModifyList/ModifyList';
import { serverBaseUrl } from '../../Constants.js';

const emptyList = {
    id:undefined,
    name:'',
    user_id:undefined
};

const notInArray = (array1, array2) => {
    /// Return an array of elements in array1 that are not in array2
    if (!array1 || !array1.length) {
        return [];
    }
    else if (!array2 || !array2.length) {
        return array1;
    }
    return array1.filter(elem1 => !array2.find(elem2 =>  elem1 === elem2));
}

async function awaitFetch(request, method, body, fallback) {
    try {
        const response = body ?
            await fetch(serverBaseUrl + request, {
                method:method,
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(body)
            })
            :
            await fetch(serverBaseUrl + request, {
                method:method
            });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const json = await response.json();
        return await fallback(json);
    }
    catch(err) {
        console.log('awaitFetch :', err);
    }
}

class Lists extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            userId: this.props.user.id,
            listsArray: this.props.user.lists,
            currentList:emptyList,
            currentItems:[],
            commonItems:[],
            route:'lists'
        };
        if(this.props.user.lists.length) {
            this.updateCurrentList(this.props.user.lists[0])
        }
    }

    componentDidMount () {
        /// Get common items for that user
        fetch(serverBaseUrl + '/items/user/' + this.state.userId, {
            method:'get'
        })
            .then(response => response.json())
            .then(response => {
                if (response === 'Not found') {
                    response = [];
                }
                this.setState({
                    commonItems:response
                })
            })
    }

    /// Create html list out of list array
    readList = (listsArray) => {
        return listsArray.length ?
            listsArray.map(list => 
                <li 
                    className='link dim pa2 ma2 ba br-pill b--silver button'
                    key={list.id}
                    id={list.id}
                >
                    {list.name}
                </li>
            )
            :
            <li className='silver'>
                No list yet.
            </li>;
    }

    updateCurrentList = (newList) => {
        if (!newList || newList === emptyList) {
            this.setState({
                currentList:emptyList,
                currentItems:[]
            });
        }
        else {
            fetch(serverBaseUrl + '/items/list/' + newList.id, {
                method:'get'
            })
                .then(response => response.json())
                .then(response => {
                    if (response === 'Not found') {
                        response = [];
                    }
                    this.setState({
                        currentList:newList,
                        currentItems:response
                    })
                })
        }
    }

    /// Update state on list click
    listClicked = (target) => {
        let newList = emptyList;
        if (target.id !== 'newList') {
            newList = this.state.listsArray.find(list => list.id.toString() === target.id)
        }
        this.updateCurrentList(newList);
    }
    
    onRouteChange = (newRoute) => {
        this.setState({route:newRoute});
    }

    /// Delete list
    onDeleteList = () => {
        fetch(serverBaseUrl + '/list/' + this.state.currentList.id, {
          method:'delete'
        })
            .then(response => response.json())
            .then(response => {
                if (response === 'Nothing to do') {
                console.log('Failed to delete list.');
                }
                else {
                    const newListsArray = this.state.listsArray.filter(list => list !== this.state.currentList);
                    this.setState({
                        listsArray: newListsArray,
                        currentList: emptyList,
                        currentItems: []
                    })
                    if(newListsArray.length) {
                        this.updateCurrentList(newListsArray[0]);
                    }
                }
            })
    }

    /// Create or modify a list
    onSaveList = (newList, itemsArray, commonItems) => {
        /// Update list
        if (newList.id) {
            if(newList.name !== this.state.currentList.name) {
                /// Update existing list
                awaitFetch(
                    '/list/update',
                    'put',
                    {
                        name: newList.name,
                        userId: this.state.userId,
                        listId: newList.id
                    },
                    response => {
                        if(response.id) {
                            this.setState({
                                currentList: response,
                                listsArray: this.state.listsArray.map(list => {
                                    if(list.id === newList.id) { 
                                        list.name = newList.name
                                    }
                                    return list;
                                })
                            });
                        }
                        else {
                            console.log('Failed to update list');
                        }
                    }
                )
            }
            /// Update items
            this.onSaveItems(newList, itemsArray, commonItems);
        }
        else {
            /// Create new list
            fetch(serverBaseUrl + '/list/add', {
                method:'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                    name: newList.name
                })
            })  
            .then(response => response.json())
            .then(response => {
                if (response.id) {
                    /// Success, add new list to lists array
                    this.setState({listsArray: this.state.listsArray.concat(response)});
                    /// Update items
                    this.onSaveItems(response, itemsArray, commonItems);
                }
                else {
                    console.log('Failed to create list')
                    // this.wrongForm('Wrong email/password combination.');
                }
            })
        }
    }

    /// Manage items
    onSaveItems = (list, itemsArray, commonItems) => {
        // Un-link items from list
        let unlinkFetches = [];
        for (let item of notInArray(this.state.currentItems, itemsArray)) {
            unlinkFetches.push(fetch(serverBaseUrl + '/item/unlink/', {
                    method:'post',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({
                        listId: list.id,
                        itemId: item.id
                    })
                })
                .then(response => response.json())
                .then(response => {
                    if (response === 'Nothing to do') {
                        console.log('Failed to unlink list.');
                    }
                }));
        }

        Promise.all(unlinkFetches).then(() => {
            /// Remove deleted common items
            let removeFetches = [];
            let removedItems = notInArray(this.state.commonItems, commonItems);
            for (let item of removedItems) {
                removeFetches.push(
                    fetch(serverBaseUrl + '/item/' + item.id, {
                        method:'delete'
                    })
                    .then(response => response.json())
                    .then(response => {
                        if(response !== 1) {
                            console.log('Failed to delete item');
                        }
                    })
                )
            }
            Promise.all(removeFetches).then(() => {
                // Create or link new items
                let updateFetches = [];
                for (let item of notInArray(itemsArray, this.state.currentItems)) {
                    let request = '';
                    if(!item.id) {
                        /// New item to add in database
                        request = {
                            name :'/item/add',
                            body : {
                                name: item.name,
                                userId: this.state.userId,
                                listId: list.id
                            }
                        }
                    }
                    else {
                        /// Common item to link
                        request = {
                            name :'/item/link',
                            body : {
                                itemId: item.id,
                                listId: list.id
                            }
                        }
                    }
                    updateFetches.push(fetch(serverBaseUrl + request.name, {
                        method:'post',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(request.body)
                    })
                    .then(response => response.json())
                    .then(response => {
                        if (response.id) {
                            /// Success
                            item = response;
                        }
                        else {
                            console.log('Failed to create item')
                        }
                    }));
                }
                Promise.all(updateFetches).then(() => {
                    /// Fetch updated common items
                    fetch(serverBaseUrl + '/items/user/' + this.state.userId, {
                        method:'get'
                    })
                        .then(response => response.json())
                        .then(response => {
                            if (response.length && !response[0].id) {
                                response = [];
                            }
                            this.setState({
                                commonItems:response
                            })
                        })
                    
                    /// Once every fetch is done, set state
                    this.setState({
                        currentList: list,
                        currentItems: itemsArray
                    });
                    this.onRouteChange('list');
                });
            })
        })
    }

    itemClicked = (itemId, enable) => {
        fetch(serverBaseUrl + '/item/list/', {
            method : 'put',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                itemId: itemId,
                listId: this.state.currentList.id,
                enable:enable
            })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(!response.id) {
                console.log('Failed to update item from list');
            }
        })
    }

    render () {
        return (
            <div className='mv4 dark-gray'>
                {this.state.route === 'modifyList' ?
                    <ModifyList 
                        modifiedList={this.state.currentList}
                        itemsArray={this.state.currentItems}
                        commonItems={this.state.commonItems}
                        onRouteChange={this.onRouteChange}
                        onSaveList={this.onSaveList}
                    />
                    :
                    <div>
                        <h1 className='mh3'>
                            Hello {this.props.user.name} !
                        </h1>
                        <div className='db center dt w-100'>
                            <ul 
                                className='dtc w-50 tc list ph3 w-50'
                                onClick={(event) => this.listClicked(event.target)}
                            >
                                {this.readList(this.state.listsArray)}
                                <li 
                                    className='link button green dim mt2 tc ba bw1 br-pill pa2'
                                    id='newList'
                                    onClick={() => this.onRouteChange('modifyList')}
                                >
                                    New list
                                </li>
                            </ul>
                            <div className='dtc w-50 tc bl bw1 b--gray'>
                                <Items
                                    listName={this.state.currentList.name}
                                    itemsArray={this.state.currentItems}
                                    onRouteChange={this.onRouteChange}
                                    onDeleteList={this.onDeleteList}
                                    itemClicked={this.itemClicked}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Lists;