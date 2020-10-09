import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, Dialog, DialogFooter, TextField,
} from '@fluentui/react';

export default function CreateLayer(props:any) {
  function dismissCreateDialog() {
    props.setCreateDialog({ name: '', hidden: true });
  }

  function updateName(value:string) {
    props.setCreateDialog({ hidden: false, name: value });
  }

  function onCreateLayer() {
    let unique = true;
    for (let i = 0; i < props.layers.length; i += 1) {
      if (props.createDialog.name === props.layers[i].name) {
        unique = false;
        break;
      }
    }

    if (props.createDialog.name.length >= 3 && props.createDialog.name.length <= 20 && unique) {
      const key = props.getLayerKey();
      props.addLayer({ key, name: props.createDialog.name });
      dismissCreateDialog();
    }
  }

  function onEnter(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') { onCreateLayer(); }
  }

  return (
    <Dialog
      title={'Create New Layer'}
      hidden={props.createDialog.hidden}
      onDismiss={() => { dismissCreateDialog(); }}
    >
      <TextField
        label="Name: "
        required
        onChange={ (event, value) => { updateName(value); } }
        defaultValue={''}
        placeholder={''}
        onKeyPress={onEnter}
      />
      <DialogFooter>
        <DefaultButton onClick={() => { dismissCreateDialog(); }}>Close</DefaultButton>
        <PrimaryButton onClick={() => { onCreateLayer(); }} text="Create Layer" />
      </DialogFooter>
    </Dialog>
  );
}
