import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import ICards from './ICards';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo'


function IRecipes() {
    const { id } = useParams();

    const location = useLocation();


    console.log("URL Params:", { id });

  return (
    <>
    <Logo id={{ value: id }} />
   <Navbar id={{ value: id }} /> 
    
    <ICards 
    id={{ value: id }}
     />

    <Footer />
    </>

  );
}

export default IRecipes;