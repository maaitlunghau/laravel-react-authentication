import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../axiosClient";

export default function UserForm() {
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        user_id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 'pending',
        google_id: null,
        email_verified_at: null,
    });

    useEffect(() => {
        if (id) {
            setLoading(true);

            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setUser(data);
                })
                .catch(() => {
                    toast.error("Load user failed! Please try again.");
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();

        if (user.user_id) {
            axiosClient.put(`/users/${user.user_id}`, user)
                .then(() => {
                    navigate('/users');

                    // show notification
                    toast.success("User was successfully updated.");
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post('/users', user)
                .then(() => {
                    navigate('/users');

                    // show notification
                    toast.success("User was successfully created.");
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    }

    return (
        <div>
            {user.user_id && <h1>Update User: {user.name}</h1>}
            {!user.user_id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">
                        Loading...
                    </div>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => {
                            return <p>
                                {errors[key][0]}
                            </p>
                        })}
                    </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input type="text" value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder="Name" />
                        <input type="email" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder="Email" />
                        <input type="password" onChange={ev => setUser({ ...user, password: ev.target.value })} placeholder="Password" />
                        <input type="password" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
                        <button type="submit" className="btn">Save</button>
                    </form>
                }

            </div>
        </div>
    )
}
