"use client"

import React, {useState} from 'react'
import {useRouter} from "next/navigation"

export default function LoginPage() {
    const router = useRouter();

    // state form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password){
            alert("Semua field wajib diisi")
            return
        }

        //simulasi kirim data ke backend
        console.log({name, email, password, role})

        //redirect ke login
        router.push("/auth/login")
    }
    return (
        <section className="section">
            <div className="container mt-5">
                <div className="row">
                <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
                    <div className="login-brand">
                    <img src="/assets/img/stisla-fill.svg" alt="logo" width={100} className="shadow-light rounded-circle" />
                    </div>

                    <div className="card card-primary">
                    <div className="card-header"><h4>Register</h4></div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="form-group col-6">
                                <label htmlFor="name">Name</label>
                                <input id="name" type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus required/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            <div className="invalid-feedback">
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-6">
                                <label htmlFor="password" className="d-block">Password</label>
                                <input id="password" type="password" className="form-control" data-indicator="pwindicator" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-lg btn-block">
                                Register
                            </button>
                        </div>
                        </form>
                    </div>
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
