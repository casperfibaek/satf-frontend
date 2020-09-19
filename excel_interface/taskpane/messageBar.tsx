const { React, FluentUIReact } = window; // eslint-disable-line

export default function MessageBar(props) {
  if (props.displayMessage) {
    return (
      <div id="login_messagebar">
        <FluentUIReact.MessageBar
          messageBarType={props.displayMessageType}
          isMultiline={false}
          dismissButtonAriaLabel="Close">
          <span>{props.displayMessageText}</span>
        </FluentUIReact.MessageBar>
      </div>
    );
  }
  return (null);
}
