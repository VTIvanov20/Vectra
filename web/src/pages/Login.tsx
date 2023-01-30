import { useState } from "react";
import { Link } from 'react-router-dom';
import App from '../App.css';
import UserService from "../services/user.service";
import { useResolution } from '../util/useResolution';
import { Mafs, CartesianCoordinates } from "mafs";

import "mafs/core.css";
import "mafs/font.css";

import "../styles/pages/_login.page.scss";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    let [width, height] = useResolution();
    const [error, setError] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const res = await UserService.login({ username, password });

        if (res === false) {
            setError(true);
        } else {
            localStorage.setItem('jwt', res as any);
        }

    }

    return (
        <div className="container">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/Index">Vectra</Link>
                <div className="navbar-links">
                    <Link className="navbar-link" to="/Login">Login</Link>
                    <Link className="navbar-link" to="/Signup">Register</Link>
                </div>
            </div>
            <form className="form" onSubmit={onSubmit}>

                <h1 className="form-title">Login</h1>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error ? (
                    <h2 className="error-message">Incorrect username or password. Please try again.</h2>
                ) : null}
                <button type="submit" className="form-submit">
                    Submit
                </button>
            </form>
            {
            //<Mafs height={height}>
            //    <CartesianCoordinates
            //        xAxis={{
            //            axis: false,
            //            lines: 0.5,
            //           labels: false
            //        }}
            //        yAxis={{
            //            axis: false,
            //            lines: 0.5,
            //            labels: false
            //        }}
            //        subdivisions={false} />
            //</Mafs>
            }
        </div>

    );
}

export default Login;