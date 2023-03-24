import GoogleMapReact from 'google-map-react';

import RoomIcon from '@mui/icons-material/Room';

const Marker = () => <RoomIcon
    style={{
        color: 'red',
        position: 'absolute',
        transform: 'translate(-50%, -100%)'
    }}
    fontSize='large'
/>;

export default function SimpleMap({ coordinates }) {
    return (
        <div style={{ height: '80vh', width: '70%', minWidth: 235, margin: 'auto', maxWidth: 900 }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDsaFC1kMaY_1AWL_e2cdNsidfhlZZgDcg" }}
                defaultCenter={coordinates}
                defaultZoom={17}
            >
                <Marker
                    lat={coordinates.lat}
                    lng={coordinates.lng}
                />
            </GoogleMapReact>
        </div>
    );
}