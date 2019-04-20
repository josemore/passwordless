import React, { Component } from 'react';
import './App.css';
import { makeCredential, storeCredential, getAssertion, getCredential } from './lib/creds.mgmt';

class App extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onRegister = this.onRegister.bind(this)
        this.onLogin = this.onLogin.bind(this)
    }

    state = {
        email: ""
    }

    componentWillMount() {

    }

    handleInputChange(e) {
        this.setState({ email: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("Submit");
    }

    onRegister(e) {
        alert("Registration completed. Please login");
        makeCredential()
    }

    onLogin(e) {
        console.log("Login")
        getAssertion()
    }

    render() {
        return (
            <div className="App" >
                <header className="App-header">
                    <p>Password-less Auth Demo</p>
                </header>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Email:</label>
                        <input type="text" name="email" onChange={this.handleInputChange} />
                        <button type="submit" onClick={this.onRegister}>Register</button>
                        <button type="button" onClick={this.onLogin}>Login</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
