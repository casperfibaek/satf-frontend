import React from 'react'; // eslint-disable-line
import {
   Spinner,
} from '@fluentui/react';


// C

export default function SpinnerComp(props: any) {
    if (props.loading) {
      return (
        <Spinner
          label={props.loadingMessage}
          ariaLive="assertive"
          labelPosition="left"
        />
      );
    }
    return (<div className="spinner_dummy"></div>);
  }