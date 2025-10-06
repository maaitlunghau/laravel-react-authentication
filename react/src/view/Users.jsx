import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        setLoading(true);

        axiosClient.get('/users')
            .then(({ data }) => {
                setLoading(false);
                console.log(data);
                setUsers(data.data);
            })
            .catch((error) => {
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onDelete = (u) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This user will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);

                axiosClient.delete(`/users/${u.user_id}`)
                    .then(() => {
                        getUsers();
                        setLoading(false);

                        // show notification
                        toast.success('User was successfully deleted.');
                    })
                    .catch(() => {
                        // show notification
                        toast.error('Delete user failed! Please try again.');
                    })
            }
        })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>
                    Users
                </h1>
                <Link
                    to="/users/new"
                    className="btn-add"
                >
                    Add New
                </Link>
            </div>

            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Google ID</th>
                            <th>Verified At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan='7' className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map((u, key) => (
                                <tr key={key}>
                                    <td>{u.user_id || 'null'}</td>
                                    <td>{u.name || 'null'}</td>
                                    <td>{u.email || 'null'}</td>
                                    <td>{u.status || 'null'}</td>
                                    <td>{u.google_id || 'null'}</td>
                                    <td>{u.email_verified_at || 'null'}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/users/' + u.user_id}>
                                            Edit
                                        </Link>
                                        <button onClick={() => onDelete(u)} className="btn-delete" >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}
