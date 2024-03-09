import React, { useEffect } from 'react';
import { useState } from 'react';
import './Edit_Profile.css';
import '../../../Navbar/Navbar.css';
import { Button } from '../../../Button.js';
import {toast } from 'react-toastify';
import {Slide} from 'react-toastify'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const notifySuccess = () => {
    toast('Info Updated Successfully!', {
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

function Edit_Profile(props) {
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

  const navigate = useNavigate();

  const [editedInfo, setEditedInfo] = useState({
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
  console.log(props.id.value)
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
        console.log(editedInfo);
        setEditedInfo(data.data[0]);
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
        setSocialStanding(data.data); // Assuming the response directly contains followers and following
      } catch (error) {
        console.error('Error fetching social standing data:', error);
      }
    };
    fetchSocialStanding();
  }, [id]);
  


  function handleChange(e) {
    const { name, value } = e.target;
    setEditedInfo((prevEditedInfo) => ({
      ...prevEditedInfo,
      [name]: value
    }));
  }

  const handleUpdate = async () => {
    console.log(editedInfo)

    const formData = new FormData();
        // Append all editedInfo fields to formData
        Object.keys(editedInfo).forEach(key => {
          if (key === 'user_photo') {
            formData.append(key, editedInfo[key]);
          } else {
            formData.append(key, editedInfo[key]);
          }
        });


    try {
      const response = await fetch(`http://localhost:5000/profile/update/${id}`, {
        method: "PUT",
        body: formData,
      });
      console.log(editedInfo)
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      notifySuccess()


// Example of navigating with state
    navigate(`/Profile/${id}`, { state: { type: "ViewMode" } });
      setInfo(editedInfo)
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      console.log(imageUrl);
      setEditedInfo((prevEditedInfo) => ({
        ...prevEditedInfo,
        user_photo: file,
      }));
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
                <h1>{editedInfo.firstname +" " + editedInfo.lastname}</h1>
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
                
                <li className="active"> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditMode",
                }}
              >
                <i className="fa fa-edit"></i> Edit profile
                </Link>
                </li>
                <li> <Link
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
                <h1>User Information</h1>
                <div className="row">
                <div className="pinfo-item">
            <label>First Name:</label>
            <input
                className="pupdate--section"
                type="text"
                name="firstname"
                value={editedInfo.firstname}
                onChange={handleChange}
                placeholder={info.firstname}
              />
          </div>

          <div className="pinfo-item">
            <label>Last Name:</label>
              <input
              className="pupdate--section"
                type="text"
                name="lastname"
                value={editedInfo.lastname}
                onChange={handleChange}
                placeholder={info.lastname}
              />
          </div>

          <div className="pinfo-item">
            <label>Email:</label>
              <input
              className="pupdate--section"
                type="text"
                name="email"
                value={editedInfo.email}
                onChange={handleChange}
                placeholder={info.email}
              />
          </div>

          <div className="pinfo-item">
            <label>Birthdate:</label>
          
              <input
              className="pupdate--section"
                type="date"
                name="birthdate"
                value={editedInfo.birthdate}
                onChange={handleChange}
                placeholder={info.birthdate}
              />
          </div>

          <div className="pinfo-item">
            <label>Nationality:</label>
              <input
              className="pupdate--section"
                type="text"
                name="nationality"
                value={editedInfo.nationality}
                onChange={handleChange}
                placeholder={info.nationality}
              />
          </div>

          <div className="pinfo-item">
            <label>Religion:</label>
              <input
              className="pupdate--section"
                type="text"
                name="religion"
                value={editedInfo.religion}
                onChange={handleChange}
                placeholder={info.religion}
              />
          </div>
          <div className="pinfo-item">
            <label>Occupation:</label>
       
              <input
              className="pupdate--section"
                type="text"
                name="occupation"
                value={editedInfo.occupation}
                onChange={handleChange}
                placeholder={info.occupation}
              />
          </div>
          <div className="pinfo-item">
            <label>Street Name:</label>
              <input
              className="pupdate--section"
                type="text"
                name="street_name"
                value={editedInfo.street_name}
                onChange={handleChange}
                placeholder={info.street_name}
              />
          </div>       
          <div className="pinfo-item">
            <label>Postal Code:</label>
              <input
              className="pupdate--section"
                type="text"
                name="postal_code"
                value={editedInfo.postal_code}
                onChange={handleChange}
                placeholder={info.postal_code}
              />
          </div>
          <div className="pinfo-item">
            <label>City:</label>
              <input
              className="pupdate--section"
                type="text"
                name="city"
                value={editedInfo.city}
                onChange={handleChange}
                placeholder={info.city}
              />
          </div>
          <div className="pinfo-item">
            <label>Country Name:</label>
              <input
              className="pupdate--section"
                type="text"
                name="country_name"
                value={editedInfo.country_name}
                onChange={handleChange}
                placeholder={info.country_name}
            /> 
          </div>
          <div className="pinfo-item">
          <label>Your Photo:</label>
          <img 
                    width="150px"
                    src={image}
                    alt="Profile"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple={false}
                    className="file-input"
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

export default Edit_Profile;