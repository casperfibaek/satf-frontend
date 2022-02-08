import React, { useState } from 'react'; // eslint-disable-line
import { getApiUrl } from '../../utils';
import {
    Text, PrimaryButton, TextField, DefaultButton,
  } from '@fluentui/react';

export default function NewLayerContainer({props}) {
    const { fetchMetadata, stateToken } = props
  
    const [creatingNewLayer, setCreatingNewLayer] =  useState(false)
    const [layerText, setLayerText] = useState('')
  
    async function onRegisterLayer() {
      try {
  
        const response = await fetch(`${getApiUrl()}/create_layer?username=${stateToken.split(':')[0]}&layername=${layerText}`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const responseJSON = await response.json();
        console.log(responseJSON)
        if (response.ok) {
          fetchMetadata(stateToken)
          setCreatingNewLayer(false)
          setLayerText('')
        } else if (responseJSON.message) {
        } else {
      }
    } catch (err) {
      console.log(err);
    } 
  }
    
    function onInitiateLayerCreation() {
      setCreatingNewLayer(true)
    }
  
    function onCancelLayerCreation() {
      setCreatingNewLayer(false)
      setLayerText('')
  
    }
  
    return (
      <div id='create-new-layer-container'>
      { creatingNewLayer ? 
        <div >
        <TextField
        label="Layername"
        htmlFor="layername"
        type="text"
        placeholder="Enter Layername"
        name="layername"
        autoComplete="layername"
        value={layerText}
        onChange={(e) => { setLayerText((e.target as HTMLTextAreaElement).value); console.log(layerText) }}
        required
        ></TextField>
        {/* <DefaultButton text="Register" onClick={() => { if (!loadingStatus.show) { onRegisterPage(); } } } allowDisabledFocus /> */}
        <DefaultButton text="Register" onClick={onRegisterLayer} allowDisabledFocus>Register Layer</DefaultButton>
        <DefaultButton text="Cancel" onClick={onCancelLayerCreation} allowDisabledFocus>Cancel</DefaultButton>
        </div>
        
        :
        <div>
        <Text variant="small" block></Text>
        <PrimaryButton className="fetchButton" onClick={onInitiateLayerCreation}>Create New Layer</PrimaryButton>
        </div>}
    </div>
  
    )
    
  }
