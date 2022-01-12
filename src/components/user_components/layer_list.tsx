import React, {useState, useEffect} from 'react'; // eslint-disable-line
import SpinnerComp from './spinner_comp';
import {
    Text, PrimaryButton, DefaultButton, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, MarqueeSelection, Dialog, DialogFooter, DialogType
  } from '@fluentui/react';
  
  
const columns = [
     {
          key: 'column1',
          name: 'Name',
          fieldName: 'name',
          minWidth: 90,
          maxWidth: 100,
          isResizable: true,
          // onColumnClick: this._onColumnClick,
          data: 'string',
          onRender: (item) => {
            return <span>{item.name}</span>;
          },
        },
        {
          key: 'column2',
          name: 'Layer ID',
          fieldName: 'layerId',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          // onColumnClick: this._onColumnClick,
          data: 'string',
          onRender: (item) => {
            return <span>{item.layerId}</span>;
          },
          isPadded: true,
        },
        {
          key: 'column3',
          name: 'Geometry Count',
          fieldName: 'geometryCount',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
          // onColumnClick: this._onColumnClick,
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
          // onColumnClick: this._onColumnClick,
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
          // onColumnClick: this._onColumnClick,
          onRender: (item) => {
            return <span>{item.lastUpdated}</span>;
          },
          isPadded: true,
        },
      ];
  
export default function LayerList({props}) {

  const { loadingStatus, setLoadingStatus, modalStatus, setModalStatus, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel, onDeleteLayer } = props
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
  const dangerStyle = {
    root: {
      backgroundColor: '#f00',
      color: '#fff',
    }        
  }

  return (
    <div>
        <DetailsList
                items={items}
                compact={false}
                columns={columns}
                selection={selection}
                selectionMode={SelectionMode.single}
                selectionPreservedOnEmptyClick={true} 
                setKey="exampleList"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                // getKey={this._getKey}
                // onChange={this.handleChange}
                // onItemInvoked={this._onItemInvoked}
                />

        <PrimaryButton className="fetchButton" onClick={handleFetchLayer}>Send to Excel</PrimaryButton>
        <PrimaryButton className="fetchButton" onClick={handleGetFromExcel}>Add Points to Layer</PrimaryButton>
        <DefaultButton  styles={dangerStyle}className="fetchButton" onClick={() => setModalStatus(false)}>Delete Layer</DefaultButton>
        <Dialog
        hidden={modalStatus}
        dialogContentProps={{
        type: DialogType.normal,
        title: 'Delete Layer',
        subText: 'Are you sure you want to delete this layer? This action cannot be undone.',
        }}
        modalProps={{ isBlocking: false }}
        >
        <DialogFooter>
          <SpinnerComp className="spinner" loading={loadingStatus.show} loadingMessage={loadingStatus.text}/>
          <PrimaryButton text="Yes" onClick={() => { if (!loadingStatus.show) { handleDeleteLayer(); } }} />
          <DefaultButton text="No" onClick={() => { if (!loadingStatus.show) { setModalStatus(true); } }} />
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