import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import app from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, child } from "firebase/database";

function RegisterPage() {
  const { register, watch, formState: { errors }, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState("")
  const [loading, setLoading] = useState(false);
  const password = useRef();

  password.current = watch("password");

  const onSubmit = async (data) => {
    try {
      app();
      const auth = getAuth();
      let createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('createdUser', createdUser);

      // await updateProfile(auth.currentUser, {
      //   displayName: data.name,
      
      //   photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
      // });

      // //Firebase 데이터베이스에 저장
      // const database = getDatabase();
      // set(child(ref(database, "users"), createdUser.user.uid), {
      //   name: createdUser.user.displayName,
      //   image: createdUser.user.photoURL,
      // })
    } catch (error) {
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  }
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center' }}>
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
        name="email"
        type="email"
        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해주세요!</p>}
      
        <label>Name</label>
        <input
        name="name"
        {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && <p>이름을 입력해주세요!</p>}
        {errors.name && errors.name.type === "maxLength" && <p>이름은 10자 이하로 입력 가능합니다.</p>}



        <label>Password</label>
        <input
        name="password"
        type="password"
        {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && <p>비밀번호를 입력해주세요!</p>}
        {errors.password && errors.password.type === "minLength" && <p>비밀번호는 6자리 이상 입력하셔야 합니다.</p>}



        <label>Password Confirm</label>
        <input
        name="password_confirm"
        type="password"
        {...register("password_confirm", {
        required: true,
        validate: (value) =>
        value === password.current
        })}
        />
        {errors.password_confirm && errors.password_confirm.type === "required" && <p>비밀번호 확인을 입력해주세요!</p>}
        {errors.password_confirm && errors.password_confirm.type === "validate" && <p>비밀번호가 일치하지 않습니다.</p>}

        {errorFromSubmit &&
        <p>{errorFromSubmit}</p>
        }

        <input type="submit" disabled={loading} />
      <Link style={{ color: 'gray', textDecoration: 'none' }} to="login">이미 아이디가 있다면... </Link>
      </form>
    </div>
  );
}

export default RegisterPage