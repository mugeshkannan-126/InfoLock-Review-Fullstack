import AdminDashboard from "./pages/AdminDashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<AdminDashboard/>}/>
            </Routes>
        </Router>
    )
}
export default App;