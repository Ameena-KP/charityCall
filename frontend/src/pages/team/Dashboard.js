import { useEffect, useState } from "react";
import {
    getPendingRequests,
    approveRequest,
    rejectRequest
} from "../../services/teamService";

function Dashboard() {

    const [requests, setRequests] = useState([]);

    const loadRequests = async () => {

        try {

            const data = await getPendingRequests();

            setRequests(data);

        } catch (error) {

            alert("Failed to load requests");

        }

    };

    useEffect(() => {

        loadRequests();

    }, []);

    const handleApprove = async (id) => {

        await approveRequest(id);

        alert("Request Approved");

        loadRequests();

    };

    const handleReject = async (id) => {

        await rejectRequest(id);

        alert("Request Rejected");

        loadRequests();

    };

    return (

        <div className="container mt-5">

            <h2>Pending Charity Requests</h2>

            <table className="table table-bordered mt-4">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        requests.map((item) => (

                            <tr key={item.id}>

                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.category}</td>
                                <td>{item.status}</td>

                                <td>

                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleApprove(item.id)}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleReject(item.id)}
                                    >
                                        Reject
                                    </button>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}

export default Dashboard;