import React, { useEffect, useState } from "react";

function Teams() {

    const [teams, setTeams] = useState([]);

    useEffect(() => {

        const getTeams = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/admin/teams"
                );

                const data = await response.json();

                console.log(data);

                if (data.success) {

                    setTeams(data.teams);

                }

            } catch (error) {

                console.log("Error:", error);

            }

        };

        getTeams();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                All Team Members
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

                    {teams.map((team) => (

                        <tr key={team.id}>

                            <td>
                                {team.id}
                            </td>

                            <td>
                                {team.name}
                            </td>

                            <td>
                                {team.email}
                            </td>

                            <td>
                                {team.phone}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Teams;