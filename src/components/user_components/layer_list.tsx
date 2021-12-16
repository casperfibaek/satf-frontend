import React, {useState, useEffect} from 'react'; // eslint-disable-line
import SpinnerComp from './spinner_comp';
import {
    Text, PrimaryButton, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, MarqueeSelection
  } from '@fluentui/react';

// function old_LayerList({props}) {
//   const { updatingGeometries, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel } = props

//   console.log(props)
//   return (
//     layerMetadata.length > 0 ?
//     layerMetadata.map((layer, idx ) => {

//       const {name, layer_id, count, created_on, last_updated} = layer

//       return (
//         <div key={idx} className="function_card">
//         <Text variant="large" block>{name.toUpperCase()} id:{layer_id}</Text>
//         <Text variant="medium" block>Geometry Count: {count}</Text>
//         <Text variant="small" block>created on: {created_on}</Text>
//         <Text variant="small" block>last updated: {last_updated}</Text>
//         <PrimaryButton className="fetchButton" onClick={() => fetchLayerGeometries(layer_id, name)}>Fetch Geometries</PrimaryButton>
//         {updatingGeometries ?
//         // <SpinnerComp loading={true }loadingMessage={'updating geometries'}/>
//         <Text variant="large" block>Loading</Text>

//         :
//         <PrimaryButton className="fetchButton" onClick={() => getCellsFromExcel(stateToken.split(':')[0], layer_id)}>Save Geometries</PrimaryButton>
//         }
//         </div>
//     )
//     }
//     )
//     :
//       <Text variant="large" block>No layers to display</Text>

//   )}


export default function LayerList({props}) {

  const { updatingGeometries, stateToken, layerMetadata, fetchLayerGeometries, getCellsFromExcel, onDeleteLayer } = props
  const items = layerMetadata.map((l) => ({
      'name': l.name,
      'layerId': l.layer_id,
      'geometryCount': l.count,
      'createdOn': l.created_on,
      'lastUpdated': l.last_updated,
        }
  ))
  const [selectedItems, setSelectedItems] = useState<Object | undefined>(undefined)

  const selection = new Selection({ 
    onSelectionChanged: () => {
      setSelectedItems(selection.getSelection()[0])
    } 
  })

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
    useEffect(() => {
    // Do something with the selected item
      console.log(selectedItems)
    }, [selectedItems])

    if (layerMetadata.length > 0) { 
        return (
          <div>
            <DetailsList
                    items={items}
                    compact={false}
                    columns={columns}
                    selection={selection}
                    selectionMode={SelectionMode.multiple}
                    selectionPreservedOnEmptyClick={true} 
                    // getKey={this._getKey}
                    setKey="exampleList"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    // onChange={this.handleChange}
                    // onItemInvoked={this._onItemInvoked}
                  />

            <PrimaryButton className="fetchButton" onClick={() => fetchLayerGeometries(selectedItems['layerId'],selectedItems['name'] )}>Fetch Geometries</PrimaryButton>
          {updatingGeometries ?
              // <SpinnerComp loading={true }loadingMessage={'updating geometries'}/>
            <Text variant="large" block>Loading</Text>
          : <div>
            <PrimaryButton className="fetchButton" onClick={() => getCellsFromExcel(stateToken.split(':')[0], selectedItems['layerId'])}>Save Geometries</PrimaryButton>
            <PrimaryButton className="fetchButton" onClick={() => onDeleteLayer(stateToken, selectedItems['layerId'])}>Delete Geometries</PrimaryButton>
            </div>
          }
          </div>
        )
    }
    
    else {
      return(
      <Text variant="large" block>No layers to display</Text>
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
}
