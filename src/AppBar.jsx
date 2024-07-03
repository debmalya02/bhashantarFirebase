import * as React from 'react';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AttractionsIcon from '@mui/icons-material/Attractions';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/authSlice.jsx';
import Cookies from 'js-cookie';
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "./firbase/context/authContext.jsx";


const drawerWidth = 240;
const navItems = [
  { text: 'Home', link: '/home' },
  { text: 'About', link: '/about' },
  { text: 'Features', link: '/features' },
  { text: 'Contact', link: '/contact' },
];

function DrawerAppBar(props) {
  const { userLoggedIn } = useAuth()
  const auth = getAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      navigate('/login')
    } catch (err) {
      console.error(err);
    }
  };


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton href={item.link} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        position="static" // Changed to static
        sx={{ backgroundColor: 'transparent', color: 'black', boxShadow: 'none' }}
      >
        <Toolbar className="flex justify-between">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Bhashantaar Logo" style={{ height: '55px', width: 'auto', marginRight: '40px' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Link to={item.link}>
                <Button key={item.text} sx={{ fontWeight: 700, color: 'black', marginX: '5px' }}>
                  {item.text}
                </Button>
              </Link>
            ))}
            {userLoggedIn ? (
              <Button className="rounded-md" sx={{ fontWeight: 700, color: 'black', marginX: '5px' }} onClick={logoutHandler}>
                Logout
              </Button>
            ) : (
              <p></p>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Add your main content here */}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;










// function ButtonAppBar(props) {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static" sx = {{backgroundColor:"transparent", color:"black", boxShadow: "0px 0px 0px 0px"
//       }}>
//         <Toolbar>
//           <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             sx={{ mr: 2 }}
//           >
//             <AttractionsIcon sx = {{fontSize:"40px", color:"green"}} />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1,fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none', }}>
//             BHASHANTAAR
//           </Typography>
//           <Button sx ={{fontWeight:700,color:"black",marginX:"5px"}}>Home</Button>
//       <Button sx={{fontWeight:700,color:"black",marginX:"5px"}}>About Us</Button>
//       <Button sx={{fontWeight:700,color:"black",marginX:"5px"}}>Contact</Button>
//           <Button sx = {{backgroundColor:"green", color:"white", boxShadow: "0px 0px 0px 0px", marginLeft:"50px"
//       }}>Login</Button>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }

// export default ButtonAppBar;