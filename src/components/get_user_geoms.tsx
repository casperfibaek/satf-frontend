import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { getValueForKey, getApiUrl, setValueForKey, removeValueForKey } from '../utils';
import {
    Text, Icon, SearchBox, initializeIcons, PrimaryButton, FontIcon
  } from '@fluentui/react';
import geojsonToArray from './map/geojson_to_array'
import arrayToGeojson from './map/array_to_geojson'
import { addCellsToSheet } from '../excel_interaction'
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useHistory } from "react-router-dom"
  
function LayerList({props}) {
  const {layerMetadata, fetchLayerGeometries, getCellsFromExcel} = props

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
        <PrimaryButton className="fetchButton" onClick={getCellsFromExcel}>Save Geometries</PrimaryButton>
      </div>
    )
    }
    )
    :
      <Text variant="large" block>No layers to display</Text>

  )}


export default function GetUserGeoms(): any {
  
  // const [geometries, setGeometries] = useState({});
  const [currentLayerID, setCurrentLayerID] = useState(null);
  const [layerMetadata, setLayerMetadata] =  useState([])
  const [stateToken, setStateToken] = useState('Login to access data')

  const fetchLayerGeometries = async (layerID, layerName) => {
    try {
      const token = getValueForKey('satf_token')
      const userName = token.split(':')[0]
      const url = `${getApiUrl()}get_layer_geoms?user=${userName}?layer_id=${layerID}`
      const apiResponse = await fetch(url, {
        method: 'get',
        headers: {
          //  Authorisation: token, 
            'Content-Type': 'application/json',
          },
        });
         if (apiResponse.ok) {
          const responseJSON = await apiResponse.json()

          const cells = responseJSON.results.features.map(result=>{
            const { geometry: { coordinates: [ lat, lng ] } , properties: { geom_id } } = result

            return [layerName, geom_id, lat, lng]

          })
          cells.unshift(['layername', 'geom_id', 'lat', 'lng'])
          setValueForKey('layerData', JSON.stringify(cells))
          setCurrentLayerID(layerID)
         }          
    }
     catch (error) {
      console.log(error);
    }
  }

  const getCellsFromExcel = async () => {
    setValueForKey('data_request', 'true')
   
    const intervalID = setInterval(async ()=>{
      const layerData = getValueForKey('data_to_dialogue')
      if (layerData) {
        const cells = JSON.parse(layerData)
        clearInterval(intervalID)
        try {
          const geoJSON = arrayToGeojson(cells)
          /// turn cells to geojson
          console.log(geoJSON)
          const response = await fetch(`${getApiUrl()}/update_layer_data`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geoJSON),
          });
    
          const responseJSON = await response.json();
    
          if (response.ok) {
            console.log('values in the database have been updated')
            removeValueForKey('data_to_dialogue')
            setValueForKey('data_request', 'false')
        }
      }
      catch (err) {
          console.log(err)
          setValueForKey('data_request', 'error')
        }
      }
    },500)
  }

    useEffect(()=>{
      const fetchMetadata = async (token) => {
        try {
            const userName = token.split(':')[0]    
            const url = `${getApiUrl()}get_user_layer_metadata?user=${userName}`
            const apiResponse = await fetch(url, {
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
        const globalToken = getValueForKey('satf_token')
        if (globalToken !== stateToken) {
          setStateToken(globalToken)
        }
      }, 1000);
  
      return () => {
        clearInterval(tokenInterval);
      };
    }, [stateToken]);
    
    const greetingStyles = { 
      root: { 
        color: '#FFFFFF'
      }
    } 

    const iconClass = mergeStyles({
      fontSize: 50,
      height: 50,
      width: 50,
      margin: '0 25px',
    });
    const classNames = mergeStyleSets({
      deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
    });
    
    const history = useHistory();

    function handleToLogin() {
      history.push("/login");
    }

    return (
      <div id="documentation_body">
        <div className="container">
          <div className="header">
            <div className="greet_text">
              <FontIcon aria-label="Compass" iconName="CompassNW" className={classNames.deepSkyBlue} />
              <Text block styles={greetingStyles} variant="xLarge">{stateToken.split(':')[0].toUpperCase()}</Text>
              <PrimaryButton className="to_login_button" onClick={handleToLogin}>to Login page</PrimaryButton>
            </div>
          </div>
        </div>
        <div className="card_holder">
        {stateToken && <LayerList props={{layerMetadata, fetchLayerGeometries, getCellsFromExcel}}/>}
        </div>
      </div>
    )}
  
  initializeIcons();
  
