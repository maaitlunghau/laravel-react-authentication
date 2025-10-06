import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useEffect } from "react";

export default function DefaultLayout() {
    const { user, setUser, token, setToken } = useStateContext();

    if (!token) {
        return <Navigate to='/login' />
    }

    // fetch user
    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    const handleLogout = (ev) => {
        ev.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.post('/logout')
                    .then(() => {
                        setUser({})
                        setToken(null)

                        toast.success("Logout successful!");
                    })
                    .catch(err => {
                        toast.warning("Logout faild...");
                    })
            }
        })
    }

    return (
        <div id='defaultLayout'>

            <aside>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/users'>Users</Link>
            </aside>

            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}

                        <a
                            href="#"
                            onClick={handleLogout}
                            className='btn-logout'
                        >
                            Logout
                        </a>
                    </div>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
