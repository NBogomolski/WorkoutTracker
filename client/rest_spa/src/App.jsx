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
import DropdownList from "./components/DropdownList";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import axios from "axios";

function App() {
    const [accordionClicked, setAccordionClicked] = useState(false);
    const [validated, setValidated] = useState(false);
    const [retrievedData, setRetrievedData] = useState([]);
    const [formData, setFormData] = useState({exercise: "Barbell press"});
    const [serverDataLoaded, setServerDataLoaded] = useState(false);
    const [taskDeleted, setTaskDeleted] = useState(false);

    const exerciseOptions = ["Barbell press", "Barbell squat"];

    function fetchWorkouts() {
        fetch("http://localhost:5000/api/workouts")
            .then((res) => res.json())
            .then((data) => {
                setRetrievedData(data.workouts);
                console.log(retrievedData);
            })
            .then(() => setServerDataLoaded(true))
            .catch((err) => {
                console.error(err);
                setServerDataLoaded(false);
            });
    }

    useEffect(() => {
        // axios.get("http://localhost:5000/api/workouts")
        // .then(data => {
        //     setRetrievedData(data.workouts)
        //     console.log(retrievedData);
        // })
        fetchWorkouts();

    }, []);


    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setValidated(false);
    }

    function submitNewWorkout(event) {
        event.preventDefault();
        setValidated(true);
        if (event.currentTarget.checkValidity() === false) return;
        fetch("http://localhost:5000/api/new-workout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
        fetchWorkouts()
    }

    function handleTaskDeletion(id) {
        if (isNaN(id)) return
        fetch('http://localhost:5000/api/workouts/delete/' + id, {
            method: 'DELETE'
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.status == 500) { 
                setTaskDeleted(true)
                
            }                

        })
        .catch((error) => console.error(error))
    }

    return (
        <div>
            <header className="header">
                <h1>GYM SET COUNTER</h1>
            </header>
            <section className="workouts">
                {/* {retrievedData ? ( */}
                
                {/*              ) : (
                    <p>Not loaded</p>
                )} */}
                <ul className="workout-list">
                    <li key="retrievedItems">
                        //!Not working
                        {taskDeleted ? (<Alert>
                            Task successfully deleted!
                        </Alert>) : <span></span>}
                        <Accordion defaultActiveKey={null}>
                            {retrievedData ? (retrievedData.map((item) => {
                                return (
                                    <Accordion.Item eventKey={item.id}>
                                        <Accordion.Header className="flex-horizontal justify-content-around">
                                            <h2>{item.date}</h2>
                                            <h2>{item.title}</h2>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <h2>Exercise</h2>
                                            <Button variant="danger" onClick={handleTaskDeletion(item.id)}>Delete</Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );})) : (
                                    <Spinner animation="border" role="status">
                                        <span>loading...</span>
                                    </Spinner>
                                )
                            }
                        </Accordion>
                    </li>
                    <li className="new-workout" key="addNewItem">
                        <Form
                            onSubmit={submitNewWorkout}
                            noValidate
                            validated={validated}
                        >
                            <Form.Group>
                                <Form.Label>Workout Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    onChange={handleInputChange}
                                    required
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Workout title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    onChange={handleInputChange}
                                    required
                                ></Form.Control>
                            </Form.Group>
                            <div>
                                <Form.Group>
                                    <Form.Label>Exercise</Form.Label>
                                    <Form.Select
                                        name="exercise"
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {/*                                         <option>
                                            <Form.Control type="text"></Form.Control>
                                        </option> */}
                                        {exerciseOptions.map((ex) => (
                                            <option value={ex}>{ex}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Reps</Form.Label>
                                    <Form.Control
                                        name="reps"
                                        type="number"
                                        min="0"
                                        max="50"
                                        onChange={handleInputChange}
                                        required
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Must be between 0 and 50
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <Button className="btn-submit" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default App;
