import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DropdownWithLinks = ({dropDownTitle,links}) => {
    const navigate = useNavigate();
  const handleChange = (event) => {
    const selectedLink = event.target.value;
        navigate(selectedLink)
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 ,color: 'white', borderColor: 'white'}}>
        <InputLabel variant='outlined' style={{color:"white"}}>{dropDownTitle}</InputLabel>
        <Select
        label="Select an option"
        onChange={handleChange}
        >   
        {links.map((link , index)=>{
            return <MenuItem key={index} value={link.link}>{link.title}</MenuItem>
        })
        }
        </Select>
    </FormControl>
  );
};

export default DropdownWithLinks;
