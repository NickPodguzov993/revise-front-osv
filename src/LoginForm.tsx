//import React from "react";
import "./LoginForm.css";
import { useNavigate } from 'react-router-dom';
import { login } from "./entities/revise-object/api";
import {useAuth} from "@/shared/hooks/useAuth";
import {useEffect, useState} from "react";



const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const  {loginAuth, user}  = useAuth();

    useEffect(() => {
        if(user) navigate('/home')

    }, [user])

    const handleSubmit = async () => {
        console.log('username:', username);
        console.log('password:', password);
        if(loginAuth)   loginAuth(username)

        try {
            const response = //await login(username, password);
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
            <h2>Log in 6</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Имя пользователя" required value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;
