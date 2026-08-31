import { useState } from "react";
import { registerUser } from "../../services/userService";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const result = await registerUser(formData);

            alert(result.message);

            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                address: ""
            });

        } catch (error) {

            alert("Registration Failed");

        }

    };

    return (

        <div className="container mt-5">

            <h2>User Registration</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <textarea
                    className="form-control mb-3"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                />

                <button className="btn btn-success">
                    Register
                </button>

            </form>

        </div>

    );

}

export default Register;