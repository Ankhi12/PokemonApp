import {useState, useEffect} from 'react'
import axios from 'axios'

const SearchPokemon = (props)=>{

    const [isLoadingSearch, setIsLoadingSearch] = useState(false)
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [pokemonName, setPokemonName] = useState('')
    const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    const [pokemonURL, setPokemonURL] = useState('')
    const [pokemonDetail, setPokemonDetail] = useState([])
    const [formSubmit, setFormSubmit] = useState(false)

    const serachValue = (e)=>{
        setErrorMessage('')
        setPokemonName(e.target.value.toString().toLowerCase()) // converting inserted text case to lower case by default
        setPokemonDetail([])
    }
    
    const formData = (e)=>{ // Logic of search data is by fetching all the pokemon data and then matching it with the user entered data, and then concequently searching for the relevant details.
        e.preventDefault()
        setIsLoadingSearch(true)
        if(pokemonName){
            axios.get(url)
                 .then((result)=>{
                    const data = result.data.results
                    data.forEach(e=>{
                        if(e.name == pokemonName){
                            setPokemonURL(e.url)
                        }
                        else{
                            setErrorMessage('No data exist!')
                            setIsLoadingSearch(false)
                            setMessage('')
                        }
                    })
                 })
                 .catch()
        }
        setPokemonName('')
    }
    useEffect(()=>{
        if(pokemonURL){
            setMessage('Data is Loading')
            axios.get(pokemonURL)
            .then(result=>{
               setIsLoadingSearch(false)
               setMessage('')
               const name = result.data.species.name
               const imageSrc = result.data.sprites.front_default
               setPokemonDetail([...pokemonDetail,{name: name, imageSrc: imageSrc, ability: result.data.abilities, type: result.data.types}])
            })
            .catch(e=>{
               setIsLoadingSearch(false)
               if(e.message.code === "ERR_BAD_REQUEST"){
                setMessage('No Page Found!')
               }
            })       
        }
    }, [pokemonURL])
    if(isLoadingSearch){
        return (
            <h1 style={{padding: "200px", display: 'flex'}}>{message}</h1>
        )
    }
    return(
        <>
            <div>
            <div style={{display: "flex", padding: "150px", justifyContent: "center"}}>
                 {errorMessage && <h3>{errorMessage}</h3>}
                 <h5 className='display-5'>Search Your</h5><br/>
                 <h2 className='display-2'>Favourite Pokemon</h2>
             </div>
             <div style={{display: "flex", padding: "5px", justifyContent: "center"}}>
             <form onSubmit={(e)=>formData(e)}>
                 <input type="text" value={pokemonName} onChange={(e)=>serachValue(e)} placeholder="Enter your text" size="60"/>
                 <span>&nbsp;&nbsp;</span>
                 <input type="submit" value="Search"/> 
             </form>
             </div>
             <div style={{padding: "10px", display: "flex", justifyContent: "center"}}>
                  <ul>
                     {
                     pokemonDetail.map((e,i)=>{
                         const abilityArray = e.ability
                         return (
                             <div key={i}>
                                 <br/>
                                 <div style={{width: "350px", borderRadius:"25px", padding: "20px", backgroundColor: "#F0FFFF"}}>
                                     <h5>{e.name} </h5>
                                     <h6>Abilities</h6>
                                     {
                                     abilityArray.map((element, i)=>{
                                        return (
                                         <>
                                            <span key = {i} className='fs-5'> {element.ability.name}&nbsp;&nbsp;</span>
                                         </>
                                        )
                                     })
                                     }
                                      <img src={e.imageSrc}/>
                                     <div style={{width: "10%", padding: "10px", display: "inline"}}>
                                        <h6>Types</h6>
                                         {   
                                             e.type.map((ele,i)=>{
                                             return(
                                              < >
                                             <span key = {i} className='fs-5'> {ele.type.name}&nbsp;&nbsp;</span>
                                             </>
                                         )
                                         })
                                         }
                                      </div>
                                 </div>
                             </div>
                         )
                     })
                 }
                  </ul>
             </div>
         </div>
        </>
    )
}
export default SearchPokemon
