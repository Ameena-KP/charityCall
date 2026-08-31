import React, { useEffect, useState } from "react";

function Dashboard() {

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);

    useEffect(() => {

        const getDashboardStats = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard"
                );

                const data = await response.json();

                console.log(data);

                if (data.success) {

                    setTotalUsers(data.dashboard.totalUsers);

                    setTotalTeams(data.dashboard.totalTeams);

                    setTotalRequests(data.dashboard.totalRequests);

                    setTotalDonations(data.dashboard.totalDonations);

                }

            } catch (error) {

                console.log("Error:", error);

            }

        };

        getDashboardStats();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                Admin Dashboard
            </h2>

            <div className="row">

                {/* Users */}

                <div className="col-md-3">

                    <div className="card text-center p-3 mb-3">

                        <h5>Total Users</h5>

                        <h2>
                            {totalUsers}
                        </h2>

                    </div>

                </div>


                {/* Teams */}

                <div className="col-md-3">

                    <div className="card text-center p-3 mb-3">

                        <h5>Total Teams</h5>

                        <h2>
                            {totalTeams}
                        </h2>

                    </div>

                </div>


                {/* Requests */}

                <div className="col-md-3">

                    <div className="card text-center p-3 mb-3">

                        <h5>Total Requests</h5>

                        <h2>
                            {totalRequests}
                        </h2>

                    </div>

                </div>


                {/* Donations */}

                <div className="col-md-3">

                    <div className="card text-center p-3 mb-3">

                        <h5>Total Donations</h5>

                        <h2>
                            {totalDonations}
                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;