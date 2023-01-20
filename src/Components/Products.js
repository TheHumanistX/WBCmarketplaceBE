import css from './Products.css';
import Card from './Card.js';
import WBCC from '../WBCC.jpg';

function Products(props) {
    return (
        <div>
            <main>
                <section className = "cards">
                    <Card name = "Item1" imageURL={WBCC} description="asdf asdf asdf" />
                    <Card name = "Item2" imageURL={WBCC} description="Other stuff" />
                </section>
            </main>
        </div>
    );
}

export default Products;