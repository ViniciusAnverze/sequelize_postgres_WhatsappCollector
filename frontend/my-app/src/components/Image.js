function Image(props){
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px'}}>
            <img style={{width: '200px', height: '200px'}} src={props.imageURL}></img>
        </div>
    )
}

export default Image