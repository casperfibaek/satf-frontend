import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { getValueForKey, getApiUrl, setValueForKey, removeValueForKey } from '../../utils';
import {
    Text, initializeIcons, PrimaryButton, FontIcon,
  } from '@fluentui/react';
import arrayToGeojson from '../map/array_to_geojson'
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useHistory } from "react-router-dom"

import LayerList from './layer_list';
import NewLayerContainer from './new_layer_container';


export default function GetUserGeoms(): any {
  
  const [updatingGeometries, setUpdatingGeometries] = useState(false)
  const [layerMetadata, setLayerMetadata] =  useState([])
  const [stateToken, setStateToken] = useState('Login to access data')
 
  const history = useHistory();

  function handleToLogin() {
    history.push("/login");
  }


  const fetchLayerGeometries = async (layerID, layerName: string) => {
    try {
      const token = getValueForKey('satf_token')
      const userName = token.split(':')[0]
      const url = `${getApiUrl()}get_layer_geoms?username=${userName}?layer_id=${layerID}`
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
         }          
    }
     catch (error) {
      console.log(error);
    }
  }

  const fetchMetadata = async (token:string) => {
    try {
        const userName = token.split(':')[0]    
        const url = `${getApiUrl()}get_user_layer_metadata?username=${userName}`
        const apiResponse = await fetch(url, {
           method: 'get',
           headers: {
              //  Authorisation: token, 
               'Content-Type': 'application/json',
             },
         });
         const responseJSON = await apiResponse.json()
         console.log(getApiUrl())
         console.log(responseJSON)
         setLayerMetadata(responseJSON.results)

       }
       catch (err) {
         console.log(err)
     }
    }

  

  const getCellsFromExcel = async (username:string, layerId:string) => {
    setValueForKey('data_request', 'true')
    setUpdatingGeometries(true)
    const intervalID = setInterval(async ()=>{
      const layerData = getValueForKey('data_to_dialogue')
      if (layerData) {
        const cells = JSON.parse(layerData)
        clearInterval(intervalID)
        try {
          const featureCollection = await arrayToGeojson(cells)
          const response = await fetch(`${getApiUrl()}/update_layer_data?username=${username}&layerId=${layerId}`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({featureCollection}),
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
    setUpdatingGeometries(false)
  }
  
  useEffect(()=>{
      console.log('useEffectFires')
      fetchMetadata(stateToken)
    },[stateToken, updatingGeometries])

  useEffect(() => {
      console.log('useEffectFires')
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
 
    return (
      <div id="documentation_body">
        <div className="container">
          <div className="header">
            <div className="greet_text">
              <FontIcon aria-label="Compass" iconName="CompassNW" className={classNames.deepSkyBlue} />
              <Text block styles={greetingStyles} variant="xLarge">{stateToken.split(':')[0].toUpperCase()}</Text>
              <PrimaryButton className="to_login_button" onClick={handleToLogin}>to Login page</PrimaryButton>
              <PrimaryButton onClick={()=> fetchMetadata(stateToken)}>Refresh Layers</PrimaryButton>
            </div>
          </div>
        </div>
        <div className="card_holder">
        {stateToken && <LayerList props={{updatingGeometries, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel}}/>}
        <NewLayerContainer props={{fetchMetadata, stateToken}}/>
        </div>
      </div>
    )}
  
  initializeIcons();
  
