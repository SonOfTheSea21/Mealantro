import React, { useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import Cards from './Cards';
import Logo from '../../Logo';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const { id } = useParams();
    console.log(id);

    


    return (
        <>
            <Logo id={{ value: id }} />
            <Navbar id={{ value: id }} />
            <Cards id={{ value: id }}/>
            <Footer />
        </>
    );
}

export default Home;
