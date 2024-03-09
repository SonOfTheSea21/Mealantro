import React, { useEffect } from 'react';
import { useState } from 'react';
import './Edit_Password.css';
import '../../../Navbar/Navbar.css';
import { Button } from '../../../Button';
import {toast } from 'react-toastify';
import {Slide} from 'react-toastify'
import { Link, Navigate } from 'react-router-dom';

const notify = (message) => {
    toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        style: {
            background: "white", // Change the background color
            color: '#EE4E34', // Change the text color
        },
        progressStyle: {
            background: '#EE4E34' // Change the progress bar color
        }
    });
}

function Edit_Password(props) {
  const [image, setImage] = useState("https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg")
  const [info, setInfo] = useState({
    firstname : "",
    lastname : "",
    email : "",
    password: "",
    confirmPassword: ""
  });

  const id = props.id.value;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/beforeChange/${id}`);
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

  const [socialStanding,setSocialStanding] = useState(
    {
      followers : 0,
      following : 0
    }
  )

  useEffect(() => {
    const fetchSocialStanding = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/socialStanding/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSocialStanding(data); // Assuming the response directly contains followers and following
      } catch (error) {
        console.error('Error fetching social standing data:', error);
      }
    };
    fetchSocialStanding();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInfo((prevEditedInfo) => ({
      ...prevEditedInfo,
      [name]: value
    }));
  }

  const handleUpdate = async () => {
    try {
    
        if (info.confirmPassword != info.password)
        {
            notify('Passwords do not match!')
            return
        }
      const response = await fetch(`http://localhost:5000/profile/update/change-password/${id}`, {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const returnMessage = await response.json()
        notify(returnMessage.message)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json()
      notify('Password Updated Successfully!')


// Example of navigating with state
    Navigate(`/Profile/${id}`, { state: { type: 'ViewMode' } });
    } catch (error) {
     
      console.error("Error updating user data:", error);
      
    }
  };



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
              <li> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "ViewMode",
                }}
              >
                <i className="fa fa-edit"></i> Profile
                </Link>
                </li>
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
                <li >
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
                <li className="active"> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditPassword",
                }}
              >
              <i class="fa fa-edit"></i> Change Password
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
              <div className="panel-body bio-graph-info">
                <h1>Password Update</h1>
                <div className="row">
                <div className="pinfo-item">
            <label>New Password:</label>
            <input
                className="update--section"
                type="password"
                name="password"
                value={info.password}
                onChange={handleChange}
                placeholder={info.password}
              />
          </div>

          <div className="pinfo-item">
            <label>Confirm Password:</label>
              <input
              className="update--section"
                type="password"
                name="confirmPassword"
                value={info.confirmPassword}
                onChange={handleChange}
                placeholder={info.confirmPassword}
              />
          </div>
                </div>
              </div>
            <div className='update-btn'>
                <Button buttonStyle='btn--test' onClick={handleUpdate}>Update</Button>
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

export default Edit_Password;