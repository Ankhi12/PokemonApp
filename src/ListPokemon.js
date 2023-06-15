import {useState, useEffect} from 'react'
import axios from "axios";
import DisplayPokemon from './DisplayPokemon';
import './ListPokemon.css'
import { Route, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ListPokemon = (props)=>{

    const [isLoading, setIsLoading] = useState(false)
    const [pokemons, setPokemons] = useState([])
    const [ability, setAbility] = useState([])
    const [abilityFilter, setAbilityFilter] = useState([])
    const [nextPage, setNextPage] = useState('')
    const [check, setCheck] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')
    const history = useHistory()
    const imageIntrArray = []
    const filterImageInterArray = []
    const filterAbilityArray = []
    const [originalURL, setOriginalURL] = useState('https://pokeapi.co/api/v2/pokemon')

    useEffect(()=>{  // This will fetch the API data and have logic about data loading messages etc.
                setIsLoading(true)
                setLoadingMessage('Data is loading!')
                axios.get(originalURL)
                     .then(result=>{
                        setIsLoading(false)
                        const data = result.data.results
                        const pokemonImage = data.map(e=>{
                            axios.get(e.url)
                                 .then(imageResult=>{
                                    const imageURL = imageResult.data.forms[0].url // Extracted Pokemon image source link
                                    axios.get(imageURL)
                                          .then(image=>{
                                                const imageSrc = image.data.sprites.front_default // Releveant image url
                                                imageIntrArray.push({name: e.name, url: imageSrc, types: e.types, types:imageResult.data.types}) // an intermedieate array to store important data
                                                setPokemons([...imageIntrArray]) // copying the intermediate data one by one into the state array variable.
                                          })
                                          .catch(err=>{
                                            console.log('error occured while loading the image!')
                                          })
                                 })
                                 .catch('An error occured while loading image!')
                        })
                        const nextPage = setNextPage(result.data.next) // This logic is to get next 20 data 
                     })
                     .catch(error=>{
                        setIsLoading(false)
                        console.log('The error is', error)
                     })
                axios.get('https://pokeapi.co/api/v2/ability') // To fetch all the ability data for filter choices
                    .then((ability,i)=>{
                        ability.data.results.map(e=>{
                        filterAbilityArray.push({name: e.name, url: e.url, index: i})
                        setAbilityFilter([...filterAbilityArray])
                        })
                    })
                    .catch(e=>{
                        console.log('Error in fetching ability', e)
                    })
    }, [originalURL]) // The dependency is for if next page is selected the OriginalURL should also change.
    
    window.addEventListener('scroll',()=>{ // Code for infinite scroll
        if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
            if(nextPage){
            setOriginalURL(nextPage)
            }
        }
    })

    const abilityDropDown = (event)=>{
        setCheck(true)
        axios.get('https://pokeapi.co/api/v2/ability')
            .then(result=>{
                const abilityList = result.data.results
                abilityList.forEach(e=>{
                    const abilityName = e.name
                    if(abilityName == event.target.value){
                        axios.get(e.url)
                              .then(abilityResult=>{
                                const pokemonList = abilityResult.data.pokemon
                                pokemonList.forEach(pokemonele=>{
                                    axios.get(pokemonele.pokemon.url)
                                         .then((pokemon)=>{
                                            const pokeName = pokemon.data.forms[0].name
                                             const imageURL = pokemon.data.forms[0].url
                                            axios.get(imageURL)
                                                 .then(image=>{
                                                    const imageSrc = image.data.sprites.front_default
                                                    filterImageInterArray.push({ability: abilityName, name: pokeName, url: imageSrc, types: e.types, types:image.data.types})
                                                    setAbility([...filterImageInterArray]) // This array stores all the pokemon data as per the filtered options.
                                                   })
                                                   .catch(error=>console.log('Error Occured!'))
                                    })
                                          .catch(e=> console.log('Error occured', e))
                              })
                              .catch(e=> console.log(e))   
                    })
                    .catch(e=> console.log(e))
                    }
                })
            })
            .catch(e=>{
                console.log("Error occured", e)
            })
    }

    return(
        <div>
        {
            check == true &&  // if the filter is selected
            <div>
            <div style={{display: "flex", marginTop: "15px", justifyContent: "center"}}>
                <h4> PokeDex</h4>
            </div>
                <div style={{ margin: "0", padding: "0", width: "200px", backgroundColor: "#f1f1f1", position: "fixed", height: "100%", overflow: "auto"}}>
                <div style={{marginTop: "70px", marginLeft: "25px"}}>
                    <h5> Filter By</h5>
                    <label>Ability:</label>
                    <select onChange={(e)=>abilityDropDown(e)}>
                    { 
                        abilityFilter.map((e,i)=>{
                            return <option key = {i} value={e.name}>{e.name}</option>
                        })
                    }
                    </select>
                </div>
            </div>
            <div style={{display: "flex", padding: "20px", justifyContent: "center"}}>
                <h2>PokeDex</h2>
            </div>
            <div style={{padding: "10px", display: "flex", justifyContent: "center"}}>
                 <ul>
                    {
                    ability.map((e,i)=>{
                        return (
                            <div key={i}>
                                <br/>
                                <div style={{width: "350px", borderRadius:"25px", padding: "20px", backgroundColor: "#F0FFFF"}}>
                                    <h5>{e.name} </h5>
                                     <img src={e.url}/>
                                    <div style={{width: "10%", padding: "10px", display: "inline"}}>
                                        {   
                                            e.types.map((ele,i)=>{
                                            return(
                                             < >
                                            <span key = {i} className='fs-5'>{ele.type.name}&nbsp;&nbsp;</span>
                                            </>
                                        )
                                        })
                                        }
                                    <button className="openModalBtn" onClick={async()=>{
                                        history.push({
                                            pathname: "/display",
                                            state:{
                                                name: e.name,
                                                imagesrc: e.url
                                            }
                                        })
                                     }}>Details</button> 
                                     </div>
                                </div>
                            </div>
                        )
                    })
                }
                 </ul>
            </div>
            </div>
        }
        {isLoading == true && <h1>{loadingMessage}</h1>} // Incase of loading delay
        {check == false && // incase of no filter selection
        <div>
             
            <div style={{ margin: "0", padding: "0", width: "200px", backgroundColor: "#f1f1f1", position: "fixed", height: "100%", overflow: "auto"}}>
                <div style={{marginTop: "70px", marginLeft: "25px"}}>
                    <h5> Filter By</h5>
                    <label>Ability:</label>
                    <select onChange={(e)=>abilityDropDown(e)}>
                    { 
                        abilityFilter.map((e,i)=>{
                            return <option key = {i} value={e.name}>{e.name}</option>
                        })
                    }
                    </select>
                </div>
            </div>
            <div style={{display: "flex", padding: "40px", justifyContent: "center"}}>
                <h2>PokeDex</h2>
            </div>
            <div style={{padding: "10px", display: "flex", justifyContent: "center"}}>
                 <ul>
                    {
                    pokemons.map((e,i)=>{
                        return (
                            <div key={i}>
                                <br/>
                                <div style={{width: "350px", borderRadius:"25px", padding: "20px", backgroundColor: "#F0FFFF"}}>
                                    <h5>{e.name} </h5>
                                    <p>{e.ability}</p>
                                     <img src={e.url}/>
                                    <div style={{width: "10%", padding: "10px", display: "inline"}}>
                                        {   
                                            e.types.map((ele,i)=>{
                                            return(
                                             < >
                                            <span key = {i} className='fs-5'>{ele.type.name}&nbsp;&nbsp;</span>
                                            </>
                                        )
                                        })
                                        }
                                     <button className="openModalBtn" onClick={async()=>{ // Clicking this will open pokemon detail page
                                        history.push({
                                            pathname: "/display",
                                            state:{
                                                name: e.name,
                                                imagesrc: e.url
                                            }
                                        })
                                     }}>Details</button>            
                                     </div>
                                </div>
                            </div>
                        )
                    })
                }
                 </ul>
            </div>
            </div>
            }
    </div>
    )
}
export default ListPokemon
