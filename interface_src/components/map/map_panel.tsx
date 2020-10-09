import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, Panel, DefaultButton, FontIcon, PanelType, DialogFooter, Dialog, DialogType, Toggle, Text,
} from '@fluentui/react';
import CreateLayer from './map_create_layer';
import Styler from './map_styler';

function LayerList(props:any) {
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
    setLayerToDelete({ key, name: props.layers.filter((e:any) => e.key === key)[0].name });
    setDeleteAlert({ hidden: false });
  }

  function deleteLayer() {
    props.removeLayer(layerToDelete.key);
    setLayerToDelete({ key: 0, name: '' });
    setDeleteAlert({ hidden: true });
  }

  const layers = [];
  for (let i = 0; i < props.layers.length; i += 1) {
    const layerStyle = props.styles.filter((e:any) => e.key === props.layers[i].key)[0];
    layers.push(
      <div className="layer-item" key={props.layers[i].key}>
        <Toggle defaultChecked onChange={() => { onLayerToggle(props.layers[i].key); }} />
        <div className="style-box" onClick={() => { onEdit(props.layers[i].key); }} style={{ backgroundColor: layerStyle.fillColor, border: `1px solid ${layerStyle.edgeColor}` }}></div>
        <div className="layer-name"><Text variant="medium">{props.layers[i].name}</Text></div>
        <div className="editables">
          <div className="layer-edit" onClick={() => { onEdit(props.layers[i].key); }}><FontIcon iconName="EditSolidMirrored12" /></div>
          <div className="layer-delete" onClick={() => { onDelete(props.layers[i].key); }}><FontIcon iconName="Delete" /></div>
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

export default function MapPanel(props:any) {
  const [createDialog, setCreateDialog] = useState({ hidden: true, name: '' });
  const [styleDialog, setStyleDialog] = useState({ hidden: true });
  const [deleteAlert, setDeleteAlert] = useState({ hidden: true });
  const [selectedLayer, setSelectedLayer] = useState(0);

  function openPanel() {
    props.setPanel({ ...props.panel, hidden: false });
  }

  function dismissPanel() {
    props.setPanel({ ...props.panel, hidden: true });
  }

  function openCreateDialog() {
    setCreateDialog({ ...createDialog, hidden: false });
  }

  function onDeleteAll() {
    setDeleteAlert({ hidden: false });
  }

  function deletelayers() {
    props.clearLayers();
    setDeleteAlert({ hidden: true });
  }

  return (
    <div className="panel-nav">
      <Dialog
        hidden={deleteAlert.hidden}
        onDismiss={() => { setDeleteAlert({ hidden: true }); }}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete Confirmation',
          closeButtonAriaLabel: 'Close',
          subText: 'Do you really want to remove all layers? This action is irreversible.',
        }}
      >
        <DialogFooter>
          <DefaultButton onClick={() => { setDeleteAlert({ hidden: true }); }} text="Back" />
          <PrimaryButton onClick={() => { deletelayers(); }} text="Delete" />
        </DialogFooter>
      </Dialog>
      <Styler
        styleDialog={styleDialog}
        setStyleDialog={setStyleDialog}
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        layers={props.layers}
        styles={props.styles}
        setStyles={props.setStyles}
        updateStyle={props.updateStyle}
        changeLayername={props.changeLayername}
      />
      <CreateLayer
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
        getLayerKey={props.getLayerKey}
        addLayer={props.addLayer}
        layers={props.layers}
      />
      <Panel
        headerText="Layer control"
        isBlocking={false}
        onDismiss={() => { dismissPanel(); } }
        type={PanelType.customNear}
        customWidth='320px'
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isOpen={!props.panel.hidden}
      >
        <LayerList
          className="layer-list"
          styleDialog={styleDialog}
          setStyleDialog={setStyleDialog}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          layers={props.layers}
          toggleLayer={props.toggleLayer}
          removeLayer={props.removeLayer}
          styles={props.styles}
          setStyles={props.setStyles}
        />
          <PrimaryButton text="Create layer" className="createButton" onClick={() => { openCreateDialog(); }} />
        <div className="panel-footer">
          <DefaultButton onClick={() => { dismissPanel(); }}>Close</DefaultButton>
          <DefaultButton text="Delete all layers" className="deleteButton" onClick={() => { onDeleteAll(); }} />
        </div>
      </Panel>
        <DefaultButton className="navbutton" onClick={() => { openPanel(); }} allowDisabledFocus>
          <FontIcon iconName="GlobalNavButton" className="icon"/>
        </DefaultButton>
    </div>
  );
}
