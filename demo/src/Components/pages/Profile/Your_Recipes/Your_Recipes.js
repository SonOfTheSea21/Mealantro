import React, { useEffect } from 'react';
import { useState } from 'react';
import '../Profile_page/Profile_Page.css';
import '../../../Navbar/Navbar.css';
import { Link } from 'react-router-dom';
import RCards from './RCards';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function Your_Recipes(props) {
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
  }, [id]);

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
              <li><Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "ViewMode",
                }}
              >
                <i className="fa fa-edit"></i> Profile
                </Link></li>
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
                <li className='active'>
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
                <RCards id = {id}/>
          </div>
              </div>
            </div>
            <div>
            </div>
          </div>



  );
}

export default Your_Recipes;
