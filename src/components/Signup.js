import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Signup(props) {
    const [credentials, setCredentials] = useState({name:"",email:"", password:""})

    let navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        //TODO: API Call
        const {name, email, password} = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });
        const json = await response.json()
        console.log(json);
        if(json.success){
            // save the auth-token and redirect
            localStorage.setItem('token',json.authtoken);
            navigate("/")
            props.showAlert("Account Created Successfully","success");
        }else{
            props.showAlert("Invalid Credentials","danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]: e.target.value})
    }

    return (
        <div className="mt-3">
            <h2>Signup to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-3">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" placeholder="Enter name" onChange={onChange}/>
                </div>
                <div className="form-group my-3">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange}/>
                </div>
                <div className="form-group my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={onChange} minLength={5} required/>
                </div>
                <div className="form-group my-3">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" placeholder="Password" onChange={onChange} minLength={5} required/>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
