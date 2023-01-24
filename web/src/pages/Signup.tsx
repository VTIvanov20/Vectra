import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserService from "../services/user.service";
import "../styles/pages/_signup.page.scss";

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const isRegisterSuccessful =  await UserService.register({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
        });

        if (isRegisterSuccessful) {
            navigate('/login');
        } else {
            setError(true);
        }
    }


    return (
       <form className="center" onSubmit={onSubmit}>
            <input className="input" type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="input" type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="text" name="first_name" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="input" type="text" name="last_name" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input className="input" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error ? <h1> Error </h1> : null}
            <button className="submit" type="submit" value="Submit"> Submit </button>
        </form>
    );
}

export default Signup;