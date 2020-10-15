import { FeatureGroup, Map } from 'leaflet';

export interface ApiReply {
  status: string;
  message: any;
  function: string;
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

export interface WindowState extends Window {
  state: {
    layers: MapLayer[],
    click: { position: MouseEvent, latlng: [number, number]},
    warningTimer: number,
    leafletMap: Map,
  }
  openDialogNIRAS: Function,
  openDialogOPM: Function,
  openDialogSATF: Function,
  openDialogMAP: Function,
  openDialogSUPPORT: Function,
  openDialogDOCUMENTATION: Function,
}
