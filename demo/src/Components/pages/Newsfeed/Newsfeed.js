import React from 'react';
import '../../../App.css';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import Logo from '../../Logo'

import { useParams, useLocation } from 'react-router-dom';
import NewsfeedHero from './NewsfeedHero';
import SearchBar from '../../SearchBar/searchBar';


function Newsfeed() {
    const { id } = useParams();
    const location = useLocation();
    const type = location.state ? location.state.type : null; // Access the type prop from location.state
    console.log(type);
    console.log("Hello", id);
    return (
        <>
            <Logo id={{ value: id }}  type='change'/>
            <Navbar id={{ value: id }} />
            <SearchBar type = 'user' id = {id} />
            <NewsfeedHero />
            <Footer />
        </>
    );
}

export default Newsfeed