import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./styles/App.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Modal,
    Button,
    Alert,
    DropdownButton,
    Dropdown,
    Form,
    Accordion,
    Spinner,
    Row,
    Col
} from "react-bootstrap";
import WorkoutForm from "./components/WorkoutForm";

function App() {
    // const [accordionClicked, setAccordionClicked] = useState(false);
    // const [validated, setValidated] = useState(false);
    const [retrievedData, setRetrievedData] = useState([]);
    // const [formData, setFormData] = useState({exercise: "Barbell press"});
    const [taskDeleted, setTaskDeleted] = useState(false);
    const exerciseOptions = [
        "Barbell press",
        "Barbell squat",
        "Ez barbell curl",
        "Skull crusher",
        "Dips",
        "Pull-ups",
        "Shoulder press",
        "Lateral pulldowns",
        "Lateral raises"
    ]
 
    useEffect(() => {
        fetch("http://localhost:5000/api/workouts")
            .then((res) => res.json())
            .then((data) => {
                setRetrievedData(data);
                // data.workouts.map(item => {exerciseOptions.push(item.exercise)})
                console.log(data)
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    useEffect(() => {
        let timeout
        if (taskDeleted) {
            timeout = setTimeout(() => {
                setTaskDeleted(false);
            }, 4000)
        }
        return () => clearTimeout(timeout);
    }, [taskDeleted])

    function handleChildStateChange(childState) {
        console.log(retrievedData)
        setRetrievedData(prev => [...prev, childState])
    }

    function handleTaskDeletion(event) {
        if (isNaN(event.target.id)) return
        console.log('Delete called (client)'+ event.target.id)
        fetch('http://localhost:5000/api/delete/' + event.target.id, {
            method: 'DELETE'
        })
        // .then(response => console.log(response))
        .then((data) => {
            console.log(data)
            if (data.status == 204 || data.status == 200) { 
                setTaskDeleted(true)
                //Remove task from frontend
                setRetrievedData(data => data.filter(workout => workout.id !== event.target.id))
            }
        })
        .catch((error) => console.error(error))
    }

    return (
        <div>
            <header className="header">
                <h1>Workout tracker</h1>
            </header>
            <section className="workouts">
                {/* {retrievedData ? ( */}
                
                {/*              ) : (
                    <p>Not loaded</p>
                )} */}
                <ul className="workout-list">
                    <li key="retrievedItems">
                        {/* !Not working */}
                        {taskDeleted && (<Alert variant="danger">
                            Task successfully deleted!
                        </Alert>)}
                        <Accordion defaultActiveKey={null}>
                            {retrievedData.map((item) => {
                                return (
                                    <Accordion.Item eventKey={item.id} key={item.id}>
                                        <Accordion.Header className="flex-horizontal justify-content-around">
                                            <h2>{new Date(item.date).toLocaleString()}</h2>
                                            <h2>{item.title}</h2>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <h2>Exercise:</h2>
                                            <p>{item.exercise}, {item.reps}</p>
                                            <Button variant="danger" onClick={handleTaskDeletion} id={item.id}>Delete</Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );})
                            }
                        </Accordion>
                    </li>
                    <li className="new-workout" key="addNewItem">
                        <WorkoutForm 
                            exerciseOptions={exerciseOptions}
                            onChildStateChange={handleChildStateChange}
                        />
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default App;
