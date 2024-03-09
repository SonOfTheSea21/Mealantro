import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo';
import Inventory_List from './Inventory_List';

function Inventory() {
  const {id} = useParams();
return (
  <>
  <Logo id={{ value: id }} />
 <Navbar id={{ value: id }} /> 

  <Inventory_List id={{ value: id }} />


 
  <Footer />
  </>

);
}

export default Inventory;