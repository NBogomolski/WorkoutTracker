import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

export default function RegistrationForm() {
    const [validated, setValidated] = useState(false)
    const confirmRef = useRef(null)
    const passwordRef = useRef(null)
    const [passesMatch, setPassesMatch] = useState(false)

    function onSubmit(event) {
        event.preventDefault();
        if (event.target.password.value === event.target.confirmPassword.value) {
            setPassesMatch(true)
            fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: event.target.username.value,
                    password: event.target.password.value,
                }),
            }).then(res => console.log(res))
        } else {
            setPassesMatch(false)
            console.log('invalid')
            setValidated(true);
        }
    //     if (!isValid) {
    //         // set the isInvalid state of the input control
    //         confirmRef.current.isValid = false;
    //         confirmRef.current.isInvalid = true;
    //     } else {
    //         // reset the isInvalid state of the input control
    //         confirmRef.current.isValid = true;
    //         confirmRef.current.isInvalid = false;

    //         // submit form logic here
    //     }
    }

    return (
        <Form
            onSubmit={onSubmit}
            noValidate
            validated={validated}
            className="workout-list"
        >
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    required
                    onChange={(e) => setValidated(false)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    required
                    onChange={(e) => setValidated(false)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Enter a password
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                    type="password"
                    name="password_confirmation"
                    required
                    onChange={(e) => setValidated(false)}
                    ref={confirmRef}
                ></Form.Control>
                {/* <Form.Control.Feedback type="invalid">
                    Confirm the password
                </Form.Control.Feedback> */}
                {validated && !passesMatch && (
                    <Alert variant="danger">
                        Passwords do not match.
                    </Alert>
                )}
            </Form.Group>
            <Form.Group>
                <Button className="btn-submit" type="submit">
                    Submit
                </Button>
            </Form.Group>
        </Form>
    );
}