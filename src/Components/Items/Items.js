import React from 'react';

const Items = ({listName, itemsArray}) => {

    const items = itemsArray.length ?
        itemsArray.map(item => 
            <li 
                className='link dim ma2 button'
                key={item.name}
            >
                {item.name}
            </li>
        )
        :
        <li>No item</li>;

    return (
        <div className='pa2'>
            {
                listName !== '' ?
                    <div>
                        <h2 className='tc'>
                            {listName}
                        </h2>
                        <ul className='list tc ph0'>
                            {items}
                        </ul>
                        <div className='dt w-100'>
                            <div className='dtc v-mid tl'>
                                <div className='tc link dim ba bw1 pa2 br-pill blue ma3 button'>
                                    Modify list
                                </div>
                            </div>
                            <div className='dtc v-mid tr'>
                                <div className='tc link dim ba bw1 pa2 br-pill light-red ma3 button'>
                                    Delete list
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='tc'>
                        Select a list
                    </div>
            }
        </div>
    );

}

export default Items;