import React from "react";
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from "../firebase";
import {useDispatch} from 'react-redux';
import { signInSuccess } from "../redux/user/userSlice";
import {useNavigate} from 'react-router-dom';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/dashboard');
      console.log(result);
    } catch (error) {
      console.log("Could not login with Google", error);
    }
  }
  return (
    <div>
      <button type="button" onClick={handleGoogleClick} className="bg-[#fff] p-2 mx-2 rounded-md flex items-center">
        <FcGoogle className="mr-2" />
        Continue with Google
      </button>
    </div>
  );
};

export default OAuth;
