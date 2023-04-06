import { useEffect, useState } from "react";

import { Form, Button, Alert } from "react-bootstrap";

export default function WorkoutForm(props) {
    const [formData, setFormData] = useState({
        exercise: props.exerciseOptions[0],
    });
    const [validated, setValidated] = useState(false);
    const [workoutExists, setWorkoutExists] = useState(false);

    useEffect(() => {
        let timeout;
        if (workoutExists) {
            setValidated(false);
            timeout = setTimeout(() => {
                setWorkoutExists(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [workoutExists]);

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
            .then((data) => {
                console.log(data);
                if (data.status === 201 || data.status === 200) {
                    // setRetrievedData((data) => data.push(formData));
                    setValidated(false);
                    props.onChildStateChange(formData);
                } else if (data.status === 500) {
                    setWorkoutExists(true);
                }
            })
            .catch((error) => console.error(error));
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setValidated(false);
    }

    return (
        <Form onSubmit={submitNewWorkout} noValidate validated={validated}>
            {workoutExists && (
                <Alert variant="warning" style={{ marginTop: 20 }}>
                    A workout with this name already exists
                </Alert>
            )}
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
                        {props.exerciseOptions.map((ex) => (
                            <option key={ex} value={ex}>
                                {ex}
                            </option>
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
    );
}
