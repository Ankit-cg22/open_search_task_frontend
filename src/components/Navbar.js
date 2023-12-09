import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from "react-router-dom";
import DropdownWithLinks from './DropdownWithLinks';
import { dropDownLinks } from '../utils';
export default function Navbar() {
       
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" >
        <Toolbar style={{display:"flex" , justifyContent:"space-between"}}>
          
            <Typography  variant="h6"  sx={{ color:"white" , textDecoration:"none" }}>
               <a href="/" style={{textDecoration:"none" , color : "white"}}>
                    Cricket WC Stats 
               </a>
            </Typography>
          
            <DropdownWithLinks dropDownTitle="Statitics" links={dropDownLinks}/>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}