import Spinner from './spinner.js';

const { React, FluentUIReact } = window;

export default function RegisterPage(props) {
  return (
    <div id="page_register">
        <FluentUIReact.Text variant="large" block id="register_text">
          Register User
        </FluentUIReact.Text>
      <form>
        <FluentUIReact.TextField
          label="Username"
          htmlFor="username"
          type="text"
          placeholder="Enter Username"
          name="registerUsername"
          onChange={(e) => { props.onInput(e); }}
          value={props.registerUsername}
          required
        ></FluentUIReact.TextField>

        <FluentUIReact.TextField
          label="Password"
          htmlFor="password"
          type="password"
          placeholder="Enter Password"
          name="registerPassword"
          onChange={(e) => { props.onInput(e); }}
          value={props.registerPassword}
          required
        ></FluentUIReact.TextField>

        <FluentUIReact.TextField
          label="Password"
          htmlFor="password"
          type="password"
          placeholder="Confirm Password"
          name="registerConfirm"
          onChange={(e) => { props.onInput(e); }}
          value={props.registerConfirm}
          required
        ></FluentUIReact.TextField>

        <div id="register_buttons">
          <FluentUIReact.DefaultButton
            text="Back"
            onClick={() => { props.onBack(); }}
            allowDisabledFocus
          />
          <FluentUIReact.PrimaryButton
            text="Register User"
            onClick={(e) => { props.onCreate(e); }}
            allowDisabledFocus
          />
         </div>
      </form>
    </div>
  );
}
