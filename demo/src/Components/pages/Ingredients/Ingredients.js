import React from 'react';
import '../../../App.css';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import List from './List';
import Logo from '../../Logo'
import SearchBar from '../../SearchBar/searchBar'


function Ingredients() {
    const {id} = useParams();
    console.log(id);

    console.log("CRL Params:", { id });
  return (
    <>
    <Logo id={{ value: id }} type = 'change'/>
   <Navbar id={{ value: id }} /> 
   <SearchBar type = 'ingredient' id = {id} />
    <List id={{ value: id }}/>
   
    <Footer />
    </>

  );
}

export default Ingredients;