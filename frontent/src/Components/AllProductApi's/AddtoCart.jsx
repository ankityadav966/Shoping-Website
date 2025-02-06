import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import datanotfound from './image/datanotfound.gif'

const AddtoCart = ({ product }) => {
    const [data, setData] = useState(null);;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userid, setuserid] = useState()
    const [value, setValue] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const Quantity = queryParams.get('Quantity');
    const [totalprice, settotalprice] = useState("")
    const [offerprice, setofferprice] = useState()

    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/v1/allproductget');
                const result = await response.json();
                if (result.data === '001') {
                    const foundProduct = result.All_Priduct.find(product => product._id === id);
                    if (foundProduct) {
                        setData(foundProduct);
                        setuserid(foundProduct._id)
                    } else {
                        setError('Product not found');
                    }
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError('Error fetching product data');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id])


    const quintatyupdata = async (increase, productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTU0MDU5LCJleHAiOjE3NDA1NTQwNTl9.U9EngkZwI014uPZh9toOKkuSm6DOXEhNuIcVN87BvrI");

            const raw = JSON.stringify({
                "operation": increase,
                "productId": productId,
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/quantityUpdate", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setData(result.data)
                    showallcart()
                });
        } catch (error) {
            console.log(error)
        }
    }
    const likesupdate = async (productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "productId": productId
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/likesquintaty", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === "001") {
                        setData(result.data),
                            showallcart()
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }
    const productrating = async (newValue, productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "productid": productId,
                "rating": newValue
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/rating", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === "001") {
                        setData(result.data),
                            showallcart()
                    }
                    else {
                        alert("data: not found : ")
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }
    const totalpriceapi = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IlZpc2hhbHlhZGF2QGdtYWlsLmNvbSIsImlhdCI6MTczNzUzOTE1NiwiZXhwIjoxNzQxMTM5MTU2fQ.R3azw1OvR5F2XkH5yNqUKM1m7Z0mdKuYwmdmsvf8K54");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/total", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === "001") {
                        console.log(result)
                        settotalprice(result)
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }
    const removeproduct = async (productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "productid": productId
            });
            console.log(productId)

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/productremove", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if(result.status=="001"){
                        setData(result.data),
                        showallcart()
                        totalpriceapi()
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }


    const showallcart = async () => {
        try {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            await fetch("http://localhost:3000/api/v1/showalladdcard", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === "001") {
                        // console.log("user daata ; ", result.data[0]._id)
                        setData(result.data)
                        setofferprice(result.newdatafordis)
                        console.log(result.newdatafordis)
                        // setData(result.newdatafordis)
                        // console.log(">>>>>>>>>>>>>>>>> : ",result.data[0].price)
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }
    const addtocart = async (productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTUyOTYxLCJleHAiOjE3NDA1NTI5NjF9.Qf6nUGwyYCB-giDWl35_x3MhkRmgA0aU6-lTKo9sPEY");

            const raw = JSON.stringify({
                "categoryid": productId,
                "quantity": Quantity
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/v1/addproduct", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log("product data : ", result)
                    if (result.status === "001") {
                        setData(result.data)
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        showallcart()
        totalpriceapi()
    }, [])




    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className='d-flex justify-content-end  me-5 '>
                <h4>Total Price : {totalprice.TotalPrice} </h4>
            </div>
            <div className="container p-5">
                <div className="row">
                    {
                        data.length > 0 ?
                            data?.map((item, index) => {
                                return (
                                    <>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <div style={{ position: 'relative' }}>
                                                    product Id : {item._id}
                                                    <div style={{ position: 'relative' }}>
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={`http://localhost:3000/${item.images[0].url}`} // Specific product image
                                                            alt={item.images[0].alt}
                                                        />
                                                    </div>
                                                    <div style={{ position: 'absolute', top: '0', right: '0' }}>
                                                        <p onClick={() => {
                                                            likesupdate(item._id)
                                                        }}> <FavoriteBorderIcon /> </p>
                                                    </div>
                                                </div>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {item.Product_Name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.description.map(desc => (
                                                            <div key={desc._id}>
                                                                <strong>{Object.keys(desc)[0]}:</strong> {Object.values(desc)[0]}
                                                            </div>
                                                        ))}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <div className='d-flex' >
                                                            <Button size="small"
                                                                onClick={() => quintatyupdata("decrease", item._id)}
                                                            >
                                                                Decrease
                                                            </Button>
                                                            <Typography variant="h6" color="text.primary"> Quantity: {item.quantity} </Typography>
                                                            <Button size="small" onClick={() => quintatyupdata("increase", item._id)}>Increase</Button>
                                                        </div>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Likes:</strong> {item.likes}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Rating:</strong> {item.rating}
                                                        {Array.from({ length: item.rating }, (_, i) => (
                                                            <span key={i}>⭐</span>
                                                        ))}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Offer: {item.offer}
                                                    </Typography>
                                                    <Typography variant="h6" >
                                                        <del>Price: {item.price}</del>
                                                    </Typography>
                                                </CardContent>
                                                {offerprice[index] && (
                                                    <div>
                                                        <p className='ms-3 '>Offer Price: {offerprice[index]?.price}</p>
                                                        <p className='ms-3 fs-3'>Total Price: {offerprice[index]?.offer}</p>
                                                    </div>
                                                )}
                                                <CardActions>
                                                    <Button size="large">Buy Now</Button>
                                                    <Button size="small" target='_blank' onClick={()=>{
                                                        removeproduct(item._id)
                                                    }}>Remove</Button>
                                                </CardActions>
                                            </Card>


                                            <div>
                                                <Box sx={{ '& > legend': { mt: 2 } }}>
                                                    <Typography component="legend">Controlled</Typography>
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={value}
                                                        onChange={(event, newValue) => {
                                                            setValue(newValue);
                                                            productrating(newValue, item._id)
                                                        }}
                                                    />
                                                </Box>
                                            </div>
                                        </div>
                                    </>
                                )
                            }) :
                            <>
                                <div style={{ border: '2px', width: '100%', height: '90vh' }}>
                                    <img style={{ width: '50%', height: '90vh', objectFit: 'cover' }} src={datanotfound} alt="" />
                                    <img style={{ width: '50%', height: '90vh', objectFit: 'cover' }} src={datanotfound} alt="" />
                                </div>
                            </>
                    }

                </div>
            </div>
        </>
    );
};

export default AddtoCart;
