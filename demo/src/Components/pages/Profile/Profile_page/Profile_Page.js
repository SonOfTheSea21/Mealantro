import React, { useEffect } from 'react';
import { useState } from 'react';
import './Profile_Page.css';
import '../../../Navbar/Navbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function Profile_Page(props) {
  const [image, setImage] = useState("https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg")
  const [info, setInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthdate: "",
    nationality: "",
    religion: "",
    occupation: "",
    user_photo: "",
    street_name: "",
    postal_code: "",
    city: "",
    country_name: ""
  });

  const [socialStanding,setSocialStanding] = useState(
    {
      followers : 0,
      following : 0
    }
  )
  const id = props.id.value;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setInfo(data.data[0]);
        if (data.data[0].user_photo) {
          setImage(`http://localhost:5000/profile/image/${id}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSocialStanding = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/socialStanding/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSocialStanding(data.data); // Assuming the response directly contains followers and following
      } catch (error) {
        console.error('Error fetching social standing data:', error);
      }
    };
    fetchSocialStanding();
  }, [id]);
  





  return (
    <div className="pform-container">
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
      <div className="container bootstrap snippets bootdey">
        <div className="row">
          <div className="profile-nav col-md-3">
            <div className="panel">
              <div className="user-heading round">
              <a href={`/Profile/${id}`}>
                  <img 
                      width="150px"
                      src={image}
                      alt="Profile" />
                </a>
                <h1>{info.firstname +" " + info.lastname}</h1>
                {id.startsWith('A') && 
                <h3 style={{color: "black"}}>Admin</h3>
                }
                <p>Followers : { socialStanding.followers}</p>
                <p>Following : { socialStanding.following}</p>
              </div>

              <ul className="nav nav-pills nav-stacked">
                <li className="active"><a href={`/Profile/${id}`}> <i className="fa fa-user"></i> Profile</a></li>
      
                <li>
                  <Link
                  to={`/Profile/${id}`}
                  state= {{ 
                    type: "Timeline",
                  }}
                >   
                <i className="fa fa-photo"></i> Timeline 
                </Link>
                </li>
                <li>
                  <Link
                  to={`/Profile/${id}`}
                  state= {{ 
                    type: "YourRecipes",
                  }}
                >   
                <i className="fa fa-photo"></i> Your Recipes
                </Link>
                </li>
                <li><Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "SavedFoods",
                }}
              >
              <i className="fa fa-calendar"></i> Saved Foods
              </Link></li>
                <li> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditMode",
                }}
              >
              <i className="fa fa-edit"></i> Edit profile
              </Link>
              </li>
              <li> 
                <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditPassword",
                }}
              >
              <i className="fa fa-edit"></i> Change Password
              </Link>
              </li>

              <li> 
                <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "InsertRecipe",
                }}
              >
              <i className="fa fa-edit"></i> Share your Recipes
              </Link>
              </li>
              </ul>
            </div>
          </div>
          <div className="profile-info col-md-9">
            <div className="panel">
              <form>
                <textarea placeholder="Whats in your mind today?" rows="2" className="form-control input-lg p-text-area"></textarea>
              </form>
              <footer className="panel-footer">
                <button className="btn btn-warning pull-right">Post</button>
                <ul className="nav nav-pills">
               
                  <li className='sml'>
                    <a href="#"><i className="fa fa-camera"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className=" fa fa-film"></i></a>
                  </li>
            
                </ul>
              </footer>
            </div>
            <div className="panel">
              
              <div className="panel-body bio-graph-info">
                <h1>User Information</h1>
                <div className="row">
                <div className="pinfo-item">
            <label>First Name:</label>
              <p1>{info.firstname}</p1>
         
          </div>

          <div className="pinfo-item">
            <label>Last Name:</label>
              <p1>{info.lastname}</p1>
          
          </div>

          <div className="pinfo-item">
            <label>Email:</label>
              <p1>{info.email}</p1>
    
          </div>

          <div className="pinfo-item">
            <label>Birthdate:</label>
              <p1>{formatDate(info.birthdate)}</p1>
      
          </div>

          <div className="pinfo-item">
            <label>Nationality:</label>

              <p1>{info.nationality}</p1>
          
          </div>

          <div className="pinfo-item">
            <label>Religion:</label>
              <p1>{info.religion}</p1>
          
          </div>

          <div className="pinfo-item">
            <label>Occupation:</label>
              <p1>{info.occupation}</p1>
          
          </div>

          <div className="pinfo-item">
            <label>Street Name:</label>
              <p1>{info.street_name}</p1>
         
          </div>
              
          <div className="pinfo-item">
            <label>Postal Code:</label>
              <p1>{info.postal_code}</p1>
          </div>

          <div className="pinfo-item">
            <label>City:</label>
              <p1>{info.city}</p1>
          </div>
          <div className="pinfo-item">
            <label>Country Name:</label>
              <p1>{info.country_name}</p1>
           
          </div>
                </div>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_Page;
