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

    function handleChildStateChange(childState) {
        setRetrievedData(prev => prev.push(childState))
        
    }
/*     function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setValidated(false);
    } */

/*     function submitNewWorkout(event) {
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
            .then( data => {
                if (data.status === 201) {
                    setRetrievedData((data) => data.push(formData))
                    setValidated(false)
                }
                
            })
            .catch((error) => console.error(error));
            //!Handle submit on frontend
    } */

    function handleTaskDeletion(event) {
        if (isNaN(event.target.id)) return
        console.log('Delete called (client)')
        fetch('http://localhost:5000/api/delete/' + event.target.id, {
            method: 'DELETE'
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.status == 204) { 
                setTaskDeleted(true)
                //Remove task from frontend
                setRetrievedData(retrievedData.filter(workout => workout.id !== event.target.id))
            } else {
                setTaskDeleted(false)
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
                        {taskDeleted ? (<Alert>
                            Task successfully deleted!
                        </Alert>) : <span></span>}
                        <Accordion defaultActiveKey={null}>
                            {retrievedData ? (retrievedData.map((item) => {
                                return (
                                    <Accordion.Item eventKey={item.id}>
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
                                );})) : (
                                    <Spinner animation="border" role="status">
                                    </Spinner>
                                )
                            }
                        </Accordion>
                    </li>
                    <li className="new-workout" key="addNewItem">
                        {/* <Form
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
                        </Form> */}
                        <WorkoutForm exerciseOptions={exerciseOptions} onChildStateChange={handleChildStateChange}></WorkoutForm>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default App;
