import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
const Userlogin = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [userpassword, setuserpassword] = useState()
    const [username, setusername] = useState()
    const [useremail, setuseremail] = useState()
    const [useraddress, setuseraddress] = useState()
    const [PinCodeNumber, setPinCodeNumber] = useState()
    const [villagename, setvillagename] = useState()



    const [usermobilenumber, setusermobilenumber] = useState()

    const userregisterapi = async () => {
        try {
            const myHeaders = new Headers(); 
            
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "username": username,
                "Email": useremail,
                "Password": Password,
                "Mobile_Number": usermobilenumber,
                "Address": [
                    {
                        "Address": useraddress,
                        "PinCodeNumber": PinCodeNumber,
                        "village": villagename
                    }
                ]
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/registerapi", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        } catch (error) {
            console.log(error)
        }
    }







    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };


    console.log(userpassword)
    return (
        <div className='maindiv'>
            <div className="container p-5">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <img style={{ width: '100%', height: '70vh', objectFit: 'cover' }} src="https://files.oaiusercontent.com/file-BAaBjbfCgSffJRpYE5xNXd?se=2025-01-30T07%3A05%3A05Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D3dd41974-8cf0-4954-af2d-38894d2f0778.webp&sig=sqv4cc6jF4S1AR3A9Q5ZxCupVFQxr63hSWiRrX0DCdY%3D" alt="" />
                        profile details
                        logo
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="outlined-basic" label="User Name" variant="outlined" />
                            <TextField id="outlined-basic" label="Email" variant="outlined" />
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => { setuserpassword(e.target.value) }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <TextField id="outlined-basic" label="Mobile_Number" variant="outlined" />
                            <TextField id="outlined-basic" label="Address" variant="outlined" />
                            <Button variant="contained">Contained</Button>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Userlogin