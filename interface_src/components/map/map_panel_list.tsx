import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, Panel, DefaultButton, FontIcon, DialogFooter, Dialog, DialogType, Toggle, Text,
} from '@fluentui/react';

export default function LayerList(props:any) {
  const [deleteAlert, setDeleteAlert] = useState({ hidden: true });
  const [layerToDelete, setLayerToDelete] = useState({ key: 0, name: '' });

  function onLayerToggle(key:number) {
    props.toggleLayer(key);
  }

  function onEdit(key:number) {
    props.setSelectedLayer(key);
    props.setStyleDialog({ hidden: false, key });
  }

  function onDelete(key:number) {
    setLayerToDelete({ key, name: window.mapLayers.filter((e:any) => e.key === key)[0].name });
    setDeleteAlert({ hidden: false });
  }

  function deleteLayer() {
    props.removeLayer(layerToDelete.key);
    setLayerToDelete({ key: 0, name: '' });
    setDeleteAlert({ hidden: true });
  }

  const layers = [];
  for (let i = 0; i < window.mapLayers.length; i += 1) {
    const { style } = window.mapLayers.filter((e:any) => e.key === window.mapLayers[i].key)[0];

    layers.push(
      <div className="layer-item" key={window.mapLayers[i].key}>
        <Toggle defaultChecked onChange={() => { onLayerToggle(window.mapLayers[i].key); }} />
        <div className="style-box" onClick={() => { onEdit(window.mapLayers[i].key); }} style={{ backgroundColor: style.fillColor, border: `1px solid ${style.edgeColor}` }}></div>
        <div className="layer-name"><Text variant="medium">{window.mapLayers[i].name}</Text></div>
        <div className="editables">
          <div className="layer-edit" onClick={() => { onEdit(window.mapLayers[i].key); }}><FontIcon iconName="EditSolidMirrored12" /></div>
          <div className="layer-delete" onClick={() => { onDelete(window.mapLayers[i].key); }}><FontIcon iconName="Delete" /></div>
        </div>
      </div>,
    );
  }

  return (
    <div>
      <Dialog
      hidden={deleteAlert.hidden}
      onDismiss={() => { setDeleteAlert({ hidden: true }); }}
      dialogContentProps={{
        type: DialogType.normal,
        title: `Delete ${layerToDelete.name}?`,
        closeButtonAriaLabel: 'Close',
        subText: 'Do you really want to delete this layer? The action is irreversible.',
      }}
    >
      <DialogFooter>
        <DefaultButton onClick={() => { setDeleteAlert({ hidden: true }); }} text="Back" />
        <PrimaryButton onClick={() => { deleteLayer(); }} text="Delete" />
      </DialogFooter>
    </Dialog>
      <div className="layer-list">{layers}</div>
    </div>
  );
}
