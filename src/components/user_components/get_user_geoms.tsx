import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { getValueForKey, getApiUrl, setValueForKey, removeValueForKey } from '../../utils';
import {
    Text, initializeIcons, PrimaryButton, DefaultButton, Persona, PersonaSize, Dialog, DialogType, DialogFooter
  } from '@fluentui/react';
import SpinnerComp from './spinner_comp';

import capitalize from './capitalize';
import arrayToGeojson from '../map/array_to_geojson'
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useHistory } from "react-router-dom"

import LayerList from './layer_list';
import NewLayerContainer from './new_layer_container';


export default function GetUserGeoms(): any {
  
  const [layerMetadata, setLayerMetadata] =  useState([])
  const [modalStatus, setModalStatus] = useState({hidden: true, title: '', subText:''});
  const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
  const [stateToken, setStateToken] = useState('')
 
  const history = useHistory();

  function handleToLogin() {
    history.push("/login");
  }

  const defaultModal = (status) => {
    setModalStatus({...modalStatus, hidden: true })
     setTimeout(() => {
       setModalStatus({hidden: true, title: '', subText: ''})
     }, 700);
   }

  const fetchLayerGeometries = async (layerId, layerName: string) => {
    try {
      const username = stateToken.split(':')[0]
      const url = `${getApiUrl()}get_layer_geoms?username=${username}&layer_id=${layerId}`
      const apiResponse = await fetch(url, {
        method: 'get',
        headers: {
          //  Authorisation: stateToken, 
            'Content-Type': 'application/json',
          },
        });
         if (apiResponse.ok) {
          const responseJSON = await apiResponse.json()
          const cells = [['layername', 'lat', 'lng']]

          responseJSON.results.features.forEach(result=>{
            const { geometry: { coordinates: [ lat, lng ] } , properties: { geom_id } } = result

            cells.push([layerName, lat, lng])

          })
          setValueForKey('layerData', JSON.stringify(cells))
         }          
    }
     catch (error) {
      console.log(error);
    }
  }

  const fetchMetadata = async () => {
    try {
        const username = stateToken.split(':')[0]    
        const url = `${getApiUrl()}get_user_layer_metadata?username=${username}`
        const response = await fetch(url, {
           method: 'get',
           headers: {
              //  Authorisation: token, 
               'Content-Type': 'application/json',
             },
         });
         
         if (response.ok) {   
           const responseJSON = await response.json()
           setLayerMetadata(responseJSON.results)
      }
       }
       catch (err) {
         console.log(err)
     }
    }

  const onDeleteLayer = async (layerId: Number) => {
    console.log(layerId)
    setLoadingStatus({ show: true, text: 'Delete..' });
    const url = `${getApiUrl()}/delete_layer?layerId=${layerId}`
    try {
      const response = await fetch(url, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        //  Authorisation: stateToken, 
      });

      const responseJSON = await response.json();

      if (response.ok) {
        console.log('everything ok, layer deleted')
    }
  }
  catch (err) {
      console.log(err)
    }
  finally {
    defaultModal(modalStatus)
    setLoadingStatus({ show: false, text: '' });
    await fetchMetadata()
  }
  }

  const getCellsFromExcel = async (username:string, layerId:string) => {
    setValueForKey('data_request', 'true')
    
    const intervalId = setInterval(async ()=>{
      const layerData = getValueForKey('data_to_dialogue')
      if (layerData) {
        const cells = JSON.parse(layerData)
        clearInterval(intervalId)
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
      finally {
        fetchMetadata()
      }
      }
    },500)
  }
  
  useEffect(()=>{
      if (stateToken) {
        fetchMetadata()
      }  
    },[stateToken])


// useEffect that looks for changes to the global token cookie, and sets that to log in the user
  useEffect(() => {
      const tokenInterval = setInterval(() => {
      const globalToken = getValueForKey('satf_token')
      if (globalToken !== stateToken) {
        setStateToken(globalToken)
      }
    }, 500);

    return () => {
      clearInterval(tokenInterval);
    };
  }, [stateToken]);
      
    return (
      <div id='geoms-body'>
        <div id='geoms-header'>
          <Persona text={capitalize(stateToken.split(':')[0])} size={PersonaSize.size48} secondaryText='NIRAS A/S' initialsColor="#217346" />
          <DefaultButton className="to_login_button" onClick={handleToLogin}>to Login page</DefaultButton>
        </div>
        <LayerList props={{defaultModal, fetchMetadata, loadingStatus, setLoadingStatus, modalStatus, setModalStatus, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel, onDeleteLayer}}/>
        {/* <NewLayerContainer props={{fetchMetadata, stateToken}}/> */}
      </div>
    )}
  
  initializeIcons();
  
