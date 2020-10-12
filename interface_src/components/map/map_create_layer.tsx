import React, { useState } from 'react'; // eslint-disable-line
import L from 'leaflet';
import {
  PrimaryButton, DefaultButton, Dialog, DialogFooter, TextField,
} from '@fluentui/react';
import { isLayernameUnique, createNewMapLayer } from './map_layer_control';

export default function CreateLayer(props:any) {
  const [newLayername, setNewLayername] = useState('Default');

  function onCreateLayer() {
    if (newLayername.length >= 3 && newLayername.length <= 20 && isLayernameUnique(newLayername)) {
      const mapLayer = createNewMapLayer(newLayername);

      mapLayer.featureGroup.on('click', (event:any) => {
        props.statusDialogProperties.open({
          hidden: false, position: event.originalEvent, clicked: event.layer, featureGroup: mapLayer,
        });
        L.DomEvent.preventDefault(event);
        L.DomEvent.stopPropagation(event);
      });

      props.statusDialogCreate.close();
    }
  }

  function onEnter(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') { onCreateLayer(); }
  }

  return (
    <Dialog
      title={'Create New Layer'}
      hidden={props.createDialog.hidden}
      onDismiss={() => { props.statusDialogCreate.close(); }}
    >
      <TextField
        label="Name: "
        required
        onChange={ (event, value) => { setNewLayername(value); } }
        defaultValue={''}
        placeholder={''}
        onKeyPress={onEnter}
      />
      <DialogFooter>
        <DefaultButton onClick={() => { props.statusDialogCreate.close(); }}>Close</DefaultButton>
        <PrimaryButton onClick={() => { onCreateLayer(); }} text="Create Layer" />
      </DialogFooter>
    </Dialog>
  );
}
