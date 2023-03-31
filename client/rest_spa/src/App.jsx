import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./styles/App.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Alert, DropdownButton, Dropdown, Form, Accordion } from 'react-bootstrap'
import DropdownList from './components/DropdownList'
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import axios from 'axios'

function App() {
    const [accordionClicked, setAccordionClicked] = useState(false)
    const [validated, setValidated] = useState(false);
    const [retrievedData, setRetrievedData] = useState([])
    const [formData, setFormData] = useState({});
    const [serverDataLoaded, setServerDataLoaded] = useState(false);

    const exerciseOptions = ['Barbell press', 'Barbell squat']

    useEffect(() => {
        // axios.get("http://localhost:5000/api/workouts")
        // .then(data => {
        //     setRetrievedData(data.workouts)
        //     console.log(retrievedData);
        // })

        fetch('http://localhost:5000/api/workouts')
        .then(res => res.json())
        .then(data => {
            setRetrievedData(data.workouts)
            console.log(retrievedData);
        })
        .then(() => setServerDataLoaded(true))
        .catch(err => {
            console.error(err)
            setServerDataLoaded(false)
        })
    }, [])

    function handleInputChange(event) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
        setValidated(false)
    }

    function submitNewWorkout(event) {
        event.preventDefault()
        setValidated(true)
        if (event.currentTarget.checkValidity() === false) return
        fetch("http://localhost:5000/new-workout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
        
    }

    return (
        <div>
            <header className="header">
                <h1>GYM SET COUNTER</h1>
            </header>
            <section className="workouts">
                <ul className="workout-list">
                    <li key="retrievedItems">
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <h2>Date</h2>
                                    <h2>Title</h2>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {serverDataLoaded ? (
                                        retrievedData.map(item => {
                                            <li key={item.id}>
                                                {item.title}
                                            </li>
                                        }
                                        )
                                    ) : (
                                        <p>Not loaded</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
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
