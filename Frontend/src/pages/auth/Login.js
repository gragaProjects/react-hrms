import React, { useState,useEffect } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { BACKEND_URL } from '../../config';;
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
//--------4/4/24---------------
import { useDispatch,useSelector } from "react-redux";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
//slice
import { handleLogin } from "../../slices/userSlice";
import {fetchOrganisation,getOrganisation  } from "../../slices/organisationSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 // const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(handleLogin(token))
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Error during login:", error);
          localStorage.removeItem("token"); // Remove token if login fails
          localStorage.removeItem("users"); // Remove token if login fails
        });
    }
  }, [dispatch, navigate]);


  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      });
      console.log(response.data);
      if(response.data.success){
        //console.log("Success"+response.data.success);
        localStorage.setItem("token", response.data.token);
        await dispatch(handleLogin(response.data.token));// Fetch user data and set in Redux store

        navigate("/dashboard"); // Redirect to dashboard after successful login
      }else{
        console.log("Failed"+response.data.success);
        alert("Please check email and password")
        localStorage.removeItem("token"); // Remove token if login fails
        localStorage.removeItem("users"); // Remove token if login fails
      }
      
      
    
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
      localStorage.removeItem("token"); // Remove token if login fails
      localStorage.removeItem("users"); // Remove token if login fails
    }
  };

  // const onFormSubmit = (formData) => {
  //   setLoading(true);
  //   const loginName = "info@softnio.com";
  //   const pass = "123456";
  //   if (formData.name === loginName && formData.passcode === pass) {
  //     localStorage.setItem("accessToken", "token");
  //     setTimeout(() => {
  //       window.history.pushState(
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
  //         "auth-login",
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}Dashboard`
  //       );
  //       window.location.reload();
  //     }, 1000);
  //   } else {
  //     setTimeout(() => {
  //       setError("Cannot login with credentials");
  //       setLoading(false);
  //     }, 1000);
  //   }
  // };

  const {  register, handleSubmit, formState: { errors } } = useForm();
  
   //organisation
  const organisation = useSelector(getOrganisation); // Use getOrganisation selector to access organisation data

  useEffect(() => {
    dispatch(fetchOrganisation()); // Fetch organisation data when component mounts
  }, [dispatch]);

  const Path = BACKEND_URL;
  return <>
    <Head title="Login" />
    {/* <div className="nk-app-root">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content"> */}
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            {/* <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
            <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" /> */}
             {organisation && organisation.logo ? (
                <img className="logo-dark logo-img logo-img-lg" style={{ maxHeight: '100px' }}
                src={Path + organisation.logo} alt="logo" />
              ) : (
                <img className="logo-dark logo-img logo-img-lg" style={{ maxHeight: '100px' }} src={LogoDark} alt="logo" />
              )}
          </Link>
        </div>

        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Sign-In</BlockTitle>
              <BlockDes>
              
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {errorVal && (
            <div className="mb-3">
              <Alert color="danger" className="alert-icon">
                <Icon name="alert-circle" /> Unable to login with credentials{" "}
              </Alert>
            </div>
          )}
          <Form className="is-alter" >
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Email 
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...register('name', { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address "
                  className="form-control-lg form-control"   onChange={(e) => setEmail(e.target.value)} />
                {errors.name && <span className="invalid">{errors.name.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="password">
                  Passcode
                </label>
                <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                  Forgot Code?
                </Link>
              </div>
              <div className="form-control-wrap">
                <a
                  href="#password"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setPassState(!passState);
                  }}
                  className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                >
                  <Icon name="eye" className="passcode-icon icon-show"></Icon>

                  <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                </a>
                <input
                  type={passState ? "text" : "password"}
                  id="password"
                  {...register('passcode', { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your passcode"
                  className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  onChange={(e) => setPassword(e.target.value)} />
                {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary" onClick={onFormSubmit}>
                {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
              </Button>
            </div>
          </Form>
          {/* <div className="form-note-s2 text-center pt-4">
            New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
          </div> */}
         
        </PreviewCard>
      </Block>
      {/* </div>
        </div>
      </div> */}
      {/* <AuthFooter /> */}
  </>;
};
export default Login;
