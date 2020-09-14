import React from 'react';


export class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          firstName: '',
          email: '',
          password: '',
          confirmPassword: '',
          page: 1, // 0 -> login, 1 -> register
        };
      this.url = props.url;
      this.refresh = props.refresh;
    }

    handleChange(event, field) {
      this.setState({[field]: event.target.value});
    }

    handleLogin(event) {
      event.preventDefault();

      fetch(this.url + "/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: this.state.email, password: this.state.password}),
        })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('authToken', data.token);
        this.refresh();
      }).catch(err => {
          console.log(err);
      });
    }

    handleRegister(event) {
        event.preventDefault();

        fetch(this.url + "/register", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              firstName: this.state.firstName,
              email: this.state.email,
              password: this.state.password,
              confirmPassword: this.state.confirmPassword}),
          })
        .then(response => response.json())
        .then(data => {
          if (data.msg) {
            console.log("error");
          } else {
            localStorage.setItem('authToken', data.token);
            this.refresh();
          }
        });
      }

    renderLogin() {
        return (
            <form onSubmit={(e) => this.handleLogin(e)}>
                <h2 style={{color: "white"}}>Sign in</h2>
                <div className="p-2">
                    <input type="text" placeholder="email" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')} /> 
                </div>
                <div className="p-2">
                    <input type="password" placeholder="password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} />
                </div>
                <div className="p-2">
                    <input type="submit" value="Submit" />
                </div>
                <div class="mt-5">
                    <button type="button" class="btn btn-link" onClick={() => this.handleChange({target:{value: 1}}, 'page')}>I don't have an account</button>
                </div>
            </form>
        );
    }

    renderRegister() {
        return (
            <form onSubmit={(e) => this.handleRegister(e)}>
                <h2 style={{color: "white"}}>Sign up</h2>
                <div className="p-2">
                    <input type="text" placeholder="First name" value={this.state.firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                </div>

                <div className="p-2">
                    <input type="email" placeholder="Enter email" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')}/>
                </div>

                <div className="p-2">
                    <input type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                </div>

                <div className="p-2">
                    <input type="password" placeholder="Re-enter your password here" value={this.state.confirmPassword} onChange={(e) => this.handleChange(e, 'confirmPassword')}/>
                </div>

                <div className="p-2">
                    <input type="submit" value="Submit" />
                </div>
                <div class="mt-5">
                    <button type="button" class="btn btn-link" onClick={() => this.handleChange({target:{value: 0}}, 'page')}>I've already signed up</button>
                </div>
            </form>
        );
    }

    render() {
      if (this.state.page === 0) {
          return this.renderLogin();
      } else {
          return this.renderRegister();
      }
    }
}
