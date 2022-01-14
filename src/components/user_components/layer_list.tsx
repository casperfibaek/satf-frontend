import React, {useState, useEffect} from 'react'; // eslint-disable-line
import SpinnerComp from './spinner_comp';
import { getApiUrl } from '../../utils';
import {
    Text, TextField, PrimaryButton, DefaultButton, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, MarqueeSelection, Dialog, DialogFooter, DialogType
  } from '@fluentui/react';
  
  
const columns = [
     {
          key: 'column1',
          name: 'Name',
          fieldName: 'name',
          minWidth: 50,
          maxWidth: 70,
          isResizable: true,
          data: 'string',
          onRender: (item) => {
            return <span>{item.name}</span>;
          },
          isPadded: true,

        },
        {
          key: 'column2',
          name: 'Layer ID',
          fieldName: 'layerId',
          minWidth: 30,
          maxWidth: 50,
          isResizable: true,
          data: 'string',
          onRender: (item) => {
            return <span>{item.layerId}</span>;
          },
          isPadded: true,
        },
        {
          key: 'column3',
          name: '# Geometries',
          fieldName: 'geometryCount',
          minWidth: 30,
          maxWidth: 50,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
          onRender: (item) => {
            return <span>{item.geometryCount}</span>;
          },
          isPadded: true,
        },
        {
          key: 'column4',
          name: 'Created On',
          fieldName: 'createdOn',
          minWidth: 90,
          maxWidth: 100,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
          onRender: (item) => {
            return <span>{item.createdOn}</span>;
          },
          isPadded: true,
        },
        {
          key: 'column5',
          name: 'Last Updated',
          fieldName: 'lastUpdated',
          minWidth: 90,
          maxWidth: 100,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
          onRender: (item) => {
            return <span>{item.lastUpdated}</span>;
          },
          isPadded: true,
        },
      ];
  
export default function LayerList({props}) {

  const { defaultModal, fetchMetadata, loadingStatus, setLoadingStatus, modalStatus, setModalStatus, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel, onDeleteLayer } = props
  const [registerFieldText, setRegisterFieldText] = useState('')
  const [items, setItems] = useState([{
    'name': ' ',
    'layerId': ' ',
    'geometryCount': ' ',
    'createdOn': ' ',
    'lastUpdated': ' ',
  }])
  const [selectedItems, setSelectedItems] = useState({})

  useEffect(()=>{
    layerMetadata.length &&  setItems(
     layerMetadata.map((l) => ({
        'name': l.name,
        'layerId': l.layer_id,
        'geometryCount': l.count,
        'createdOn': l.created_on,
        'lastUpdated': l.last_updated,
      }
      )))      

  }, [layerMetadata])

  const selection = new Selection({ 
    onSelectionChanged: () => {
      setSelectedItems(selection.getSelection()[0])
    } 
  })


  async function onRegisterLayer() {
    try {

      const response = await fetch(`${getApiUrl()}/create_layer?username=${stateToken.split(':')[0]}&layername=${registerFieldText}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const responseJSON = await response.json();
      console.log(responseJSON)
      if (response.ok) {
        fetchMetadata(stateToken)
      } 
    } catch (err) {
      console.log(err);
    }
    finally {
    setRegisterFieldText('')
    setModalStatus({hidden: true, title: '', subText: ''})

  }
}
  
  const handleFetchLayer = () => {
    if (selectedItems) {
      const { layerId, name } = selectedItems
      fetchLayerGeometries(layerId, name)
    }
  }
  const handleGetFromExcel = () => {
    if (selectedItems) {
    const { layerId } = selectedItems
    const user = stateToken.split(':')[0]
    getCellsFromExcel(user, layerId)
    }
  }
  const handleDeleteLayer = () => {
    if (selectedItems) {
      const { layerId } = selectedItems
      onDeleteLayer(layerId)
    }
  }

  const handleYes = () => {
    console.log(modalStatus)
    switch (modalStatus.title) {
      case 'Delete Layer':
        handleDeleteLayer()
        break;
      
      case 'Create Layer':
        onRegisterLayer()
        break;
    }
    defaultModal(modalStatus)

  }

  const handleNo = () => {
    defaultModal(modalStatus)
  }

  const dangerStyle = {
    root: {
      backgroundColor: '#800020',
      color: '#fff',
    }        
  }
  const registerStyle = {
    root: {
      backgroundColor: '#fff',
      color: '#000',
    }        
  }

  
  
  const deleteSettings = 
    {
      hidden:false, 
      title: 'Delete Layer',
      subText: 'Are you sure you want to Delete Layer? This is not reversible'
    }
  
  const createSettings = {
    
      hidden:false, 
      title: 'Create Layer',
      subText: ''
    
  }

  return (
    <div id='layer-list'>
      <div id='details-list-container'>
        <DetailsList
                items={items}
                compact={true}
                columns={columns}
                selection={selection}
                selectionMode={SelectionMode.single}
                selectionPreservedOnEmptyClick={false} 
                setKey="exampleList"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                />
      </div>
      <div id='layer-buttons-container'>
        <PrimaryButton className="fetchButton" onClick={() => selectedItems.layerId && handleFetchLayer()}>Send to Excel</PrimaryButton>
        <PrimaryButton className="fetchButton" onClick={handleGetFromExcel}>Add Points to Layer</PrimaryButton>
        <DefaultButton  styles={dangerStyle}className="fetchButton" onClick={() => selectedItems.layerId && setModalStatus(deleteSettings)}>Delete Layer</DefaultButton>
        <DefaultButton  styles={registerStyle}className="fetchButton" onClick={() => setModalStatus(createSettings)}>Create Layer</DefaultButton>
      </div>
        <Dialog
        hidden={modalStatus.hidden}
        dialogContentProps={{
        type: DialogType.normal,
        title: modalStatus.title,
        subText: modalStatus.subText,
        }}
        modalProps={{ isBlocking: false }}
        >
          {modalStatus.title == 'Create Layer' && 
                <TextField
            label="Layername"
            htmlFor="layername"
            type="text"
            placeholder="Enter Layername"
            name="layername"
            autoComplete="layername"
            value={registerFieldText}
            onChange={(e) => { setRegisterFieldText((e.target as HTMLTextAreaElement).value); console.log(registerFieldText) }}
            required
            ></TextField>
          
          }
        <DialogFooter>
          <PrimaryButton text="Yes" onClick={handleYes} />
          <DefaultButton text="No" onClick={handleNo} />
        </DialogFooter>
        </Dialog>
      </div>
      )
    }
    
    
    
        
        // const _getSelectionDetails = (): string => {
          //   const selectionCount = items._selection.getSelectedCount();
          
          //   switch (selectionCount) {
            //     case 0:
            //       return 'No items selected';
            //     case 1:
            //       return '1 item selected: ' + (items._selection.getSelection()[0] as IDetailsListBasicExampleItem).name;
            //     default:
            //       return `${selectionCount} items selected`;
            //   }
            // }
          
          
          // this.state = { 
          //   items: items, 
          //   selectionDetails: this._getSelectionDetails() 
          // }; 
      
          // const state = {
          //   selectedOption: null,
          // } 
          // handleChange = (selectedOption) => {
          //   this.setState({ selectedOption });
          //   console.log(`Option selected:`, selectedOption);
          // }
          // render(){
          //   const { selectedOption } = this.state;
          
          // const classNames = mergeStyleSets({
          //   table: {
          //     margin: 'auto'
          //   }
          // })
          //   items.state = {
          //     items: items,
          //     selectionDetails: items._getSelectionDetails(),
          // };