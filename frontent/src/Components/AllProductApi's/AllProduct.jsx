import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import ShopingNavbar from '../Navbar/ShopingNavbar';
// import Navbar from '../Navbar/Navbar'

const AllProduct = () => {
    const [data, setData] = useState([]);
    const [searchinp, setsearchinp] = useState('')
    const [paginaction, setpaginaction] = useState(1)
    const [newprice, setprice] = useState()
    const navigate = useNavigate();

    const [pagelimit, setpagelimit] = useState(5);

    const handleChange = (event) => {
        setpagelimit(event.target.value);
    };

    const handlePagination = (event) => {
        setpaginaction(event.target.value);
    };

    console.log("price : ", newprice)
    // console.log(searchinp)


    const apidata = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        await fetch("http://localhost:3000/api/v1/allproductget", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.data === "001") {
                    setData(result.All_Priduct);
                } else {
                    console.log("Data not found");
                }
            });
    };

    const searchapi = async () => {
        // if (!searchinp || isNaN(pagelimit)) {
        //     console.log("Invalid input");
        //     return;
        // }

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        await fetch(`http://localhost:3000/api/v1/searchapi?search=${searchinp}&limit=${pagelimit}&page=${paginaction}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("result", result.data);
                setData(result.data);
            });
    };

    // const totalprice = async () => {
    //     try {
    //         const myHeaders = new Headers();
    //         myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IlZpc2hhbHlhZGF2QGdtYWlsLmNvbSIsImlhdCI6MTczNzUzOTE1NiwiZXhwIjoxNzQxMTM5MTU2fQ.R3azw1OvR5F2XkH5yNqUKM1m7Z0mdKuYwmdmsvf8K54");

    //         const requestOptions = {
    //             method: "GET",
    //             headers: myHeaders,
    //             redirect: "follow"
    //         };

    //         fetch("http://localhost:3000/api/v1/total", requestOptions)
    //             .then((response) => response.json())
    //             .then((result) => {
    //                 console.log("result.finaldata.DiscountedPrice : : :  : : ; : : :  : :  : : :  ",result.finaldata.DiscountedPrice)
    //                 setprice(result.finaldata.DiscountedPrice)

    //             });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        apidata();
    }, []);
    useEffect(() => {
        console.log(searchinp, "first")
        // if(searchinp==""){
        //     console.log(searchinp,"seconnd")
        //     searchapi()

        // }
        searchapi()
    }, [searchinp, pagelimit])
    

    return (
        <div>

            {/* header start */}
            {/* <ShopingNavbar /> */}
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Shoping_Website</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* <form class="d-flex   mainforminput" role="search"> */}
                        <input class="form-control  ms-4  navinput" type="search" onChange={(e) => { setsearchinp(e.target.value) }} placeholder="Search" aria-label="Search" />
                        {/* </form> */}
                        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active me-5" aria-current="page" href="#">Profile</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active me-5" href="#">Cart</a>
                            </li>
                            <li class="nav-item me-5">
                                <a class="nav-link active" aria-disabled="true">Become Seller</a>
                            </li>
                            <li class="nav-item me-5">
                                <a class="nav-link active" aria-disabled="true">::</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* header end*/}

            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">pagelimit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={pagelimit}
                        label="pagelimit"
                        onChange={handleChange}
                    >
                        <MenuItem value={5}>five</MenuItem>
                        <MenuItem value={10}>ten</MenuItem>
                        <MenuItem value={15}>Twenty</MenuItem>
                    </Select>
                </FormControl>
            </Box>



            <div className="container-fluid p-3">
                <div className="row">
                    {data?.map((item) => (
                        <div
                            key={item._id}
                            className="col-lg-3 col-md-6 col-sm-12 mb-5"
                            onClick={() => navigate(`/product/${item._id}?category=${item.prooduct_category}&Quantity=${item.quantity}`)}
                        >
                            <div style={{ width: '100%', }}>
                                <Card sx={{ maxWidth: 345 }}>
                                    {item.images?.map((image, idx) => (
                                        <div style={{ width: '100%', height: '' }}>
                                            <CardMedia>
                                                <img
                                                    key={idx}
                                                    src={`http://localhost:3000/${image.url}`}
                                                    style={{ width: '100%', objectFit: 'cover', height: '40vh' }}
                                                    alt={image.alt || "Product Image"}
                                                />
                                            </CardMedia>
                                        </div>
                                    ))}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            <div>{item.Product_Name}</div>
                                            {/* atttttttttttttt{item.item.quantity} */}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            <div>{item.price}</div>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Stack spacing={2}>
                <Pagination count={12} onChange={handlePagination} />
            </Stack>
        </div>
    );
};

export default AllProduct;
