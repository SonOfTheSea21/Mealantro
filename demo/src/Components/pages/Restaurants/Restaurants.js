import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import List from './List';
import Logo from '../../Logo'


function Restaurants() {
    const {id} = useParams();
    console.log(id);

    console.log("CRL Params:", { id });
  return (
    <>
    <Logo id={{ value: id }} />
    <Navbar id={{ value: id }} /> 
    <List id={{ value: id }}/>
    <Footer />
    </>

  );
}

export default Restaurants;