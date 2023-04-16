import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function RegistrationForm() {
    const [validated, setValidated] = useState(false)
    const confirmRef = useRef(null)
    const [passesMatch, setPassesMatch] = useState(false)
    const [successfullyRegistered, setTaskSuccessfullyRegistered] = useState(false)

    useEffect(() => {
        let timeout;
        if (successfullyRegistered) {
            timeout = setTimeout(() => {
                setTaskSuccessfullyRegistered(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [successfullyRegistered]);

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
            }).then(res => {
                console.log(res)
                if (res.status === 201) {
                    setTaskSuccessfullyRegistered(true)
                    event.target.username.value = ''
                    event.target.password.value = ''
                    event.target.confirmPassword.value = ''
                }
            })
        } else {
            setPassesMatch(false)
            console.log('invalid')
            setValidated(true);
        }
    }

    return (
        <Form
            onSubmit={onSubmit}
            noValidate
            validated={validated}
            className="workout-list"
        >
            {successfullyRegistered && (
                <Alert variant="success">
                    User Successfully registered
                </Alert>
            )}
            <h1>Register: </h1>
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
                {validated && !passesMatch && (
                    <Alert variant="danger">
                        Passwords do not match.
                    </Alert>
                )}
            </Form.Group>
            <Form.Group style={{marginTop: 20}}>
                <Button className="btn-submit" type="submit">
                    Sign up
                </Button>
            </Form.Group>
        </Form>
    );
}