import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const SignupPage = () =>{
    const [formData, setFormData] = useState({
        username : "",
        email : "",
        password : "",
        confirmPassword : "",
        phone: "",
        role: "admin", // default value
    });
    const [error, setError] = useState({
        usernameErr : "",
        emailErr : "",
        passwordErr : "",
        confirmPasswordErr : "",
        phoneErr: "",
        roleErr: ""
    });
    const[successMsg, setSuccessMsg] = useState("");

    const onChangeHandler = (e : any) =>{
       setFormData(prev => ({...prev, [e.target.name] : e.target.value}));
       setError(prev => ({...prev, [e.target.name + "Err"] : ""}))
    }

    // prev : previous state of formData, we spread it to keep all existing values and then update the specific field that changed using [e.target.name] as the key and e.target.value as the new value. This way, we can handle changes for all input fields with a single function.
    // Rest operator (...) is used to create a new object that includes all the properties of the previous state (prev) and then we overwrite the specific error field corresponding to the input that changed by using [e.target.name + "Err"] as the key and setting it to an empty string. This ensures that when the user starts typing in an input field, any previous error message for that field is cleared.
    
    const submitHandler = async (e : any) =>{
        e.preventDefault();
        console.log(formData);
        
        if(!formData.username){
            setError({...error, usernameErr: "Please fill UserName"});
        } 
        if (!formData.email){
            setError({...error , emailErr : "Please fill Email"});
        } if (formData.password.length < 6) {
            setError({...error,passwordErr:"Password must be at least 6 characters"});
        }     
        if(formData.password !== formData.confirmPassword){
            setError({...error, confirmPasswordErr : "Passwords do not match"});
        }
        const payload = {
            name : formData.username,
            email : formData.email,
            password : formData.password,
            phone : formData.phone,
            role : formData.role
        }
        try{
          const { data } = await axiosInstance.post("/auth/register", payload);
          console.log("Response:", data);

          if(data.success){
            setSuccessMsg("Signup successful! Please login to continue.");
            // navigate(" /login");
          }
        }catch(err: any){
          setError(prev => ({...prev, ...err.response?.data?.errors}));
        }
   };
    
    return(
<div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
    
    <h1 className="text-3xl font-bold text-center text-gray-800">
      Book Store
    </h1>

    <h2 className="text-xl text-center text-gray-600 mt-2">
      Create Account
    </h2>

    <p className="text-sm text-center text-gray-500 mb-6">
      Join Our BookStore Community
    </p>

    <form onSubmit={submitHandler} className="space-y-4">
      
      <input
        type="text"
        name="username"
        placeholder="UserName"
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500" >{error.usernameErr}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500" >{error.emailErr}</p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500" >{error.passwordErr}</p>}

      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500" >{error.confirmPasswordErr}</p>}

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500" >{error.phoneErr}</p>}
       
      <select
      name="role"
      value={formData.role}
      onChange={onChangeHandler}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="admin">Admin</option>
      <option value="staff">Staff</option>
    </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200" 
      >
        SignUp
      </button>
      {successMsg && <p className="text-green-500" >{successMsg}</p>}
    </form>

  </div>
</div>
    );
}

export default SignupPage;
