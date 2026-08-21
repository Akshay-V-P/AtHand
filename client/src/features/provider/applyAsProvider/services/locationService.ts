import { providerApplicationApi } from "../api/providerApplicationApi"

export const getUserLocation = async() => {
    try {
        if (!navigator.geolocation) {
            throw new Error("Geolocation is not available")
        }

        const permissionState = await navigator.permissions.query({ name: "geolocation" })
        if (permissionState.state !== 'granted') throw new Error("Location access denied. Please enable it in your browser settings.")
        
        const position = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject
                )
        )

        return position
        
    } catch (error:any) {
        console.error("Location error : ", error.message)
    }
}

export const reverseGeocode = async(latitude: number, longitude: number)=>{
    const response =await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    );
    
    const data = await response.json()

       
       return {
            address: {
               street:
                    data.address?.shop ??
                    data.address?.leisure ??
                    data.address?.amenity ??
                    data.address?.neighbourhood ??
                    data.address?.road ??
                    data.address?.pedestrian ??
                    data.address?.suburb ??
                   "",
                
               city:
                   data.address?.suburb ??
                   data.address?.town ??
                   data.address?.city ??
                   data.address?.village ??
                   data.address?.municipality ??
                   "",
               district:
                   data.address?.state_district ??
                   data.address?.district ??
                   "",
               state:
                   data.address?.state ?? "",
                pincode:data.address?.postcode ?? "",
            },
            coordinates: {
                type: "Point" as const,
                coordinates: [longitude, latitude] as [number, number]
            }
        }
}