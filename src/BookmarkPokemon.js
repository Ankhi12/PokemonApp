import { useEffect, useState } from "react"
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min"

const BookmarkPokemon = (props)=>{
    
   const location = useLocation()
   const history = useHistory()
   const [message, setMessage] = useState('')
   const [bookmarkdata, setBookmarkData] = useState([])
   const [isremoved, setIsRemoved] = useState(false)
   const data = JSON.parse(localStorage.getItem('bookmarks'))

   useEffect(()=>{
    setBookmarkData([...data])
   },[]) // This is to set the state variable bookmarkdata initially

   const removeData = (event, name)=>{ // This logic will remove the selected data from both the UI & the localstorage.
       setIsRemoved(true)
       const filterData = bookmarkdata.filter(e=>{
        return e.name!=name
       })
       localStorage.removeItem('bookmarks') 
       localStorage.removeItem('entry')
       localStorage.setItem('bookmarks',JSON.stringify(filterData))
       setBookmarkData([...filterData])
       
   }

   if(data.length!= 0){
     if(location.state.bookmarkMessage){
        return(
            <div>
                 <div style={{padding: "90px",display: "flex", justifyContent: "center"}}>
                    <h6 color="red">{location.state.bookmarkMessage}</h6>
                    <span>&nbsp; &nbsp; &nbsp;</span>
                    <button type="button" className="btn btn-info" onClick={()=>{
                        history.push('/')
                    }}>Home</button>
                 </div>
            </div>
        )
     }
    else{
    return(
        <div>
            {console.log('bookmark data', bookmarkdata)}
             <div style={{display: "flex", padding: "80px", justifyContent: "center"}}>
                    <h2>PokeDex</h2><br/>
            </div>
            <div style={{padding: "0px",display: "flex", justifyContent: "center"}}>
                     <ul>
                        {
                            bookmarkdata.map((e,i)=>{
                            console.log('The value is', e)
                            return(
                                <div key={i}>
                                    <div style={{width: "350px", borderRadius:"25px", padding: "20px", backgroundColor: "#F0FFFF"}}>
                                        <h5>{e.name}</h5>
                                        <img src={e.imageSrc}/>
                                        <h4> Color</h4>
                                        <p>{e.color}</p>
                                        <h4> Growth Rate</h4>
                                        <p>{e.growth_rate}</p>
                                        <h4>Habitat</h4>
                                        <p>{e.habitat}</p>
                                        <h4>Shape</h4>
                                        <p>{e.shape}</p>
                                        <button type="button" className="btn btn-warning"
                                         onClick={(event,name)=> removeData(event,e.name)}>Remove</button>
                                         <span>&nbsp; &nbsp;</span>
                                         <button type="button" className="btn btn-info"
                                         onClick={()=>{
                                            history.push('/')
                                         }}>Home</button>
                                    </div>  <span>&nbsp; &nbsp;</span>
                                </div> 
                                )
                            })
                        }
                    </ul>
            </div>
        </div>
       )
    } 
   }
   else if(data.length == 0){
    const message = 'No Bookmarks added!'
    return(
        <div style={{padding: "150px", display: 'flex', justifyContent: 'center'}}>
           <h1>{message}</h1>
        </div>
    )
   }
}
export default BookmarkPokemon
