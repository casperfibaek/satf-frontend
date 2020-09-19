import Spinner from './spinner.js';

const { React, FluentUIReact } = window; // eslint-disable-line

export default function LoginPage(props) {
  return (
     <div>
         <FluentUIReact.Text variant="large" block id="login_text">
            Login User
         </FluentUIReact.Text>
         <form>
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
            <Spinner loading={props.loading} loadingMessage={props.loadingMessage}/>
            <FluentUIReact.DefaultButton text="Register" onClick={() => { props.onRegister(); }} allowDisabledFocus />
            <FluentUIReact.PrimaryButton text="Login" onClick={(e) => { props.onLogin(e); }} allowDisabledFocus />
         </div>
      </div >
  );
}
