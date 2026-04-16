import { useState, useTransition } from "react";


const LoginPage = () =>{
    const [loginData, setloginData] = useState({
       email :"",
        password : "",
    });

    const [loginError, setloginError] = useState({
        emailError : "",
        passwordError : "",
    }) 

    const[successMessage, setSuccessMessage] = useState("");

    const [isPending, startTransition] = useTransition();
     
    const onChangeLogin = (e : any) =>{
        setloginData(prev =>({...prev, [e.target.name] : e.target.value}));
        setloginError(prev =>({...prev, [e.target.name + "Error"] : ""}));
    
    }
    const APIURL = import.meta.env.VITE_BACKEND_API_URL
    const onSubmitLogin = (e : any) =>{
        e.preventDefault();
        startTransition(()=> {
            
        setloginError(prev =>({...prev,[e.target.name + "Error"] : ""}));
        if(!loginData.email){
            setloginError(prev=>({...prev, emailError : "Please fill Email"}));
        }
        else if(!loginData.password){
            setloginError(prev =>({...prev, passwordError : "Please fill Password"}));
        }else{
            
            setSuccessMessage("Successfully logged in! Welcome back.");
        }
        fetch(`${APIURL}/auth/login`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(loginData)
        }).then(res => res.json())
        .then(data => {
            if(data.success){
                setSuccessMessage("Successfully logged in! Welcome back.");
            }else{
                setSuccessMessage("");
                if(data.errors){
                    setloginError(prev =>({...prev, ...data.errors}));
                }
            }
        })
        .catch(err => {
            console.error("Login error:", err);
        });
    })
    }

    return(
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              
              <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  BookStore
                </h1>
          
                <h2 className="text-xl text-center text-gray-600 mt-2">
                  Welcome Back
                </h2>
          
                <p className="text-sm text-center text-gray-500 mb-6">
                  Sign in to Your Account
                </p>
          
                <form onSubmit={onSubmitLogin} className="space-y-4">
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={onChangeLogin}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {loginError.emailError && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginError.emailError}
                      </p>
                    )}
                  </div>
          
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={onChangeLogin}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {loginError.passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginError.passwordError}
                      </p>
                    )}
                  </div>
          
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                   {isPending ? "Please wait..." : "Login"}</button>
          
                  {successMessage && (
                    <p className="text-green-600 text-sm text-center mt-2">
                      {successMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>
    );
}
export default LoginPage;