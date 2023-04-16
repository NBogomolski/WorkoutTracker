import {useState, useEffect} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';

export default function LogInForm(props) {
    const [wrongPassword, setWrongPassword] = useState(false)

    useEffect(() => {
        let timeout;
        if (wrongPassword) {
            timeout = setTimeout(() => {
                setWrongPassword(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [wrongPassword]);

    function onSubmitUserData(event) {
        event.preventDefault();
        fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: event.target.username.value,
                password: event.target.password.value,
            }),
        }).then(res => res.json())
        .then((res) => {
            console.log(res);
            if (res.token && res.userId){
                props.onUserLogIn(res);
            }
            else 
                setWrongPassword(true);
        });
    }

    return (
        <Form onSubmit={onSubmitUserData} className="workout-list">
            {wrongPassword && <Alert variant='danger'>
                Wrong username or password entered!
            </Alert>}
            <h1>Sign in:</h1>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    required
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    required
                ></Form.Control>
            </Form.Group>
            <Form.Group style={{ marginTop: 20 }}>
                <Button className="btn-submit" type="submit">
                    Log in
                </Button>
            </Form.Group>
        </Form>
    );
}