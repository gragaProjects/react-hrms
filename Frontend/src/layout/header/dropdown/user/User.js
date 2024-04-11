import React, { useState, useEffect } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import { useTheme, useThemeUpdate } from "../../../provider/Theme";
//Logout
import { useDispatch,useSelector } from "react-redux";
import { useNavigate  } from "react-router-dom";
import { logout ,getUser} from "../../../../slices/userSlice";
const User = ({}) => {
  const user = useSelector(getUser);
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
   
   //console.log(user);
  
  //Logout
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    // Dispatch logout action to clear user state
    dispatch(logout());
    // Redirect to login page or any other desired route
    navigate("/");
  };
  //Logout

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">{user?.name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>AB</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{user?.name}</span>
              <span className="sub-text">info@softnio.com</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
         
            <li>
              <a className={`dark-switch ${theme.skin === 'dark' ? 'active' : ''}`} href="#" 
              onClick={(ev) => {
                ev.preventDefault();
                themeUpdate.skin(theme.skin === 'dark' ? 'light' : 'dark');
              }}>
                {theme.skin === 'dark' ? 
                  <><em className="icon ni ni-sun"></em><span>Light Mode</span></> 
                  : 
                  <><em className="icon ni ni-moon"></em><span>Dark Mode</span></>
                }
              </a>
            </li>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a onClick={handleLogout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
