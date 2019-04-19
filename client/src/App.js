import React, { Component } from 'react';
import './App.css';

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
    }

    onLogin(e) {
        console.log("Login")
        this.makeCredential()
    }

    makeCredential() {
        var challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        var userID = this.state.email;
        var id = Uint8Array.from(window.atob(userID), c => c.charCodeAt(0))

        var publicKey = {
            'challenge': challenge,

            'rp': {
                'name': 'Example Inc.'
            },

            'user': {
                'id': id,
                'name': this.state.email,
                'displayName': 'John Doe'
            },

            'pubKeyCredParams': [
                { 'type': 'public-key', 'alg': -7 },
                { 'type': 'public-key', 'alg': -257 }
            ]
        }

        navigator.credentials.create({ 'publicKey': publicKey })
            .then((newCredentialInfo) => {
                console.log('SUCCESS', newCredentialInfo)
            })
            .catch((error) => {
                console.log('FAIL', error)
            })
    }

    render() {
        return (
            <div className="App">
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
