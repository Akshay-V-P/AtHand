import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
    onLocationSelect: (latitude: number, longitude: number) => void;

    positionDetails?: {
        latitude: number | null;
        longitude: number | null;
    };
}

const LocationSelector = ({
    onLocationSelect,
}: {
    onLocationSelect: (latitude: number, longitude: number) => void;
}) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
};

const MapController = ({ position }: { position: [number, number] | null }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 16);
        }
    }, [position, map]);

    return null;
};

const LocationPicker = ({
    onLocationSelect,
    positionDetails,
}: LocationPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    // Update when parent sends a new location
    useEffect(() => {
        if (
            positionDetails?.latitude !== null &&
            positionDetails?.latitude !== undefined &&
            positionDetails?.longitude !== null &&
            positionDetails?.longitude !== undefined
        ) {
            setPosition([positionDetails.latitude, positionDetails.longitude]);
        }
    }, [positionDetails]);

    const handleLocationSelect = (latitude: number, longitude: number) => {
        setPosition([latitude, longitude]);

        onLocationSelect(latitude, longitude);
    };

    return (
        <div className="h-[400px] rounded-xl overflow-hidden">
            <MapContainer
                center={[10.8505, 76.2711]}
                zoom={10}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                />

                <LocationSelector onLocationSelect={handleLocationSelect} />

                <MapController position={position} />

                {position && <Marker position={position} />}
            </MapContainer>
        </div>
    );
};

export default LocationPicker;
