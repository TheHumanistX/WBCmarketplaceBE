import css from "./Homepage.css";
import solicon from '../solicon.png'

function Homepage(props) {

    return (
        <section>
            <div className = "hero">
                <h1>Become a Web3 Programmer Today!</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mi tellus, sodales sed tortor eget, congue lobortis magna. Vivamus egestas neque vel mattis eleifend. Phasellus ullamcorper massa quis purus eleifend.</p>
                <button className = "header-cta"><a href = "/Products">Products</a></button>

            </div>
            <div>
                <img position = "absolute" alt = "test" width = "500" src = {solicon}></img>
            </div>
            
        </section>
    );

}

export default Homepage;