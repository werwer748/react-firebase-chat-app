import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, child } from "firebase/database";

// import app from '../../firebase';

function LoginPage() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState("")
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const auth = getAuth();
      let createdUser = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('createdUser', createdUser);
      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  }
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center' }}>
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
        name="email"
        type="email"
        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해주세요!</p>}

        <label>Password</label>
        <input
        name="password"
        type="password"
        {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && <p>비밀번호를 입력해주세요!</p>}
        {errors.password && errors.password.type === "minLength" && <p>비밀번호는 6자리 이상 입력하셔야 합니다.</p>}

        {errorFromSubmit &&
        <p>{errorFromSubmit}</p>
        }

        <input type="submit" disabled={loading} />
      <Link style={{ color: 'gray', textDecoration: 'none' }} to="/register">아직 아이디가 없다면... </Link>
      </form>
    </div>
  );
}

export default LoginPage;