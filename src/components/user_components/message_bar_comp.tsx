import React from 'react'; // eslint-disable-line
import {
 MessageBar, 
} from '@fluentui/react';



export default function MessageBarComp(props: any) {
    const hideMessageBar = () => {
      props.setDisplayMessage({ show: false, text: '', type: 1 });
    };
  
    if (props.displayMessageShow) {
      return (
        <MessageBar
          messageBarType={props.displayMessageType}
          isMultiline={false}
          onDismiss={hideMessageBar}
          dismissButtonAriaLabel="Close">
          <span>{props.displayMessageText}</span>
        </MessageBar>
      );
    }
    return (<div className="messagebar-placeholder"></div>);
  }