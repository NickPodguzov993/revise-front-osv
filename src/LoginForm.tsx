import React, { useEffect } from "react";
import "./LoginForm.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./shared/hooks/useAuth";
import {login} from "@/entities/revise-object";


const LoginForm: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {user, loginAuth} = useAuth()

    useEffect(() => {
        if(user?.username) navigate('/')
    }, [])
   /* const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('username:', username);
        console.log('password:', password);
        if (username === "user" && password === "password") {
            if(loginAuth)
           loginAuth({user: { username }});
          //  login(username, password);
            navigate('/home')
        } else {
            alert("Invalid username or password");
        }
        // console.log(document.cookie);
        // localStorage.getItem(document.cookie)
        // localStorage.setItem()
        // Authorization
       /!* login(username, password);
        navigate('/home')*!/
    };*/

    const handleSubmit = async () => {
        console.log('username:', username);
        console.log('password:', password);
        if(loginAuth)   loginAuth(username)

        try {
            const response = await login(username, password);
                console.log(response)

            if (response.ok) {
                // Replace with actual authentication logic
                if(loginAuth)   loginAuth(username)
            } else {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
        }
    };

    return (
        <div className="login-form">
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Имя пользователя" required value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;
