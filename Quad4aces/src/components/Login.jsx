import React, { useState } from 'react';
import '/Users/adityashenoy/Documents/GitHub/Quad_Aces_Proctor/Quad4aces/src/css/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
        if (email === 'admin@gmail.com' && password === 'admin') {
            window.location.href = '/admin';
            alert('Logged in as admin');
        }
        else {
            alert('Looged in as student ');
            window.location.href = '/Assesment';
        }
    };

    return (
            
    <div className='container'>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
                <div className='login'>Login</div>
                <div className='email'>
                    <label style={{marginRight: "10px"}}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginBottom: '10px', padding: '8px' }}
                        placeholder='Email'
                    />
                </div>
                <div className='password'>
                    <label style={{ marginRight: '10px' }}>Password :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ marginBottom: '10px', padding: '8px' }}
                        placeholder='Password'
                    />
                </div>
                <button type='submit' style={{ padding: '8px', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
}

export default Login;