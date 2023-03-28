import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [backendData, setBackendData] = useState([{}]);

    //!Not fetching
    useEffect(() => {
        fetch('/api').then(
            res =>
                res.json()
        ).then(
            response => setBackendData(response)
        )
    }, [])

    return (
        <div>
            <div className="bordered">
               {(typeof backendData === 'undefined') ? (
                <p>Loading...</p>
                ):
                (<div>
                    <h2>Got:</h2>
                    <p>{backendData}</p>
                </div>)}
            </div>
        </div>
    );
}

export default App;
