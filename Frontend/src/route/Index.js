import React, { useLayoutEffect } from "react";
import { Routes,Route, useLocation ,useNavigate,Navigate } from "react-router-dom";


import Homepage from "../pages/Homepage";


import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import EmployeesList from "../pages/components/employees/Allemployees"
//import OrganisationInfo from "../pages/components/organisation/OrganisationInfo"
import OrganisationInfo from "../pages/components/organisation/OrganisationInfo"
import BusinessUnits from "../pages/components/organisation/BusinessUnits"
import Departments from "../pages/components/organisation/Departments"
import Country from "../pages/components/organisation/organisation_master/Country "
import State from "../pages/components/organisation/organisation_master/State";
import District from "../pages/components/organisation/organisation_master/District";
import City from "../pages/components/organisation/organisation_master/City";
import Timezone from "../pages/components/organisation/organisation_master/Timezone";
import  Designation  from "../pages/components/organisation/employee_master/Designation";
import  Role  from "../pages/components/organisation/employee_master/Role";
import Prefix from "../pages/components/organisation/employee_master/Prefix";
import Nationality from "../pages/components/organisation/employee_master/Nationality";
import Language from "../pages/components/organisation/employee_master/Language";
import Education from "../pages/components/organisation/employee_master/Education";
import Course from "../pages/components/organisation/employee_master/Course";
import GovermentId from "../pages/components/organisation/employee_master/GovermentId";
import Currency from "../pages/components/organisation/employee_master/Currency";
import Allowance from "../pages/components/organisation/employee_master/Allowance";
import Deduction from "../pages/components/organisation/employee_master/Deduction";
const Router = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


   
  //New 4/4/24
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists


  //New 4/4/24

  // return (
  //     <Routes>
      
  //        <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
  //            <Route index element={<Login />}></Route>
  //           <Route path="auth-register" element={<Register />}></Route>
     
  //       </Route>
         
  //        <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
        
  //         <Route path="dashboard" element={<Homepage />}></Route>
  //         <Route path="employees" element={<EmployeesList />}></Route>

  //         {/* organistion info */}
          
  //         <Route path="organisationInfo" element={<OrganisationInfo />}></Route>


  //       </Route> 
        
  //     </Routes>
  // );
  return (
    <Routes>
      <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="auth-register" element={<Register />} />
      </Route>

      <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
        <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/" />} />
        <Route path="dashboard" element={isAuthenticated ? <Homepage /> : <Navigate to="/" />} />
        <Route path="employees" element={isAuthenticated ? <EmployeesList /> : <Navigate to="/" />} />
        {/* organisation */}
        <Route path="organisationInfo" element={isAuthenticated ? <OrganisationInfo /> : <Navigate to="/" />} />
        <Route path="business-units" element={isAuthenticated ? <BusinessUnits /> : <Navigate to="/" />} />
        <Route path="department" element={isAuthenticated ? <Departments /> : <Navigate to="/" />} />
        <Route path="country" element={isAuthenticated ? <Country /> : <Navigate to="/" />} />
        <Route path="state" element={isAuthenticated ? <State /> : <Navigate to="/" />} />
        <Route path="district" element={isAuthenticated ? <District/> : <Navigate to="/" />} />
        <Route path="city" element={isAuthenticated ? <City/> : <Navigate to="/" />} />
        <Route path="timezone" element={isAuthenticated ? <Timezone/> : <Navigate to="/" />} />
        <Route path="designation" element={isAuthenticated ? <Designation/> : <Navigate to="/" />} />
        <Route path="roles-permission" element={isAuthenticated ? <Role/> : <Navigate to="/" />} />
        <Route path="prefix" element={isAuthenticated ? <Prefix/> : <Navigate to="/" />} />
        <Route path="nationality" element={isAuthenticated ? <Nationality/> : <Navigate to="/" />} />
        <Route path="language" element={isAuthenticated ? <Language/> : <Navigate to="/" />} />
        <Route path="education-level" element={isAuthenticated ? <Education/> : <Navigate to="/" />} />
        <Route path="course" element={isAuthenticated ? <Course/> : <Navigate to="/" />} />
        <Route path="governmentid" element={isAuthenticated ? <GovermentId/> : <Navigate to="/" />} />
        <Route path="currency" element={isAuthenticated ? <Currency/> : <Navigate to="/" />} />
        <Route path="allowance" element={isAuthenticated ? <Allowance/> : <Navigate to="/" />} />
        <Route path="deduction" element={isAuthenticated ? <Deduction/> : <Navigate to="/" />} />
      </Route>
    </Routes>
  );
};
export default Router;
