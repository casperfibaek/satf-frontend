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
