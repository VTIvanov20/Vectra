import { useState } from "react";
import UserService from "../services/user.service";

import "../styles/pages/_login.page.scss";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const res = await UserService.login({username, password});

        if (res === false) {
            setError(true);
        } else {
            localStorage.setItem('jwt', res as any);
        }

    }

    return (
        <form className="center" onSubmit={onSubmit}>
            <input type="text" className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error ? <h1> Error </h1> : null}
            <button type="submit" className="submit"> Submit </button>
        </form>
    );
}

export default Login;