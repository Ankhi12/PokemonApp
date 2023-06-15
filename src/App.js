import './App.css';
import { Switch, Route, Link} from 'react-router-dom';
import ListPokemon from './ListPokemon';
import SearchPokemon from './SearchPokemon';
import DisplayPokemon from './DisplayPokemon';
import BookmarkPokemon from './BookmarkPokemon';
import {Navbar,Nav} from "react-bootstrap"

function App() {
  return (
    <>
      <>
      <nav className='fixed-top'>
      <Navbar padding= "20px" bg="dark" variant={"dark"} expand="lg">
        <Navbar.Brand href="/">PokeDex</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="mr-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                  navbarScroll
            >
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/search">Search</Nav.Link>
              <Nav.Link as={Link} to="/bookmark">Bookmark</Nav.Link>
            </Nav>
           </Navbar.Collapse>
        </Navbar>
      </nav>
      </>
      <Switch>
        <Route path="/" exact={true} component = {ListPokemon}/>
        <Route path="/search" exact={true} component = {SearchPokemon}/>
        <Route path="/display" exact={true} component = {DisplayPokemon}/>
        <Route path="/bookmark" exact={true} component = {BookmarkPokemon}/>
      </Switch>
    </>
  );
}

export default App;
