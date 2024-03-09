import React from 'react';
import '../../../App.css';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import Logo from '../../Logo';
import OtherUserPage from './OtherUserPage/OtherUserPage';
import { useParams } from 'react-router-dom'; // Import useParams hook
import OSaved_Foods from './OSaved_Foods/OSaved_Foods';
import OTimeline from './OTimeline/Timeline';
import { useLocation } from 'react-router-dom';

function OProfile() {
    const { oid, id} = useParams(); // Extract both parameters from the URL
    const location = useLocation();
    const type = location.state?.type || "ViewMode"; // Default to "ViewMode" if type is not provided
    return (
        <>
            <Logo id={{ value: id }} />
            <Navbar id={{ value: id }} />
            {type === "Timeline" && <OTimeline oid = {oid} id={{ value: id }} />}
            {type === "SavedFoods" && <OSaved_Foods oid = {oid}id={{ value: id }} />}
            {type == "ViewMode" && <OtherUserPage oid={oid} id={{ value: id }} /> }{/* Pass both parameters to OtherUserPage */}
            <Footer />
        </>
    );
}

export default OProfile;

