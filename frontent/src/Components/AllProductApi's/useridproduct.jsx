import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShopingNavbar from '../Navbar/ShopingNavbar';
import Box from '@mui/material/Box'; ;
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';

function valuetext(value) {

  return `${value}°C`;
}

const Useridproduct = () => {
  const [data, setData] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alldata, setalldata] = useState()
  const [pricemax, setpricemax] = useState(0);
  const [pricemin, setpricemin] = useState(0);
  const [color, setcolor] = useState() 


  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();  
  const queryParams = new URLSearchParams(location.search);  
  const category = queryParams.get('category');  
  const Quantity = queryParams.get('Quantity'); 
  const notify = () => toast.success("Card add SuccessFull !");

  
  const [offermax, setoffermax] = useState("");

  // const handleChange2 = (event) => {
  //   setoffermax(event.target.value);
  // };
  console.log(offermax)
  // const [value, setValue] = React.useState([0, 1000000]);

  // const handleChange = (event, newValue) => {
  //   setpricemin(newValue[0])
  //   setpricemax(newValue[1])
  //   setValue(newValue);
  // };





  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/v1/allproductget');
        const result = await response.json();
        if (result.data === '001') { 
          const foundProduct = result.All_Priduct.find(
            product => product._id === id && product.prooduct_category === category
          );

          // console.log(foundProduct,"ghf")
          if (foundProduct) {
            console.log(foundProduct,",,,,,>>>>")
            setData(foundProduct);

            const newdata = result.All_Priduct.filter(
              product =>
                product._id !== id && product.prooduct_category !== category
            )
            // console.log("New Data  =>>>>>>>>>>>>>> : ", newdata)
            setalldata(newdata)

            const filteredProducts = result.All_Priduct.filter(
              product =>
                product.prooduct_category === category && product._id !== id
            );

            setOtherProducts(filteredProducts);
          } else {
            setError('Product not found or category mismatch');
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

  }, [id]);
  const filterWithprice = async () => {


    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTU0MDU5LCJleHAiOjE3NDA1NTQwNTl9.U9EngkZwI014uPZh9toOKkuSm6DOXEhNuIcVN87BvrI");

const raw = JSON.stringify({
  "maxPrice": parseInt(pricemax),
  "minPrice":parseInt(pricemin)
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/minmaxprice", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.status==="001"){
      setalldata(result.data)
    }
  });

    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append(
    //   "Authorization",
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTU0MDU5LCJleHAiOjE3NDA1NTQwNTl9.U9EngkZwI014uPZh9toOKkuSm6DOXEhNuIcVN87BvrI"
    // );

    // const raw = JSON.stringify({
    //   maxPrice: parseInt(pricemax),
    //   minPrice: parseInt(pricemin),
    // });

    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };

    // const response = await fetch(
    //   "http://localhost:3000/api/v1/minmaxprice",
    //   requestOptions
    // );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const result = await response.json();

    // if (result.status === "200") {
    //   console.log(result)
    //   setalldata(result.data); // Update state with filtered products
    // } else {
    //   console.log("No data found");
    // }
  };

  const favoritecolor = async (event) => {
    const selectdata = event.target.value;
    setcolor(selectdata)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "color": selectdata
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/v1/favoritecolor", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "9090") {
          setalldata(result.data)
        }
      });
  }

  const handleChange2 = async (event) => {
    const selectedOfferMax = event.target.value; 
    setoffermax(selectedOfferMax);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "maxdiscount": selectedOfferMax,
      "mindiscount": "0"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

   await fetch("http://localhost:3000/api/v1/discountwithproduct", requestOptions)
      .then((response) => response.json())
      .then((result) =>{
        if(result.status=="001"){
          setalldata(result.data)
        }
      });
  };

  const addtocart = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImFua2l0eWFkYXZAZ21haWwuY29tIiwiaWF0IjoxNzM2OTUyOTYxLCJleHAiOjE3NDA1NTI5NjF9.Qf6nUGwyYCB-giDWl35_x3MhkRmgA0aU6-lTKo9sPEY");

      const raw = JSON.stringify({
        "categoryid": id,
        "quantity": Quantity
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      await fetch("http://localhost:3000/api/v1/addproduct", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "001") {
            setalldata(result.data)
          }
          else{
            alert(result.exist)
          }
        });
    } catch (error) {
      console.log(error)
    }
  }
  








  useEffect(() => {
    filterWithprice() 
  }, [])

  useEffect(() => {

    if (pricemax && pricemin) {
      filterWithprice()
    } else if (pricemax === "" && pricemin === "") {
      filterWithprice()
    }
    else {
      filterWithprice()
    }
  }, [pricemax, pricemin])
  // useEffect(()=>{
  //   fetchProductDetails()
  // },[])

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
      {/* Header Start */}
      <ShopingNavbar />
      {/* Header end */}
      {/* <button onClick={notify}>Notify!</button> */}

      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div>Filter's</div>
            <div>Price
              <div>
                {/* <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                /> */}
                <input type="number" onChange={(e)=>{setpricemax(e.target.value)}} placeholder='enter max price : ' />
                <input type="number" onChange={(e)=>{setpricemin(e.target.value)}} placeholder='enter min price : ' />
              </div>
            </div>
            <div>Brand</div>
            <div>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">offermax</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={offermax}
                    label="offermax"
                    onChange={handleChange2}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={25}>twenty-five</MenuItem>
                    <MenuItem value={50}>Fifty</MenuItem>
                    <MenuItem value={75}>seventy-five</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <input type="text" placeholder='enter color: ' value={color} onChange={favoritecolor} />
            </div>
            <div>COLOR</div>
          </div>
          <div className="col-lg-10 col-md-6 col-sm-12  " >

            <div className="container-fluid p-3 ">
              {/* Specific Product Card */}
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={`http://localhost:3000/${data.images[0].url}`} // Specific product image
                      alt={data.images[0].alt}
                    />

                    <CardActions>
                      <Button size="small" >BUY NOW</Button>
                      <Button size="small" target='_blank'
                        onClick={() => {

                          notify(),
                          addtocart(),
                          setTimeout(() => {
                            navigate(`/cart/${data._id}?category=${data.prooduct_category}&Quantity=${data.quantity}`)
                          }, 1000);
                        }
                        }>Add to Cart</Button>
                    </CardActions>
                  </Card>
                  <Card>

                  </Card>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
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
                    {/* <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {data.prooduct_category}
                    </Typography> */}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Quantity:</strong> {data.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Likes:</strong> {data.likes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* <strong>Rating:</strong> {data.rating} ⭐ */}
                      {Array.from({ length: data.rating }, (_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      <del>Price: ₹{data.price}</del>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Offer: {data.offer}
                    </Typography>
                    <Typography variant="h6" color="text.Primary">
                      Price: {data.DiscountedPrice}
                    </Typography>
                  </CardContent>
                </div>
              </div>

              {/* Other Products */}
              <div className="row mt-4">
                <Typography variant="h6" className="mb-3">
                  Other Products
                </Typography>
                {otherProducts.map(product => (
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={product._id} onClick={() => navigate(`/product/${product._id}?category=${product.prooduct_category}`)}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:3000/${product.images[0].url}`}
                        alt={product.images[0].alt}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {product.Product_Name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ₹{product.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/product/${product._id}?category=${product.prooduct_category}`)} // Navigate to selected product page
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          onClick={() => navigate(`/cart/${product._id}?category=${product.prooduct_category}`)} // Add to Cart navigation
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div >
      <div className="container">
        <div className="row">

          {
            alldata.length > 0 ?
              alldata?.map((product, index) => {
                return (
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={product._id} onClick={() => navigate(`/product/${product._id}?category=${product.prooduct_category}`)}>
                    key={index}
                    <div key={product.id}>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://localhost:3000/${product.images[0].url}`}
                          alt={product.images[0].alt}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {product.Product_Name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: ₹{product.price}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() => navigate(`/product/${product._id}?category=${product.prooduct_category}`)} // Navigate to selected product page
                          >
                            View Details
                          </Button>
                          <Button
                            size="small"
                            onClick={() => navigate(`/cart/${product._id}`)} // Add to Cart navigation
                          >
                            Add to Cart
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  </div>
                );
              })
              : "Data Not Found"
          }
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Useridproduct;
