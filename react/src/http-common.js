import axios from "axios";

const http = (token) => {

  if( typeof token === 'undefined' ){
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        "Content-type": "application/json",
      }
    })
  }else{
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
  }


  

}

export default http
 