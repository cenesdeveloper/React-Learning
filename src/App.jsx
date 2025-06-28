const Card = ({ title }) => {
    return (
        <div className="card">{title}</div>
    )
}

const App = () => {
    return (
        <div className="card-container">
            <Card title="Star Wars" rating={5} isCool={true} actors={[{name:'Actors'}]}/>
            <Card title="Avatar"/>
            <Card title="The Lion King"/>
        </div>
    )
}

export default App
