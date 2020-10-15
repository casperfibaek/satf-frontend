import React, { useState } from 'react'; // eslint-disable-line
import L from 'leaflet';
import {
  PrimaryButton, DefaultButton, Dialog, DialogFooter, TextField,
} from '@fluentui/react';
import { isLayernameUnique, createNewMapLayer } from './map_layers';
import { WindowState } from '../../types';

declare let window: WindowState;

export default function CreateLayer(props:any) {
  const { state } = window;

  const [newLayername, setNewLayername] = useState('Default');

  function onCreateLayer() {
    if (newLayername.length >= 3 && newLayername.length <= 20 && isLayernameUnique(newLayername)) {
      const mapLayer = createNewMapLayer(newLayername);
      props.setSelectedLayer(mapLayer.key);

      mapLayer.featureGroup.on('click', (event:any) => {
        props.statusDialogProperties.open(event.originalEvent, event.layer, mapLayer.featureGroup);
        L.DomEvent.preventDefault(event);
        L.DomEvent.stopPropagation(event);

        state.leafletMap.on('movestart', () => {
          props.statusDialogProperties.close();
          state.leafletMap.off('movestart');
        });
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
      hidden={props.statusDialogCreate.current.hidden}
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
