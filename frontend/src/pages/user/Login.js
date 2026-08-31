import { useState } from "react";
import { loginUser } from "../../services/userService";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const result = await loginUser({

                email,
                password

            });

            alert(result.message);

            localStorage.setItem(
                "token",
                result.token
            );

        }

        catch (error) {

            alert("Login Failed");

        }

    };

    return (

        <div className="container mt-5">

            <h2>User Login</h2>

            <form onSubmit={handleLogin}>

                <div className="mb-3">

                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                </div>

                <div className="mb-3">

                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                </div>

                <button
                    className="btn btn-primary"
                >

                    Login

                </button>

            </form>

        </div>

    );

}

export default Login;