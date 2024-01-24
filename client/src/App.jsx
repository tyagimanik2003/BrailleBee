import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import DashboardContent from "./components/DashboardContent";
import ManageFiles from "./components/ManageFiles";
import ConvertToEditable from "./components/ConvertToEditable";
import ConvertToBrf from "./components/ConvertToBrf";
import CompareFiles from "./components/CompareFiles";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/sign-up" element={<Signup />}/>
        <Route path="/sign-in" element={<Signin />}/>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}/>
        </Route> 
        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<Dashboard />}>
            <Route index path="dashboard" element={<DashboardContent />}/>
            <Route index path="manage-files" element={<ManageFiles />}/>
            <Route index path="convert-to-editable" element={<ConvertToEditable />}/>
            <Route index path="convert-to-brf" element={<ConvertToBrf />}/>
            <Route index path="compare-files" element={<CompareFiles/>}/>
          </Route>
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}