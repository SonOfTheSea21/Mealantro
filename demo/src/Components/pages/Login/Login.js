import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import './Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Footer/Footer';
import {toast } from 'react-toastify';
import {Slide} from 'react-toastify'
const notifySuccess = () => {
    toast('🎉 Successfully logged in!', {
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

const notifyError = (message) => {
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





function Login() {

    const [form,setForm] = useState({
        email:"",
        password:""
    })
    const navigate = useNavigate()

    function handleChange(e){
        const {name,value } = e.target
        setForm(()=>{
            return {
                ...form,
                [name] : value
            }
        })
    }
        const handleSubmit = async (event) => {
            try {
                event.preventDefault();
        
                const response = await fetch('http://localhost:5000/Login', {
                    method: 'POST',
                    body: JSON.stringify(form),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const returnMessage = await response.json()
                    console.log(returnMessage.message)
                    notifyError("❗ " + returnMessage.message)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                notifySuccess()
                const data = await response.json()
                
                navigate(`/Home/${data.data[0].user_id}`);
                console.log(data)

            } catch (error) {
                console.error('Error during form submission:', error);
            }
        }

  return (
    <div>
    <div className='hhero-container'>
      <video src='videos/video-1.mp4' autoPlay loop muted />
      <img src={'/images/Mealantro_Logo1.png'} alt="Logo" className="login_logo" />
      {/*<h1>MEALANTRO</h1>*/}
      <div className="Login-container">
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email address"
                    className="form--input"
                    name = "email"
                    value = {form.email}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    className="form--input"
                    name = "password"
                    value = {form.password}
                    onChange = {handleChange}
                />
                
                <div className="Sign" >
                    <label htmlFor="Hyperlink">Not a user?</label>
                   <a href="http://localhost:3000/SignUp" id="Hyperlink">Click here to Sign up!</a>
                </div>
            </form>
        </div>
      <div className='hero-btns'>
        <Button
          link = '/SignUp'
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleSubmit}
        >
          LOG IN
        </Button>
      </div>

    </div>
    <Footer />
    </div>
  );
}

export default Login;