import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
// import Typography from '@mui/material/Typography';
const AddtoCart = ({ product }) => {
    const [data, setData] = useState(null); // Specific product
    // const [otherProducts, setOtherProducts] = useState([]); // Other products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userid, setuserid] = useState()
    const [value, setValue] = useState("");

    console.log(value)
    const navigate = useNavigate();
    const { id } = useParams(); // State to store cart items
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:3000/api/v1/allproductget');
                const result = await response.json();

                if (result.data === '001') {
                    // Filter the specific product
                    const foundProduct = result.All_Priduct.find(product => product._id === id);
                    if (foundProduct) {
                        setData(foundProduct);
                        setuserid(foundProduct._id)
                    } else {
                        setError('Product not found');
                    }

                    // Filter other products
                    // const filteredProducts = result.All_Priduct.filter(product => product._id !== id);
                    // setOtherProducts(filteredProducts);
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

    const quintatyupdata = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTU0MDU5LCJleHAiOjE3NDA1NTQwNTl9.U9EngkZwI014uPZh9toOKkuSm6DOXEhNuIcVN87BvrI");

            const raw = JSON.stringify({
                "productId": userid
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
                });
        } catch (error) {
            console.log(error)
        }
    }
    const likesupdate = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "productId": userid
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
                        setData(result.data)
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }
    const productrating = async (newValue) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "productid": userid,
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
                        setData(result.data) 
                    }
                    else {
                        alert("data: not found : ")
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }




    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <Card sx={{ maxWidth: 345 }}>
                        <div style={{ position: 'relative' }}>

                            <div style={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`http://localhost:3000/${data.images[0].url}`} // Specific product image
                                    alt={data.images[0].alt}
                                />
                            </div>
                            <div style={{ position: 'absolute', top: '0', right: '0' }}>
                                <p onClick={likesupdate}> <FavoriteBorderIcon /> </p>
                            </div>
                        </div>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {data.Product_Name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.description.map(desc => (
                                    <div key={desc._id}>
                                        <strong>{Object.keys(desc)[0]}:</strong> {Object.values(desc)[0]}
                                    </div>
                                ))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Category:</strong> {data.prooduct_category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary"  >
                                <strong  >Quantity: {data.quantity}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Likes:</strong> {data.likes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Rating:</strong> {data.rating} 
                                {Array.from({ length: data.rating }, (_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </Typography>
                            <Typography variant="h6" color="text.primary">
                                Price: ₹{data.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Offer: {data.offer}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large">Buy Now</Button>
                            <Button size="small" target='_blank' onClick={() =>
                                navigate(`/cart/${data._id}`,
                                    quintatyupdata()
                                )}>Add to Cart</Button>
                        </CardActions>
                    </Card>
                </div>
                <div> 
                    <Box sx={{ '& > legend': { mt: 2 } }}>
                        <Typography component="legend">Controlled</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                console.log("new value : ", newValue)
                                productrating(newValue)
                                productrating(newValue)
                            }}
                        /> </Box>
                </div>
            </div>

        </div>
    );
};

export default AddtoCart;
