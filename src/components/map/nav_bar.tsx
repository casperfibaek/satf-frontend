
import React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { IButtonStyles , Layer , Text ,FontWeights,Panel, PrimaryButton } from '@fluentui/react';

const NavBar = () => {  

  const iconStyles: IButtonStyles = {
    root: {
      color: 'blue',
      fontSize: 16,
      fontWeight: FontWeights.regular,
      
    },
  };
 
  return(
      <div>
    <Layer >
      <div style = {{backgroundColor:"whitesmoke"}}>
        <div style={{margin:"0 20px"}}>
        <PrimaryButton > 
          Geometries
        </PrimaryButton>
        <PrimaryButton > 
          Map
        </PrimaryButton>
        <div style = {{float:"right"}}>
      </div>
      </div>
      </div>
      
        
    </Layer>
    </div>
    );
    
    
     
}

export default NavBar;