const SignupPage = () =>{
    return(
        <div>
        <h1>Book Store</h1>
        <h2>Create Account</h2>
        <p>Join Our BookStore Community</p>
        <form>
            <input type="text"  placeholder="UserName" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" id="confirmPassword" placeholder="Confirm Password" />
            <button type ="submit">SignUp</button>
        </form>
        </div>
    );
}

export default SignupPage;