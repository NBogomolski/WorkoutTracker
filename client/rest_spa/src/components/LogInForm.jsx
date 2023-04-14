import {useState, useEffect} from 'react';
import axios from 'axios'
import {Form, Button} from 'react-bootstrap';

export default function LogInForm(props) {

    function onSubmitUserData(event) {
        event.preventDefault();
/*         fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Acess-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({
                username: event.target.username.value,
                password: event.target.password.value,
            }),
            // credentials: 'include'
        })
            .then((data) => data.json())
            .then((res) => console.log(res)); */
        axios.post(
            "http://localhost:5000/auth/login",
            {
                username: event.target.username.value,
                password: event.target.password.value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    // "Acess-Control-Allow-Origin": "*",
                    // "Access-Control-Allow-Credentials": "true",
                },
                // withCredentials: true,
            }
        ).then((res) => console.log(res));
        //!
    }

    return (
        <Form onSubmit={onSubmitUserData} className='workout-list'>
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
            <Form.Group>
                <Button className="btn-submit" type="submit">
                    Submit
                </Button>
            </Form.Group>
        </Form>
    );
}