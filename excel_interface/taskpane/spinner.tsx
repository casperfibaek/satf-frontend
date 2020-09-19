const { React, FluentUIReact } = window;

export default function Spinner(props) {
  if (props.loading) {
    return (
    <div id="login_spinner">
      <FluentUIReact.Spinner label={props.loadingMessage} ariaLive="assertive" labelPosition="left" />
    </div>
    );
  }
  return (null);
}
