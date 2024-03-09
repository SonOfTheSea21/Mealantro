import React from 'react';
import '../../../App.css';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import Profile_Page from './Profile_page/Profile_Page';
import Logo from '../../Logo'
import Edit_Profile from './Edit_Profile/Edit_Profile';
import { useParams, useLocation } from 'react-router-dom';
import Edit_Password from './Edit_Password/Edit_Password';
import Insert_Recipe from './Insert_Recipe/Insert_Recipe'
import Timeline from './Timeline/Timeline';
import Saved_Foods from './Saved_Foods/Saved_Foods';
import Your_Recipes from './Your_Recipes/Your_Recipes';


function Profile() {
    const { id } = useParams();
    const location = useLocation();
    const type = location.state?.type || "ViewMode";
    console.log(type);
    console.log("Hello", id);
    return (
        <>
            <Logo id={{ value: id }} />
            <Navbar id={{ value: id }} />

            
            {type === "EditMode" && <Edit_Profile id={{ value: id }}/>}
            {type === "ViewMode" && <Profile_Page id={{ value: id }}/>}
            {type === "Timeline" && <Timeline id={{ value: id }} />}
            {type === "EditPassword" && <Edit_Password id = {{value:id}}/>}
            {type === "InsertRecipe" && <Insert_Recipe id={{ value: id }}/>}
            {type === "SavedFoods" && <Saved_Foods id={{ value: id }} />}
            {type === "YourRecipes" && <Your_Recipes id={{ value: id }} />}

            <Footer />
        </>
    );
}

export default Profile