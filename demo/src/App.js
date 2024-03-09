// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router, } from 'react-router-dom';

import "./App.css"
import Intro from './Components/pages/Intro/Intro'
import Profile from './Components/pages/Profile/Profile';
import Login from './Components/pages/Login/Login'
import Home from './Components/pages/Home/Home';

import Meals from './Components/pages/Meals/Meals';
import Cuisines from './Components/pages/Cuisines/Cuisines';
import SRecipes from './Components/pages/SRecipes/SRecipes';
import Recipe from './Components/pages/ind_Recipe/Recipe';
import Edit_Recipe from './Components/pages/ind_Recipe/Edit_Recipe';
import Inventory from './Components/pages/Inventory/Inventory';
import IRecipes from './Components/pages/IRecipes/IRecipes';
import SignUp from './Components/pages/SignUp/SignUp';
import Ingredients from './Components/pages/Ingredients/Ingredients';
import Edit_Profile from './Components/pages/Profile/Edit_Profile/Edit_Profile';
import Search from "./Components/pages/Search/Search"
import Newsfeed from './Components/pages/Newsfeed/Newsfeed';
import OProfile from './Components/pages/OtherUserPage/OProfile';
import Dashboard from './Components/pages/Dashboard/Dashboard';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Recipes from './Components/pages/Recipes/Recipes';
import Restaurants from './Components/pages/Restaurants/Restaurants';


const App = () => {
  return (
    <>

      <div className="backdrop"></div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Intro />} />
          <Route path='/Login' exact element={<Login />} />
          <Route path='/SignUp' exact element={<SignUp/>} />
          <Route path='/Home/:id' exact element={<Home />} />
          <Route path='/Profile/:id' exact element={<Profile />} />
          <Route path='/Profile/:id' exact element={<Profile />} />
          <Route path='/Restaurants/:id' exact element={<Restaurants />} />
          <Route path='/Meals/:id' exact element={<Meals />} />
          <Route path='/Profile/EditProfile/:id' exact element={<Edit_Profile />} />
          <Route path='/Cuisines/:id' exact element={<Cuisines />} />
          <Route path='/Ingredients/:id' exact element={<Ingredients />} />
          <Route path='/Inventory/:id' exact element={<Inventory />} />
          <Route path='/Recommended/:id' exact element={<IRecipes />} />
          <Route path='/SRecipes/:id/:sname' exact element={<SRecipes />} />
          <Route path='/Recipe/:id/:rname' exact element={<Recipe />} />
          <Route path='/Edit_Recipe/:id/:rname' exact element={<Edit_Recipe />} />
          <Route path='/Search/:id' exact element={<Search />} />
          <Route path='/Recipes/:id' exact element={<Recipes />} />
          <Route path='/Newsfeed/:id' exact element={<Newsfeed />} />
          <Route path='/Dashboard/:id' exact element={<Dashboard />} />
          <Route path='/profile/:oid/:id' exact element={<OProfile />} />

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
      </Router>

    </>
  );
};



export default App;