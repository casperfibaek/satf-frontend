import React, { useState } from 'react'; // eslint-disable-line
import {
  Callout, DefaultButton, Text, TextField, DirectionalHint, FontIcon, PrimaryButton,
} from '@fluentui/react';

export default function Properties(props:any) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [, refreshState] = useState();

  function propertiesChanged(key:string, value:any) {
    const { marker } = props.statusDialogProperties.current;
    marker.options.properties[key] = value;
    refreshState({}); // Force refresh component
  }

  function onDeleteProp(key:string) {
    const { featureGroup } = props.statusDialogProperties.current;
    featureGroup.eachLayer((layer:any) => {
      delete layer.options.properties[key]; // eslint-disable-line
    });
    refreshState({}); // Force refresh component
  }

  function addNewProperty() {
    if (newKey === 'Key' || newKey.length === 0) {
      return;
    }
    const { featureGroup, marker } = props.statusDialogProperties.current;
    featureGroup.eachLayer((_marker:any) => {
      _marker.options.properties[newKey] = null; // eslint-disable-line
    });
    marker.options.properties[newKey] = newValue;
    setNewKey('');
    setNewValue('');
    refreshState({}); // Force refresh component
  }

  function onDeleteMarker() {
    const { featureGroup, marker } = props.statusDialogProperties.current;
    marker.removeFrom(featureGroup);
    marker.remove();
    props.statusDialogProperties.close();
  }

  return (
    <Callout
      title={'Properties'}
      role="alertdialog"
      gapSpace={0}
      hidden={props.statusDialogProperties.current.hidden}
      target={props.statusDialogProperties.current.position}
      directionalHint={DirectionalHint.bottomCenter}
      onDismiss={() => { props.statusDialogProperties.close(); } }
    >
      <table className="properties-table">
        {props.statusDialogProperties.current.marker && Object.entries(props.statusDialogProperties.current.marker.options.properties).map((e) => (
          <tr>
            <Text variant="medium">{e[0]}</Text>
            <TextField defaultValue={e[1]} onChange={(event, value) => { propertiesChanged(e[0], value); }} />
            <div className="layer-delete" onClick={() => { onDeleteProp(e[0]); }}><FontIcon iconName="Delete" /></div>
          </tr>))
        }
        <tr>
          <TextField placeholder='Key' value={newKey} defaultValue='Key' onChange={(event, value) => { setNewKey(value); }} className="layer-prop-key"/>
          <TextField placeholder='Value' value={newValue} defaultValue='Value' onChange={(event, value) => { setNewValue(value); }}/>
          <div className="layer-prop-add" onClick={() => { addNewProperty(); }}><FontIcon className="layer-add-property" iconName="Add" /></div>
        </tr>
      </table>
      <div className="prop-footer">
        <DefaultButton onClick={() => { onDeleteMarker(); } }>
          <span>Delete Point  <FontIcon iconName="Delete" /></span>
        </DefaultButton>
        <PrimaryButton onClick={() => { props.statusDialogProperties.close(); } } text="Close" />
      </div>
    </Callout>
  );
}
