import React, { useEffect, memo, useCallback } from 'react';

import { Button, Col, Row } from 'react-bootstrap';
import CustomMap from './CustomMap';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useContext, forwardRef } from 'react';

type Props = {
  contextInjection: any;
  contextUpdator: any;
  setLocation: any;
  zoomLevel: number;
};

const Index = memo(
  forwardRef(function Index(
    { contextInjection, contextUpdator, setLocation, zoomLevel }: Props,
    markerRef: React.Ref<any>
  ) {
    const mapKey = process.env.REACT_APP_MAPS_API_KEY;
    const context = useContext(contextInjection) as {
      lat: number;
      lng: number;
    };
    const [loading, setLoading] = React.useState(true);

    const [address, setAddress] = React.useState<any>([]);

    const [locationType, setLocationType] = React.useState<String>('');
    const [resultType, setResultType] = React.useState<String>('');
    const [extraCompType, setExtraCompType] = React.useState<String>('');

    const baseUrl = process.env.REACT_APP_REVERSE_GEOCODE_URL;
    const latlng = `latlng=${context.lat},${context.lng}`;
    const locationTypeParam = locationType
      ? `&location_type=${locationType}`
      : '';
    const resultTypeParam = resultType ? `&result_type=${resultType}` : '';
    const extraCompTypeParam = extraCompType
      ? `&extra_computations=${extraCompType}`
      : '';
    const apiKey = `&key=${mapKey}`;

    useEffect(() => {
      const url = `${baseUrl}?${latlng}${locationTypeParam}${resultTypeParam}${extraCompTypeParam}${apiKey}`;
      if (loading === true) {
        setLoading(true);
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setAddress([...data?.results]);
            setLoading(false);
          });
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }, [loading]);

    function handleCheckboxChange() {
      setLoading(true);
    }

    return (
      <div>
        <APIProvider apiKey={mapKey || ''}>
          <CustomMap
            lat={context.lat}
            lng={context.lng}
            contextUpdator={contextUpdator}
            ref={markerRef}
            zoomLevel={zoomLevel}
          />
        </APIProvider>
        <Row className="mt-2">
          <Col md={6}>
            <p>
              Latitude <div>{context.lat}</div>
            </p>
          </Col>
          <Col md={6}>
            <p>
              Longitude <div>{context.lng}</div>
            </p>
          </Col>
        </Row>
      </div>
    );
  })
);

export default Index;
