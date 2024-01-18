import React, { useEffect, useState } from 'react'
import Home from './Components/Home/Home'
import Cart from './Components/Cart/Cart'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayOut from './Components/MainLayOut/MainLayOut'
import Product from './Components/Product/Product'
import Login from './Components/Login/Login'
import SignUp from './Components/Sign up/SignUp'
import jwt_decode from "jwt-decode";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './Components/NotFound/NotFound'

export default function App() {
  let [cartItem,setCartItem]=useState([])
  let [use, setUse] = useState()
  
  function addTo(data){
    localStorage.setItem("data",JSON.stringify(data))
  }
  
  useEffect(()=>{
    const items = JSON.parse(localStorage.getItem('data')) || [];
    
     setCartItem(items);
    
  },[])

  const notify = () => toast("added successfully");

  function addItme(item){
     let exist = cartItem.find((ele)=>ele.id===item.id)
    if(exist){
      let cart=cartItem.map((ele)=>ele.id===item.id?{...exist,qty:exist.qty+1}:ele)
      setCartItem(cart)
      addTo(cart)
      notify()
    }else{
      let cart =[...cartItem,{...item,qty:1}]
      setCartItem(cart) 
      addTo(cart) 
      notify()    
    }  

  }
  function remove(item){
    let exist = cartItem.find((ele)=>ele.id===item.id)
    if(exist.qty>1){
      let cart=cartItem.map((ele)=>ele.id===item.id?{...exist,qty:exist.qty-1}:ele)
      setCartItem(cart)
      addTo(cart)
      
    }else{
      let cart=cartItem.filter((ele)=>ele.id!==item.id)
      setCartItem(cart)
      addTo(cart)
    }
  }
  function delet(item){
    let cart=cartItem.filter((ele)=>ele.id!==item.id)
    setCartItem(cart)
    addTo(cart)
  }
  function removeAll(){
    let cart=[]
    setCartItem(cart)
    addTo(cart)
  }

  function ProtuctRouters(props) {
    if (localStorage.getItem("token")) {
      return props.children
    } else {
      return <Navigate to="/e-commerce/signIn" />
    }
  }

  function logout() {
    localStorage.removeItem("token")
    setUse(null)
    return <Navigate to="/e-commerce"/>
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      usedata()
    }
  }, [])

  function usedata() {
    let token = localStorage.getItem("token")
    let decoded = jwt_decode(token)
    setUse(decoded)

  }
  const Router=createBrowserRouter([{path:"/e-commerce",element:<MainLayOut use={use} logout={logout} cartItem={cartItem}/>,children:[
    {index:true,element:<Home addItme={addItme}/>},
    {path:"/e-commerce/categories/:id",element:<Product addItme={addItme}/>},
    {path:"/e-commerce/signIn",element:<Login usedata={usedata}/>},
    {path:"/e-commerce/signUp",element:<SignUp/>},
    {path:"/e-commerce/cart",element:
    <ProtuctRouters><Cart removeAll={removeAll} delet={delet} remove={remove} cartItem={cartItem} addItme={addItme}/></ProtuctRouters> },
    {path:"*",element:<NotFound/>}
    ]}])
  return (
    <div>
      <RouterProvider router={Router}></RouterProvider>
    </div>
  )
}
