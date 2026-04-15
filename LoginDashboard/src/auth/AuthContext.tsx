import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type AuthState, type User, type LoginCredentials, type SignupCredentials } from "../types";


interface AuthContextType extends AuthState{
    login : (credentials: LoginCredentials) => Promise<void>;
    signup : (credentials: SignupCredentials) => Promise<void>;
    logout : () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "bookstore_users"; // stored registered users
const TOKEN_KEY = "token";

//store user datatype in localStorage

interface StoredUser{
    id: string;
    name: string;
    email: string;
    password: string;
}

//Get all registered users from localStorage 

const getStoredUsers = () : StoredUser[] =>{
    const data =  localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

//Save users to LocalStorage 
const saveUsers = (users : StoredUser[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

//fakeJWT token generator 
const fakeJWT = (user: User): string =>{
  const header = btoa(JSON.stringify({ alg:"HS256", typ : "JWT"}));
  const payload = btoa(JSON.stringify({...user,exp:Date.now() + 3600000}));
  return `${header}.${payload}.fake-signature`;
}

//Decode Token

const decodeToken = (token : string): User | null =>{
    try{
      const payload = JSON.parse(atob(token.split(".")[1]));
      if(payload.exp < Date.now()) return null;
      return{
        id:payload.id, 
        email:payload.email, 
        name:payload.name
    };
    }catch{
      return null;
    }
};

export const AuthProvider = ({children}:{children:ReactNode}) =>{
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated : false,
    });

// check token on mount
useEffect(()=>{
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
        const user = decodeToken(token);
        if(user){
            setAuthState({ user, token, isAuthenticated : true});
        }else{
            localStorage.removeItem(TOKEN_KEY);
        }
    }
},[]);
// Signup Stores user data in localStorage 
const signup =  async (credentials : SignupCredentials) : Promise<void> => {
    const users = getStoredUsers();

    // check if email already exists
    const existingUser = users.find((u) => u.email === credentials.email);
    if(existingUser){
        throw new Error("Email already registered");
    }

    // Create new user and store in localStorage
    const newUser :  StoredUser ={
        id: Date.now().toString(),
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
    };
    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const user = {id:newUser.id,name:newUser.name,email:newUser.email};
    const token = fakeJWT(user);
    localStorage.setItem(TOKEN_KEY,token);
    setAuthState({user,token,isAuthenticated: true});
};
//Login checks credentials against stored users and generates token
const login = async (credentials : LoginCredentials) : Promise<void> =>{
    const users = getStoredUsers();
    // find user by email
    const foundUser = users.find((u)=>u.email === credentials.email);
    if(!foundUser){
        throw new Error("No account found with this email. Please sign up first.");
    }

    // check password
    if(foundUser.password !== credentials.password){
        throw new Error("Incorrect password. Please try again.")
    }

    //Generate token and update auth state 
    const user = {id:foundUser.id,name:foundUser.name,email:foundUser.email};
    const token = fakeJWT(user);
    localStorage.setItem(TOKEN_KEY,token);;
    setAuthState({user,token,isAuthenticated:true});
};

//Logout  
const logout =() =>{
    localStorage.removeItem(TOKEN_KEY);
    setAuthState({user:null, token:null,isAuthenticated:false});
};
return(
    <AuthContext.Provider value={{...authState,login,signup,logout}}>{children}</AuthContext.Provider>
)
};
export const useAuth = ():AuthContextType =>{
    console.log(AuthContext);
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}