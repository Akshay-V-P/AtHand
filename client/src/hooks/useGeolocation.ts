import { useState, useEffect } from 'react';

export interface LocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    isLoading: boolean;
}

export const useGeolocation = (skip = false) => {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        error: null,
        isLoading: true,
    });

    useEffect(() => {
        if (skip) {
            setLocation({
                latitude: null,
                longitude: null,
                error: null,
                isLoading: false,
            });
            return;
        }

        if (!navigator.geolocation) {
            setLocation((prev) => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                isLoading: false,
            }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    isLoading: false,
                });
            },
            (error) => {
                setLocation((prev) => ({
                    ...prev,
                    error: error.message,
                    isLoading: false,
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [skip]);

    return location;
};
