import { FeatureGroup } from 'leaflet';

export interface WindowState extends Window {
  state: any;
  sharedState: {
    initialised: {
      app: boolean,
      commands: boolean,
      customFunctions: boolean,
    }
    hello: Function,
  }
  map: any;
  openDialogNIRAS: Function,
  openDialogOPM: Function,
  openDialogSATF: Function,
  openDialogMAP: Function,
  openDialogSUPPORT: Function,
  openDialogDOCUMENTATION: Function,
}

export interface GeoJsonGeometry {
  type: string,
  coordinates: number[],
}

export interface GeoJsonFeature {
  type: string,
  properties: object,
  geometry: GeoJsonGeometry,
}

export interface GeoJsonFeatureCollection {
  type: string,
  features: GeoJsonFeature[],
}

export interface Style {
  fillColor: string,
  edgeColor: string,
  fillOpacity: number,
  edgeOpacity: number,
  weight: number,
  radius: number,
}

export interface MapLayer {
  name: string,
  key: number,
  featureGroup: FeatureGroup,
  hidden: boolean,
  style: Style,
}
