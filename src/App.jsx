import {useState, useEffect} from "react";

const Card = ({ title }) => {
    // Having it here allows each card to be managed separately
    const [count, setCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    useEffect(() => {
        console.log(`The card ${title} has been liked ${hasLiked}`)
    }, [hasLiked]);


    return (
        <div className="card" onClick={() => setCount(count + 1)}>
            <h2>{title} <br/> {count || null}</h2>

            <button onClick={() => setHasLiked(!hasLiked)}>
                {hasLiked ? 'Liked' : 'Like'}
            </button>
        </div>

    )
}

const App = () => {

    return (
        <div className="card-container">
            <Card title="Star Wars" rating={5} isCool={true} />
            <Card title="Avatar"/>
            <Card title="The Lion King"/>
        </div>
    )
}

export default App
