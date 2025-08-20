import './App.css';
import React, { useState, forwardRef, memo } from 'react';
import {
  Map,
  Marker,
  MapCameraChangedEvent,
  ControlPosition,
  MapControl,
} from '@vis.gl/react-google-maps';

type Coord = {
  lat: number;
  lng: number;
  contextUpdator?: any;
  zoomLevel?: number;
};

const CustomMap = memo(
  forwardRef(
    (
      { lat, lng, contextUpdator, zoomLevel }: Coord,
      markerRef: React.Ref<any>
    ) => {
      const [markerLocation, setMarkerLocation] = useState({
        lat,
        lng,
      });

      return (
        <div className="map-container">
          <Map
            defaultZoom={zoomLevel}
            defaultCenter={markerLocation}
            onCameraChanged={(ev: MapCameraChangedEvent) => {
              contextUpdator({
                lat: (ev.detail.bounds.south + ev.detail.bounds.north) / 2,
                lng: (ev.detail.bounds.west + ev.detail.bounds.east) / 2,
              });
              setMarkerLocation(ev.detail.center);
            }}
            mapId="b1b1b1b1b1b1b1b1"
            gestureHandling={'greedy'}
            disableDefaultUI
          >
            <MapControl position={ControlPosition.BOTTOM_LEFT}>
              <Marker ref={markerRef as any} position={markerLocation} />
            </MapControl>
          </Map>
        </div>
      );
    }
  )
);

export default CustomMap;
