"use client"

import React, {useState} from 'react'
import {useRouter} from "next/navigation"

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState("")

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();

        // contoh simulasi login
        if(email === "admin@example.com" && password === "123456"){
            router.push("/dashboard"); //redirect to dashboard
        } else {
            alert("Email atau password salah")
        }
    }
    return (
        <section className="section">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                        <div className="login-brand">
                            <img src="/assets/img/stisla-fill.svg" alt="logo" width={100} className="shadow-light rounded-circle" />
                        </div>

                        <div className="card card-primary">
                        <div className="card-header"><h4>Login Admin</h4></div>

                            <div className="card-body">
                                <form 
                                    onSubmit={handleSubmit}
                                    className="needs-validation" 
                                    noValidate
                                >
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            id="email" 
                                            type="email" 
                                            className="form-control" 
                                            name="email"
                                            required 
                                            autoFocus
                                            value={email}
                                            onChange={(e) =>setEmail(e.target.value)}
                                        />
                                        <div className="invalid-feedback">
                                            Please fill in your email
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="d-block">
                                            <label htmlFor="password" className="control-label">Password</label>
                                            <div className="float-right">
                                                <a href="auth-forgot-password.html" className="text-small">
                                                Forgot Password?
                                                </a>
                                            </div>
                                        </div>
                                        <input 
                                            id="password" 
                                            type="password"
                                            className="form-control"
                                            name="password" 
                                            required 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <div className="invalid-feedback">
                                            please fill in your password
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox">
                                        <input 
                                            type="checkbox"
                                            name="remember"
                                            className="custom-control-input"
                                            checked={remember} 
                                            onChange={(e) => setRemember(e.target.checked)} 
                                            id="remember-me"
                                        />
                                        <label className="custom-control-label" htmlFor="remember-me">Remember Me</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                                        Login
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                        <div className="mt-5 text-muted text-center">
                            Don't have an account? <a href="/auth/register">Create One</a>
                        </div>
                        <div className="simple-footer">
                        Copyright &copy; Stisla 2018
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
