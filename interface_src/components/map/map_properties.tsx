import React, { useState } from 'react'; // eslint-disable-line
import {
  Callout, DefaultButton, Text, TextField, DirectionalHint, FontIcon,
} from '@fluentui/react';

export default function Properties(props:any) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [, refreshState] = useState();

  function propertiesChanged(key, value) {
    const layer = props.propertiesDialog.clicked;
    layer.options.properties[key] = value;
    refreshState({}); // Force refresh component
  }

  function closePropertiesDialog() {
    props.setPropertiesDialog({ hidden: true, position: {}, clicked: null });
  }

  function onDeleteProp(key:string) {
    const layer = props.propertiesDialog.clicked;
    delete layer.options.properties[key];
    refreshState({}); // Force refresh component
  }

  function addNewProperty() {
    const layer = props.propertiesDialog.clicked;
    layer.options.properties[newKey] = newValue;
    setNewKey('');
    setNewValue('');
    refreshState({}); // Force refresh component
  }

  return (
    <Callout
      title={'Properties'}
      role="alertdialog"
      gapSpace={0}
      hidden={props.propertiesDialog.hidden}
      target={props.propertiesDialog.position}
      directionalHint={DirectionalHint.bottomCenter}
      onDismiss={() => { closePropertiesDialog(); } }
    >
      {
      <table className="properties-table">
        {props.propertiesDialog.clicked && Object.entries(props.propertiesDialog.clicked.options.properties).map((e) => (
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
      }
      <div className="prop-footer">
      <DefaultButton onClick={() => { closePropertiesDialog(); } } text="Close" />
      </div>
    </Callout>
  );
}
