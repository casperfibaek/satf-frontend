import Spinner from './spinner.js';

const { React, FluentUIReact } = window;

export default function WelcomePage(props) {
  return (
    <div id="page_welcome">
      <FluentUIReact.Text variant="xLarge" block id="welcome_header">
        Welcome {props.username}
      </FluentUIReact.Text>

      <FluentUIReact.Text variant="medium" block id="welcome_text">
        You are now successfully logged in and able to use the Savings at the Frontier custom functions and mapping functionality.
      </FluentUIReact.Text>

      <div id="welcome_buttons">
        <FluentUIReact.DefaultButton
          text="Logout"
          onClick={() => { props.onLogout(); }}
          allowDisabledFocus
        />
        <FluentUIReact.PrimaryButton
          text="Delete User"
          onClick={() => { props.onDelete(); }}
          allowDisabledFocus
        />
      </div>
    </div>
  );
}
