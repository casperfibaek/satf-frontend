import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown, MessageBarType,
} from '@fluentui/react';

import {  WindowState } from '../../types';

// import { logToServer } from '../../utils';

declare let window: WindowState;

export default function TopBar(props:any) {
  const { state } = window;
  function flyToGhana() {
    state.maplayers.base.s2_2020.addTo(state.leafletMap);
    state.leafletMap.flyTo([7.955811115092113, -1.0050627119953766], 7)
    state.maplayers.base.esri.remove(state.leafletMap);
  }
  function flyToTanzania() {
    state.maplayers.base.esri.addTo(state.leafletMap);
    state.leafletMap.flyTo([-6.063, 34.811], 6)
    state.maplayers.base.s2_2020.remove(state.leafletMap);
  }
  return (
    <div id="map-top-bar">
      <DefaultButton text="To Tanzania" onClick={flyToTanzania} />
      <DefaultButton text="To Ghana" onClick={flyToGhana} />      
    </div>
  );
}
