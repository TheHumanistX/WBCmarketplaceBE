import './App.css';
import {BrowserRouter as Router, Switch, Route, Routes}  from 'react-router-dom';
import Homepage from './Components/Homepage.js';
import Products from './Components/Products.js';

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <div className = "logo">
            <h1><a href ="#">GrandPa's Toolbox</a></h1>
          </div>

          <ul>
            <li><a href="./">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li className = "nav-cta"><a href = "#">Connect</a></li>
          </ul>
        </nav>
      </header>

      <Router>
        <Routes> 
          <Route path = "/" element = {<Homepage /> } />
          <Route path = "/Products" element = {<Products />} />

        </Routes>
        
      </Router>
    </div>
  );
}

export default App;
