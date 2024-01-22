import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, } from "@mui/material";
import {Offcanvas} from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearUserInfo } from "../slices/authSlice";
import { toast } from "react-toastify";
import { StringToAvatar } from "../utils/StringToAvatar";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";

import headerStyles from "../styles/headerStyles.module.css";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const activeRoute = location.pathname;

    const [logout] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logout().unwrap();
            dispatch(clearUserInfo());
            toast.success("Logged Out");
            navigate("/");
        } catch (err) {
            toast.error(err);
        }
    };

    let timeout;
    const handleScroll = () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            if (document.getElementById("main").scrollTop > 10) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        }, 10);
    };

    useEffect(() => {
        if(activeRoute == '/'){
            document.getElementById("main").addEventListener("scroll", handleScroll);
            if (document.getElementById("main").scrollTop > 10) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        }
        else{
            setIsSticky(true)
        }
    }, []);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

    return (
        <AppBar id="header" className={`${headerStyles.header} ${isSticky ? headerStyles.sticky : ""}`} >
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Box sx={{display: { xs: "none", md: "flex", cursor:'pointer' }}}>
                        {isSticky? 
                            <img src="/logo3.png" width='100px' onClick={() => navigate('/')}/> 
                        :
                            <img src="/logo2.png" width='100px' onClick={() => navigate('/')}/> 
                        }
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={() => setShowDrawer(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} style={{width:'200px'}}>
                            <Offcanvas.Body>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('top')}}
                                sx={{ my: 2, px: 1, mx: 1, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Home
                            </Button>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('animHeader')}}
                                sx={{ my: 2, px: 1, mx: 1, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Our Services
                            </Button>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('contactUs')}}
                                sx={{ my: 2, px: 1, mx: 1, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Contact Us
                            </Button>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Box>
                    <Box sx={{display: { xs: "flex", md: "none", cursor:'pointer' }}} style={{width:'100%', justifyContent:'center'}}>                        
                        {isSticky? 
                            <img src="/logoBig2.png" width='150px' onClick={() => navigate('/')}/> 
                        :
                            <img src="/logoBig1.png" width='150px' onClick={() => navigate('/')}/> 
                        }
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent:'center' }}>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('top')}}
                                sx={{ my: 2, px: 3, mx: 2, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Home
                            </Button>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('animHeader')}}
                                sx={{ my: 2, px: 3, mx: 2, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Our Services
                            </Button>
                            <Button
                                onClick={() => {navigate('/');scrollToElement('contactUs')}}
                                sx={{ my: 2, px: 3, mx: 2, color: "inherit", fontWeight:'inherit', display: "block" }}
                                className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} 
                            >
                                Contact Us
                            </Button>
                    </Box>
                    {userInfo ? 
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            {userInfo.image ? 
                                <Avatar alt={userInfo.firstName+" "+userInfo.lastName} src={userInfo.image} sx={{ width: 40, height: 40, cursor:'pointer' }} style={{border: '1px solid #0000002e'}} /> 
                                : 
                                <Typography component="div">
                                    <Avatar alt={userInfo.firstName+" "+userInfo.lastName} {...StringToAvatar(userInfo.firstName+" "+userInfo.lastName)} style={{ width: 40, height:40, fontSize: 20, cursor:'pointer', border: '1px solid #0000002e' }} />
                                </Typography> 
                            }
                        </IconButton>
                        <Menu
                            sx={{ mt: "45px", textAlign:'center' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <span style={{margin:'10px 20px', fontSize:'20px'}}>{userInfo.firstName}</span>
                            <MenuItem onClick={() => navigate('/profile')} style={{justifyContent:'center', marginTop:'5px'}}>
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={logoutHandler} style={{justifyContent:'center'}}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    :
                    
                    <Box sx={{ flexGrow: 0 }}>
                        <Button onClick={() => navigate('/login')} className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} sx={{ p: 0, color: "inherit", fontWeight:'inherit' }}>
                            <FaSignInAlt />&nbsp; Sign In
                        </Button>
                        &nbsp; &nbsp; &nbsp;
                        <Button onClick={() => navigate('/register')} className={isSticky? headerStyles.navBtns : headerStyles.navBtns2} sx={{ p: 0, color: "inherit", fontWeight:'inherit' }}>
                            <FaSignOutAlt />&nbsp; Sign Up
                        </Button>
                    </Box>}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
