import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min"

const DisplayPokemon = (props)=>{
    
    const location = useLocation()
    const history = useHistory()
    let bookmarkMsg
    const url = `https://pokeapi.co/api/v2/pokemon-species/${location.state.name}`
    const [pokemonDetail, setPokemonDetail] = useState({})
    
    useEffect(()=>{
       localStorage.removeItem('entry')
       axios.get(url)
            .then(result=>{
                setPokemonDetail({...pokemonDetail,color: result.data.color.name, growth_rate: result.data.growth_rate.name, habitat: result.data.habitat.name, shape: result.data.shape.name})
            })
            .catch(e=>{
                console.log('Error occures', e)
            })
    },[]) // page load will remove any other value than bookmark from the localstorage & will add the pokemondetail data

    const addBookmark = ()=>{
        let existingEntries = JSON.parse(localStorage.getItem("bookmarks")); // 1. We need to fetch the existing bookmark data from local storage
        if(existingEntries == null) existingEntries = [];
        let entry = {                                                        // 2. We need to set an entry key with the user selected data
            "name": location.state.name,  
            "color": pokemonDetail.color,
            "imageSrc": location.state.imagesrc,
            "growth_rate": pokemonDetail.growth_rate,
            "habitat": pokemonDetail.habitat,
            "shape": pokemonDetail.shape
        };
        if(existingEntries.length == 0){                                    
            localStorage.setItem("entry", JSON.stringify(entry));           //3. setting the entry in local storage. Entry here is treated as bookmark key's child element
            existingEntries.push(entry);
            localStorage.setItem("bookmarks", JSON.stringify(existingEntries)); // 4. Finally, bookmarks main array is set with entry child elements
           
        }
        else{
            const value = existingEntries.find(e=>e.name === entry.name)    // This logic is to check if user is adding same item as bookmark.
            if(value == undefined){
                localStorage.setItem("entry", JSON.stringify(entry));
                existingEntries.push(entry);
                localStorage.setItem("bookmarks", JSON.stringify(existingEntries));
            }
            else{
                bookmarkMsg = 'Bookmark already exists! Go to home again for new selection'
            }
        }
    }
   return(
    <div>
        <div style={{display: "flex", padding: "20px", justifyContent: "center"}}>
                <h2>PokeDex</h2>
        </div>
        <div style={{padding: "10px",display: "flex", justifyContent: "center"}}>
                <ul>
                    <div style={{width: "350px", paddingLeft:"80px", height: 'auto',borderRadius:"25px", padding: "20px", backgroundColor: "#F0FFFF"}}>
                                    <h5>{location.state.name} </h5>
                                    <img src={location.state.imagesrc} width="200px"/> <br/>
                                    <div style={{padding: "10px"}}>
                                        <h4> Color</h4>
                                        <p>{pokemonDetail.color}</p>
                                        <h4> Growth Rate</h4>
                                        <p>{pokemonDetail.growth_rate}</p>
                                        <h4>Habitat</h4>
                                        <p>{pokemonDetail.habitat}</p>
                                        <h4>Shape</h4>
                                        <p>{pokemonDetail.shape}</p>
                                    </div>
                        <button type="button" className="btn btn-info" onClick={()=>{
                                    history.push("/")
                        }}>Back</button>
                        <span>&nbsp; &nbsp;</span>
                        <button type="button" className="btn btn-primary" onClick={()=>{
                            addBookmark()
                            history.push({
                                pathname: "/bookmark",
                                state:{      // Passing all the variables here in the state
                                    name: location.state.name,
                                    imageSrc: location.state.imagesrc,
                                    color: pokemonDetail.color,
                                    growth_rate: pokemonDetail.growth_rate,
                                    habitat: pokemonDetail.habitat,
                                    shape: pokemonDetail.shape,
                                    bookmarkMessage: bookmarkMsg
                                }
                            })
                        }}>Bookmark</button>
                    </div>   
                </ul>
        </div>
    </div>
   )

}
export default DisplayPokemon
