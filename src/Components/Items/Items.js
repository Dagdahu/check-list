import React from 'react';

const Items = ({listName, itemsArray, itemClicked, onRouteChange, onDeleteList}) => {


    const items = itemsArray.length ?
        itemsArray.map(item =>
            <li 
                className='link dim ma2 button'
                key={item.name}
            >
                <input className="mr2" type="checkbox" id={item.id} value={item.name} defaultChecked={!item.enable}/>
                <label htmlFor={item.name}>
                    {item.name}
                </label>
            </li>
        )
        :
        <li className='ma2 silver'>
            No item
        </li>;

    let timers = [];
    const onItemClicked = (target) => {
        if(target.type === 'checkbox') {
            /// Wait for the item to stop being clicked for .5s before fetching
            clearTimeout(timers[target.id]);
            timers[target.id] = setTimeout(() => {
                console.log('item clicked, enable :', target.checked ? 0 : 1)
                itemClicked(target.id, target.checked ? 0 : 1);
            }, 500)
        }
    }

    console.log(itemsArray);

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
                            onClick={(event) => onItemClicked(event.target)}
                        >
                            {items}
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

export default Items;