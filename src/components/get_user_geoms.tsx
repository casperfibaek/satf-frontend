import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { getValueForKey, getApiUrl } from '../utils';
import {
    Text, Icon, SearchBox, initializeIcons, PrimaryButton,
  } from '@fluentui/react';
import geojsonToArray from './map/geojson_to_array'
import { addCellsToSheet } from '../excel_interaction'

function ParseGeometries(responseJSON) {
  const header = ['layername', 'latitude', 'longitude']
  let cells = [header]
  const { results } = responseJSON
  results.forEach(row=>{
    const row_array = []
    const { geom, layer_id, layer_name, geom_id  } = row
    const [lat, lng] = JSON.parse(geom).coordinates
    cells.push([layer_name, lat, lng])
  })
  console.log(cells)
  return cells
}
  
function LayerList({props}) {
  const {layerMetadata, fetchLayerGeometries} = props

  console.log(props)
  return (
    layerMetadata.length > 0 ?
    layerMetadata.map((layer, idx ) => (
      <div key={idx} className="function_card">
        <Text variant="large" block>A layer in the Database</Text>
        <Text variant="medium">{layer.layer_id}</Text>
        <Text variant="medium">{layer.count}</Text>
        <Text variant="small">created on 00:00:00}</Text>
        <Text variant="small">last edited on 00:00:00</Text>
        <PrimaryButton onClick={() => fetchLayerGeometries(layer.layer_id)}>Fetch Geometries</PrimaryButton>
      </div>
      ))
    :
      <Text variant="large" block>No layers to display</Text>

  )}

export default function GetUserGeoms(): any {
  
  // const [geometries, setGeometries] = useState({});
  const [currentLayerID, setCurrentLayerID] = useState(null);
  const [layerMetadata, setLayerMetadata] =  useState([])
  const [stateToken, setStateToken] = useState('no user')

  const fetchLayerGeometries = async (layer) => {
    try {
      const token = getValueForKey('satf_token')
      const userName = token.split(':')[0] 
      console.log(userName, layer)
      const apiResponse = await fetch(`${getApiUrl()}/get_layer_geoms/${userName}/${layer}`, {
        method: 'get',
        headers: {
          //  Authorisation: token, 
            'Content-Type': 'application/json',
          },
        });
        if (apiResponse.ok) {
          // send repsonse to excel
          const responseJSON = await apiResponse.json()
          const cells = ParseGeometries(responseJSON)
          await addCellsToSheet(cells);

          ///preserve layer ID as current layer for future reference
          setCurrentLayerID(layer)
        }      
    }
     catch (error) {
      console.log(error);
    }
  }
    useEffect(()=>{
      const fetchMetadata = async (token) => {
        try {
            const userName = token.split(':')[0]    
    
             const apiResponse = await fetch(`${getApiUrl()}/get_user_layer_metadata/${userName}`, {
               method: 'get',
               headers: {
                  //  Authorisation: token, 
                   'Content-Type': 'application/json',
                 },
             });
             const responseJSON = await apiResponse.json()
             setLayerMetadata(responseJSON.results)
    
           }
           catch (err) {
             console.log(err)
         }
        }
      console.log('rerender')
      fetchMetadata(stateToken)

    },[stateToken])

    useEffect(() => {
        const tokenInterval = setInterval(() => {
        const currentToken = getValueForKey('satf_token')
        console.log(`
        currentToken: ${currentToken}
        stateToken: ${stateToken}
        `)
        if (currentToken !== stateToken) {
          setStateToken(currentToken)
        }
      }, 3000);
  
      return () => {
        clearInterval(tokenInterval);
      };
    }, [stateToken]);
    
    const greetingStyles = { 
      root: { 
        color: '#FFFFFF'
      }
    } 

    return (
      <div id="documentation_body">
        <div className="container">
          <div className="header">
            <div className="greet_text">
              <Icon iconName="TextDocument"/>
              <Text styles={greetingStyles} variant="xLarge">{stateToken}</Text>
            </div>
          </div>
        </div>
        <div className="card_holder">
        {stateToken && <LayerList props={{layerMetadata, fetchLayerGeometries}}/>}  
        </div>
      </div>
    )}
  
  initializeIcons();
  
  