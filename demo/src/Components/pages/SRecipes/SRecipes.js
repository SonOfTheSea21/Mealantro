import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import SCards from './SCards';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo'
function SRecipes() {
    const { id, Name } = useParams();

    const location = useLocation();
    const { type, sid, sname, description, spice, origin } = location.state || {};

    console.log("URL Params:", { id, Name });
  console.log("State from Link:", location);
  return (
    <>
    <Logo id={{ value: id }} />
   <Navbar id={{ value: id }} /> 
    
    <SCards 
    id={{ value: id }}
    type={type} 
    sId={sid} 
    sName={sname} 
    description={description}
    spice={spice}
    origin={origin} />


   
    <Footer />
    </>

  );
}

export default SRecipes;