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
    const [retrievedData, setRetrievedData] = useState([]);
    const [taskDeleted, setTaskDeleted] = useState(false);
    const [taskSuccessfullyAdded, setTaskSuccessfullyAdded] = useState(false)

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
    const delayTime = 3000
 
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
            }, delayTime)
        }
        return () => clearTimeout(timeout);
    }, [taskDeleted])

    useEffect(() => {
        let timeout;
        if (taskSuccessfullyAdded) {
            timeout = setTimeout(() => {
                setTaskSuccessfullyAdded(false);
            }, delayTime);
        }
        return () => clearTimeout(timeout);
    }, [taskSuccessfullyAdded]);

    function handleChildStateChange(childState) {
        console.log(retrievedData)
        setRetrievedData(prev => [...prev, {id: prev.length > 0 ? prev.at(-1).id + 1 : 1, ...childState}])
        setTaskSuccessfullyAdded(true)
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
                // console.log(event)
                // console.log(retrievedData.filter(wkout => wkout.id !== event.target.id))
                setRetrievedData(data => data.filter(workout => workout.id != event.target.id))
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
                <ul className="workout-list">
                    <li key="retrievedItems">
                        {/* !Not working */}
                        {taskDeleted && (
                            <Alert variant="danger">
                                Task successfully deleted!
                            </Alert>
                        )}
                        {taskSuccessfullyAdded && (
                            <Alert variant="success">
                                Task successfully added!
                            </Alert>
                        )}
                        <Accordion defaultActiveKey={null}>
                            {retrievedData.map((item) => {
                                return (
                                    <Accordion.Item
                                        eventKey={item.id}
                                        key={item.id}
                                    >
                                        <Accordion.Header
                                            className="flex-horizontal justify-content-around"
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            <h2>
                                                {new Date(
                                                    item.date
                                                ).toLocaleDateString()}
                                            </h2>
                                            <h2>{item.title}</h2>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <h2>Exercise:</h2>
                                            <p>
                                                {item.exercise}, {item.reps}
                                            </p>
                                            <Button
                                                variant="danger"
                                                onClick={handleTaskDeletion}
                                                id={item.id}
                                            >
                                                Delete
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion>
                    </li>
                    <li className="new-workout" key="addNewItem">
                        <h1>Log a new workout:</h1>
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
