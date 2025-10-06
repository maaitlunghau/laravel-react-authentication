import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import axiosClient from '../axiosClient';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        console.log(payload);
        setErrors(null);

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)

                // notification UI
                toast.success('Login successful! Welcome back.');
            })
            .catch(err => {
                const response = err.response;

                if (response && response.status === 403) {
                    // Email not verified
                    setErrors({
                        email: [response.data.message]
                    });

                    toast.warning(response.data.message);
                }

                if (response && response.status === 422) {
                    if (response.data.errors) {
                        console.error(response.data.errors);
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message]
                        });
                    }
                }
            })
    }

    const GoogleLoginSuccess = async (credentialResponse) => {
        // credentialResponse chứa id_token
        const { credential } = credentialResponse;

        // gửi token này về backend Laravel để xử lí
        const { data } = await axiosClient.post('/auth/google-login', {
            credential
        });

        setToken(data.token);
        setUser(data.user);

        navigate('/dashboard');

        // notification UI
        toast.success('Login successful! Welcome back.');
    }

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Login into your account
                    </h1>

                    {/* output errors */}
                    {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => (
                                <p key={key}>
                                    {errors[key][0]}
                                </p>
                            ))}
                        </div>
                    }

                    <input ref={emailRef} type="email" placeholder='Email' />
                    <input ref={passwordRef} type="password" placeholder='Password' />
                    <button className='btn btn-block'>
                        Login
                    </button>

                    {/* Divider */}
                    <div className="divider">
                        <span className="divider-text">or</span>
                    </div>

                    <GoogleLogin
                        onSuccess={GoogleLoginSuccess}
                        onError={() => console.log('Login Failed')}
                    />

                    <p className="message">
                        Not Registerted?{' '}
                        <Link to='/signup'>
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
