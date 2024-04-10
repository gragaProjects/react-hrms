import React,{useEffect } from "react";
import LogoLight2x from "../../images/logo.png";
import LogoDark2x from "../../images/logo-dark.png";
// import LogoLight2x from "../../images/logo2x.png";
// import LogoDark2x from "../../images/logo-dark2x.png";
import { useDispatch,useSelector } from "react-redux";
import {fetchOrganisation,getOrganisation  } from "../../slices/organisationSlice";
import {Link} from "react-router-dom";
import { BACKEND_URL } from '../../config';;
const Logo = () => {
  const dispatch = useDispatch();
  const organisation = useSelector(getOrganisation); // Use getOrganisation selector to access organisation data

  useEffect(() => {
    dispatch(fetchOrganisation()); // Fetch organisation data when component mounts
  }, [dispatch]);


 // console.log(organisation.logo); // Log entire organisation data
  //const Path = "../../../../Backend/uploads/"; // Path to the backend uploads folder
  const Path = BACKEND_URL; // Path to the backend uploads folder
 // console.log(LogoImage);
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      {organisation && organisation.logo ? (
        <img className="logo-light logo-img" src={Path + organisation.logo} alt="logo" style={{ width: '100px', maxHeight: '80px' }} />
      ) : (
        <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />
      )}
        

        {organisation && organisation.logo ? (
       
        <img className="logo-dark logo-img" src={Path + organisation.logo} alt="logo"  style={{ width: '100px', maxHeight: '80px' }} />
      ) : (
        <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" />
      )}
      
    </Link>
  );
};

export default Logo;
