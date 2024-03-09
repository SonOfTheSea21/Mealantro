import React from 'react'
import "./SignUp.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../Button';
import Footer from '../../Footer/Footer';
import FormInput from './formInput';
import {toast } from 'react-toastify';
import {Slide} from 'react-toastify'
const notifySuccess = () => {
  toast('🎉 Registration Successful!', {
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
export default function SignUp()
{
    const navigate = useNavigate()
    const [form, setform] = useState({
        "First Name": "",
        "Last Name": "",
        email: "",
        Password: "",
        "Confirm Password": "",
        birthdate: "",
      });

    const handleChange = (e) =>{
        const {name,type,value} = e.target
      setform({
        ...form,
        [name] : value
      })
    }

    const inputs = [
        {
          id: 1,
          type: "text",
          placeholder: "First Name",
          className: "form--input",
          name: "First Name",
          value: form["First Name"],
          required: true,
          pattern: "^[A-Za-z0-9]{3,16}$",
          errorMessage:"Name shouldn't have any special character "
        },
        {
          id: 2,
          type: "text",
          placeholder: "Last Name",
          className: "form--input",
          name: "Last Name",
          value: form["Last Name"],
          required: true,
          pattern: "^[A-Za-z0-9]{3,16}$",
          errorMessage:"Name shouldn't have any special character "
        },
        {
          id: 3,
          type: "date",
          placeholder: "Birthdate (DD-MM-YYYY)",
          className: "form--input",
          name: "birthdate",
          value: form.birthdate,
          required: true,
          errorMessage:""
        },
        {
          id: 4,
          type: "email",
          placeholder: "Email",
          className: "form--input",
          name: "email",
          value: form.email,
          required: true,
          errorMessage:"It should be a valid email address!"
        },
        {
          id: 5,
          type: "password",
          placeholder: "Password",
          className: "form--input",
          name: "Password",
          value: form.Password,
          required: true,
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          errorMessage:"Password should be 8-20 characters long and it should contain atleast 1 number, 1 letter and 1 special character"
        },
        {
          id: 6,
          type: "password",
          placeholder: "Confirm Password",
          className: "form--input",
          name: "Confirm Password",
          value: form["Confirm Password"],
          required: true,
          pattern: form.Password,
          errorMessage:"Passwords don't match!",
         
        }
      ];
    
 
      
    const handleSubmit = async (event) => {
        try {
           
            event.preventDefault();
            if (Object.values(form).some(value => value.trim() === '')) {
                console.error('Error: All form fields must be filled');
                return;
            }
        
            const response = await fetch('http://localhost:5000/SignUp', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            notifySuccess()
            const data = await response.json();
            navigate('/');
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };



        return (
            <div>
            <div className='hero-container'>
            <video src='videos/video-1.mp4' autoPlay loop muted />
            <div className='hero-btns'>
            <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
            <p className='createAccount'>Create Account</p>
                {inputs.map((input)=>(
                    <FormInput key={input.id} {...input} value = {form[input.name]} onChange={handleChange} form={form}/>
                ))}
                    </form>
                </div>         
            </div>   
            </div>

    <div className='SignUpButton'>
    <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleSubmit}
        >
          SIGN UP
        </Button>
 
    </div>
     
            <Footer />
            </div>
        )
}