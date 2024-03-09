import React, { useEffect } from 'react';
import { useState } from 'react';
import './OtherUserPage.css';
import '../../../Navbar/Navbar.css';
import { Button } from '../../../Button';
import { Link, useParams } from 'react-router-dom'; // Import useParams
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function OtherUserPage(props) {
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
  const [isFollowing,setIsFollowing] = useState();
  const [socialStanding,setSocialStanding] = useState(
    {
      followers : 0,
      following : 0
    }
  )

  const { oid, id } = useParams(); // Extract oid and id from parameters

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/oprofile/${oid}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setInfo(data.data[0]);
      setIsFollowing(data.isFollowing)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSocialStanding = async () => {
    try {
      const response = await fetch(`http://localhost:5000/oprofile/socialStanding/${oid}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSocialStanding(data.data); // Assuming the response directly contains followers and following
    } catch (error) {
      console.error('Error fetching social standing data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    fetchSocialStanding();
  }, [oid, id]); // Add oid and id to the dependency array

  const handleFollow = async () => {
    try {
        // Send PUT request to follow/unfollow user
        await fetch(`http://localhost:5000/oprofile/follow/${oid}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Fetch user info again after following/unfollowing
        fetchUserData();
        fetchSocialStanding();
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
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
                <a href="#">
                  <img src={image} alt="" />
                </a>
                <h1>{info.firstname +" " + info.lastname}</h1>
                <p>Followers : { socialStanding.followers}</p>
                <p>Following : { socialStanding.following}</p>
              </div>

              <ul className="nav nav-pills nav-stacked">
              <li className="active"><a href={`/Profile/${oid}/${id}`}> <i className="fa fa-user"></i> Profile</a></li>
            {isFollowing && (
                <>
                    <li>
                        <Link
                            to={`/Profile/${oid}/${id}`}
                            state={{
                                type: "Timeline",
                            }}
                        >
                            <i className="fa fa-photo"></i> Timeline
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/Profile/${oid}/${id}`}
                            state={{
                                type: "SavedFoods",
                            }}
                        >
                            <i className="fa fa-calendar"></i> Saved Foods
                        </Link>
                    </li>
                </>
            )}
              </ul>
            </div>
          </div>
          <div className="profile-info col-md-9">
          <div className='follow-btn'>
                {isFollowing && <Button buttonStyle='btn--test' onClick={handleFollow}>Unfollow</Button>}
                {!isFollowing && <Button buttonStyle='btn--test'onClick={handleFollow} >Follow</Button>}
            </div>
            <div className="panel">
              
            </div>
            <div className="panel">
              
              <div className="panel-body bio-graph-info">
                <h1>{info.firstname}'s Information</h1>
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
export default OtherUserPage;
