import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, FontIcon, DialogFooter, Dialog, DialogType, Toggle, Text,
} from '@fluentui/react';
import Styler from './map_styler';
import {
  toggleLayer, getFirstLayerKey, removeLayer, getLayer, getLayerCount,
} from './map_layers';

import { WindowState } from '../../types';

declare let window: WindowState;

export default function LayerList(props:any) {
  const { state } = window;

  const [dialogStyle, setDialogStyle] = useState({ hidden: true });
  const [deleteAlert, setDeleteAlert] = useState({ hidden: true });

  const statusDeleteAlert = {
    open: () => setDeleteAlert({ hidden: false }),
    close: () => setDeleteAlert({ hidden: true }),
    current: deleteAlert,
  };

  const statusDialogStyle = {
    open: () => setDialogStyle({ hidden: false }),
    close: () => setDialogStyle({ hidden: true }),
    current: dialogStyle,
  };

  function onEdit(key:number) {
    props.setSelectedLayer(key);
    statusDialogStyle.open();
  }

  function onDelete(key:number) {
    props.setSelectedLayer(key);
    statusDeleteAlert.open();
  }

  function deleteLayer() {
    removeLayer(props.selectedLayer);
    props.setSelectedLayer(getFirstLayerKey());
    statusDeleteAlert.close();
  }

  const layers = [];
  for (let i = 0; i < state.layers.length; i += 1) {
    const { style, key, name } = state.layers[i];

    layers.push(
      <div className="layer-item" key={key}>
        <Toggle defaultChecked onChange={() => { toggleLayer(key); }} />
        <div className="style-box" onClick={() => { onEdit(key); }} style={{ backgroundColor: style.fillColor, border: `1px solid ${style.edgeColor}` }}></div>
        <div className="layer-name"><Text variant="medium">{name}</Text></div>
        <div className="editables">
          <div className="layer-edit" onClick={() => { onEdit(key); }}><FontIcon iconName="EditSolidMirrored12" /></div>
          <div className="layer-delete" onClick={() => { onDelete(key); }}><FontIcon iconName="Delete" /></div>
        </div>
      </div>,
    );
  }

  return (
    <div>
      <Styler
        statusDialogStyle={statusDialogStyle}
        selectedLayer={props.selectedLayer}
      />
      <Dialog
      hidden={statusDeleteAlert.current.hidden}
      onDismiss={() => { statusDeleteAlert.close(); }}
      dialogContentProps={{
        type: DialogType.normal,
        title: `Delete ${getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layer'}?`,
        closeButtonAriaLabel: 'Close',
        subText: 'Do you really want to delete this layer? The action is irreversible.',
      }}
    >
      <DialogFooter>
        <DefaultButton onClick={() => { statusDeleteAlert.close(); }} text="Back" />
        <PrimaryButton onClick={() => { deleteLayer(); }} text="Delete" />
      </DialogFooter>
    </Dialog>
      <div className="layer-list">{layers}</div>
    </div>
  );
}
