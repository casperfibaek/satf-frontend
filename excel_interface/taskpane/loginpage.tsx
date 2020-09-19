import Spinner from './spinner.js';

const { React, FluentUIReact } = window; // eslint-disable-line

export default function LoginPage(props) {
  return (
     <div id="page_login" >
         <FluentUIReact.Text variant="large" block id="login_text">
            Login User
         </FluentUIReact.Text>
         <form className="login_page_form">
            <FluentUIReact.TextField
               label="Username"
               htmlFor="username"
               type="text"
               placeholder="Enter Username"
               name="username"
               onChange={(e) => { props.onInput(e); }}
               value={props.username}
               required
            ></FluentUIReact.TextField>

            <FluentUIReact.TextField
               label="Password"
               htmlFor="password"
               type="password"
               placeholder="Enter Password"
               name="password"
               onChange={(e) => { props.onInput(e); }}
               value={props.password}
               required
            ></FluentUIReact.TextField>
         </form>
         <div id="login_buttons">
            <FluentUIReact.DefaultButton text="Register" onClick={() => { props.onRegister(); }} allowDisabledFocus />
            <FluentUIReact.PrimaryButton text="Login" onClick={(e) => { props.onLogin(e); }} allowDisabledFocus />
         </div>
      </div >
  );
}
