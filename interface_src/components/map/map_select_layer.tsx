import React from 'react'; // eslint-disable-line
import {
  PrimaryButton, Callout, DirectionalHint, Dropdown, DefaultButton,
} from '@fluentui/react';
import { getLayerCount, addMarkerToLayer } from './map_layers';

interface WindowState extends Window { state: any; }
declare let window: WindowState;

export default function SelectLayer(props:any) {
  const { state } = window;

  function onAdd() {
    addMarkerToLayer(props.selectedLayer);
    props.statusCalloutSelect.close();
  }

  return (
    <Callout
      role="alertdialog"
      gapSpace={0}
      target={state.click.position}
      hidden={props.statusCalloutSelect.current.hidden}
      onDismiss={() => { props.statusCalloutSelect.close(); } }
      setInitialFocus
      directionalHint={DirectionalHint.bottomCenter}
    >
      <Dropdown
        placeholder="Create new layer"
        label="Add point to layer"
        defaultSelectedKey={state.layers.length === 0 ? -1 : props.selectedLayer}
        options={state.layers.map((e:any) => ({ text: e.name, key: e.key }))}
        onChange={(event, value) => { props.setSelectedLayer(value.key); }}
        required
      />
      <PrimaryButton className="add-point-to-layer" onClick={() => { onAdd(); }} text={(getLayerCount() === 0) ? 'Create' : 'Add'} />
      <DefaultButton className="add-point-to-layer-back" onClick={() => { props.statusCalloutSelect.close(); }}>Close</DefaultButton>
    </Callout>
  );
}
