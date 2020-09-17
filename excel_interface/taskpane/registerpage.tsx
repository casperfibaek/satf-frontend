const { React, FluentUIReact } = window;

export default function RegisterPage(props) {
   // const { registerUsername, registerPassword, registerConfirm } = this.props

   return (
      <div>
         <div>
            <form>
               <label htmlFor="username">
                  <b>Username</b>
               </label>

               <input
                  type="text"
                  placeholder="Enter Username"
                  name="registerUsername"
                  onChange={(e) => { props.onInput(e) }}
                  value={props.registerUsername}
                  required
               ></input>

               <label htmlFor="password">
                  <b>Password</b>
               </label>

               <input
                  type="password"
                  placeholder="Enter Password"
                  name="registerPassword"
                  onChange={(e) => { props.onInput(e) }}
                  value={props.registerPassword}
                  required
               ></input>
               <input
                  type="password"
                  placeholder="Confirm Password"
                  name="registerConfirm"
                  onChange={(e) => { props.onInput(e) }}
                  value={props.registerConfirm}
                  required
               ></input>
               <button type="submit" onClick={(e) => { props.onCreate(e) }}>
                  Register User
          </button>
               <button type="submit" onClick={() => { props.onBack() }}>
                  Back to Login
          </button>
            </form>
            <h1>{props.registerUsername}</h1>
            <h1>{props.registerPassword}</h1>
            <h1>{props.registerConfirm}</h1>
            {/* <h1><a onClick={this.registerUser}></a></h1> */}
         </div>

      </div>
   )
}
