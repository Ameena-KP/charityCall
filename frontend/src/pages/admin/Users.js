import React, { useEffect, useState } from "react";

function Users() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        const getUsers = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/admin/users"
                );

                const data = await response.json();

                console.log(data);

                if (data.success) {

                    setUsers(data.users);

                }

            } catch (error) {

                console.log("Error:", error);

            }

        };

        getUsers();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                All Users
            </h2>

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Phone</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user.id}>

                            <td>
                                {user.id}
                            </td>

                            <td>
                                {user.name}
                            </td>

                            <td>
                                {user.email}
                            </td>

                            <td>
                                {user.phone}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Users;