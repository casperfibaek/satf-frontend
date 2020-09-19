const { React, FluentUIReact } = window; // eslint-disable-line

export default function MessageBar(props) {
  if (props.displayMessage) {
    return (
      <FluentUIReact.MessageBar
      messageBarType={props.displayMessageType}
      isMultiline={false}
      dismissButtonAriaLabel="Close"
      id="login_messagebar"
    >
      <span>{props.displayMessageText}</span>
    </FluentUIReact.MessageBar>
    );
  }
  return (null);
}
