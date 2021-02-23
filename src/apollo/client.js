import Cookies from "js-cookie"

export default function(context){
  return {
    httpEndpoint: process.env.BACKEND_ENDPOINT || "https://khuise-shop-6598.herokuapp.com/graphql-web/",
    httpLinkOptions: {
      headers: {
        "X-CSRFToken": csrftoken
      }    
    }
  }
}

