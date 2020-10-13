import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, Panel, DefaultButton, FontIcon, PanelType, DialogFooter, Dialog, DialogType,
} from '@fluentui/react';
import LayerList from './map_panel_list';
import { clearLayers, getFirstLayerKey } from './map_layers';

export default function MapPanel(props:any) {
  const [deleteAlert, setDeleteAlert] = useState({ hidden: true });

  const statusDeleteAlert = {
    open: () => setDeleteAlert({ hidden: false }),
    close: () => setDeleteAlert({ hidden: true }),
  };

  function deletelayers() {
    clearLayers();
    props.setSelectedLayer(getFirstLayerKey);
    statusDeleteAlert.close();
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
          <DefaultButton onClick={() => { statusDeleteAlert.close(); }} text="Back" />
          <PrimaryButton onClick={() => { deletelayers(); }} text="Delete" />
        </DialogFooter>
      </Dialog>
      <Panel
        headerText="Layer control"
        isBlocking={false}
        onDismiss={() => { props.statusPanel.close(); } }
        type={PanelType.customNear}
        customWidth='320px'
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isOpen={!props.statusPanel.current.hidden}
      >
        <LayerList
          className="layer-list"
          selectedLayer={props.selectedLayer}
          setSelectedLayer={props.setSelectedLayer}
        />
          <PrimaryButton text="Create layer" className="createButton" onClick={() => { props.statusDialogCreate.open(); }} />
        <div className="panel-footer">
          <DefaultButton onClick={() => { props.statusPanel.close(); }}>Close</DefaultButton>
          <DefaultButton text="Delete all layers" className="deleteButton" onClick={() => { statusDeleteAlert.open(); }} />
        </div>
      </Panel>
        <DefaultButton className="navbutton" onClick={() => { props.statusPanel.open(); }} allowDisabledFocus>
          <FontIcon iconName="GlobalNavButton" className="icon"/>
        </DefaultButton>
    </div>
  );
}
