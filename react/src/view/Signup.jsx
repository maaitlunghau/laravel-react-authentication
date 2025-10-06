import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { toast } from "react-toastify";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const { user, token, setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        };

        console.log(payload);
        setErrors(null);

        axiosClient.post('/signup', payload)
            .then(({ data }) => {
                console.log(data);

                setUser(data.user)
                // setToken(data.token)

                // notification UI
                toast.success('Signup successfully! Please check your email to verify your account.');

                // redirect to email verification pending 
                navigate('/email-verification-pending', {
                    state: { email: payload.email }
                });
            })
            .catch(err => {
                const response = err.response;

                if (response.status === 422) {
                    console.log(response.data.errors);
                    setErrors(response.data.errors);
                }
            })
    };

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Signup for free
                    </h1>

                    {/* output errors */}
                    {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => {
                                return <p>
                                    {errors[key][0]}
                                </p>
                            })}
                        </div>
                    }

                    <input ref={nameRef} type="text" placeholder='Full Name' />
                    <input ref={emailRef} type="email" placeholder='Email Address' />
                    <input ref={passwordRef} type="password" placeholder='Password' />
                    <input ref={passwordConfirmationRef} type="password" placeholder='Password Confirmation' />
                    <button type="submit" className='btn btn-block'>
                        Signup
                    </button>
                    <p className="message">
                        Already Registered?{' '}
                        <Link to='/login'>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
