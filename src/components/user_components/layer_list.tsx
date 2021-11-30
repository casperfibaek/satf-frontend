import React from 'react'; // eslint-disable-line
import SpinnerComp from './spinner_comp';
import {
    Text, PrimaryButton
  } from '@fluentui/react';

export default function LayerList({props}) {
  const { updatingGeometries, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel } = props

  console.log(props)
  return (
    layerMetadata.length > 0 ?
    layerMetadata.map((layer, idx ) => {

      const {name, layer_id, count, created_on, last_updated} = layer

      return (
        <div key={idx} className="function_card">
        <Text variant="large" block>{name.toUpperCase()} id:{layer_id}</Text>
        <Text variant="medium" block>Geometry Count: {count}</Text>
        <Text variant="small" block>created on: {created_on}</Text>
        <Text variant="small" block>last updated: {last_updated}</Text>
        <PrimaryButton className="fetchButton" onClick={() => fetchLayerGeometries(layer_id, name)}>Fetch Geometries</PrimaryButton>
        {updatingGeometries ?
        // <SpinnerComp loading={true }loadingMessage={'updating geometries'}/>
        <Text variant="large" block>Loading</Text>

        :
        <PrimaryButton className="fetchButton" onClick={() => getCellsFromExcel(stateToken.split(':')[0], layer_id)}>Save Geometries</PrimaryButton>
        }
        </div>
    )
    }
    )
    :
      <Text variant="large" block>No layers to display</Text>

  )}