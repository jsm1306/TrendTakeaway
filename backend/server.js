import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
dotenv.config();
import { auth } from 'express-openid-connect'
const app = express();
const PORT = process.env.PORT || 5000;
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');





app.use(auth(config));

app.get('/', (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  )
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});



const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
  };
app.use(auth(config));

app.use(express.json()); 
app.use("/api/products", productRoutes);
app.listen(PORT,()=>{
    connectDB();
    console.log("Server started at http://localhost:"+PORT);
})