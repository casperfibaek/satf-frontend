const { React, FluentUIReact } = window;

export default function LoginPage(props) {
  // const { username, password } = this.props
  // return (
  return (
      < div >
         <form>
            <label htmlFor="username">
               <b>Username</b>
            </label>

            <input
               type="text"
               placeholder="Enter Username"
               name="username"
               onChange={(e) => { props.onInput(e); }}
               value={props.username}
               required
            ></input>
            <label htmlFor="password">
               <b>Password</b>
            </label>

            <input
               type="password"
               placeholder="Enter Password"
               name="password"
               onChange={(e) => { props.onInput(e); }}
               value={props.password}
               required
            ></input>
            <button type="submit" onClick={(e) => { props.onLogin(e); }}>
               Login
          </button>
         </form>
         <div>
            <button onClick={() => { props.onRegister(); }}>Register User</button>
         </div>
         <h1>{props.username}</h1>
         <h1>{props.password}</h1>
         {/* <h1><a onClick={this.registerUser}></a></h1> */}
      </div >
  );
}
