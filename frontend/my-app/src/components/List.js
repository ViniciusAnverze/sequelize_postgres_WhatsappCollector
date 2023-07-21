import React, {useState} from 'react'
import Image from './Image'

function List(){

    const [ids, setIds] = useState([])
    const [url, setUrl] = useState('')

    async function fetchIDs(){
        const response = await fetch('http://localhost:5001/IDs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseJSON = await response.json()
        const allIDs = JSON.parse(responseJSON)
        setIds(allIDs?.IDs)
    }

    async function fetchImageURL(imageId){
        const response = await fetch('http://localhost:5001/imageURL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: imageId
            })
        })
        const data = await response.json()
        const image = JSON.parse(data)
        setUrl(image.photourl)
    }

    return (
        <div>
            <button onClick={fetchIDs}>Refresh</button>
            
            <ul style={{listStyleType: 'none'}}> 
            {
                ids && ids.map((item) => {
                    return (<>
                    <li style={{marginTop: '30px', fontSize: '24px'}} key={item} onClick={() => {fetchImageURL(item)}}>{item}</li>
                    </>)
                })
            }
            </ul>
            <hr></hr>
            {
                url && <Image imageURL={url}/>
            }
        </div>
    )
}

export default List