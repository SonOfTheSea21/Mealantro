import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo';
import URecipe from './URecipe';

function Edit_Recipe() {
    const { id, Name } = useParams();

    const location = useLocation();
    const { rid } = location.state || {};

    console.log("URL Params:", { id, Name });
  console.log("State from Link:", location);
  return (
    <>
    <Logo id={{ value: id }} />
   <Navbar id={{ value: id }} /> 

    <URecipe 
    id={{ value: id }} 
    rid={rid}
    />


   
    <Footer />
    </>

  );
}

export default Edit_Recipe;