import React from 'react'
import { useNavigate } from 'react-router-dom';
// const { id } = useParams()

const ShopingNavbar = () => {
    const navigate = useNavigate()
    // console.log(id)
    // const addcards = async () => {
    //     try {
    //         const requestOptions = {
    //             method: "GET",
    //             redirect: "follow"
    //         };

    //         await fetch("http://localhost:3000/api/v1/showalladdcard", requestOptions)
    //             .then((response) => response.json())
    //             .then((result) => {
    //                 console.log(result.data)
    //             });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
  return (
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
<div class="container-fluid">
    <a class="navbar-brand" href="#">Shoping_Website</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        {/* <form class="d-flex   mainforminput" role="search"> */}
            <input  class="form-control  ms-4  navinput" type="search" placeholder="Search" aria-label="Search" />
         {/* </form> */}
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <a class="nav-link active me-5" aria-current="page" href="#">Profile</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active me-5" 
                // onClick={()=>{
                //     navigate("/cart")
                // }}
                 href="#">Cart</a>
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
    </div>
  )
}

export default ShopingNavbar