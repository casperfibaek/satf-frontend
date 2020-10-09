import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, Panel, DefaultButton, FontIcon, PanelType, DialogFooter, Dialog, DialogType,
} from '@fluentui/react';
import CreateLayer from './map_create_layer';
import Styler from './map_styler';
import LayerList from './map_panel_list';

export default function MapPanel(props:any) {
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
    props.setCreateDialog({ ...props.createDialog, hidden: false });
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
        updateStyle={props.updateStyle}
        changeLayername={props.changeLayername}
      />
      <CreateLayer
        createDialog={props.createDialog}
        setCreateDialog={props.setCreateDialog}
        addLayer={props.addLayer}
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
          toggleLayer={props.toggleLayer}
          removeLayer={props.removeLayer}
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
