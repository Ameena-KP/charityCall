import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Teams from "./pages/admin/Teams";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/admin/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<Users />}
                />

                <Route
                    path="/admin/teams"
                    element={<Teams />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;