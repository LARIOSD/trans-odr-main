import { EXTERNALS_ENV } from "@common/constants/server.constants";
import { get, post } from "src/utils/fetchRequest";

export class ExternalService {
    async GetMaps(origin: string, destination: string) {
            const { googleApiUrl = '', googleToken = ''} = EXTERNALS_ENV

            const [ originLatitude, originLongitude ] = origin.split(',');
            const [ destinationLatitude, destinationLongitude ] = destination.split(',');

            const headers = {
                "X-Goog-Api-Key": googleToken, 
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
            }
            
            const requestData = {
                origin: {
                  location: {
                    latLng: {
                      latitude: originLatitude,
                      longitude: originLongitude
                    }
                  }
                },
                destination: {
                  location: {
                    latLng: {
                      latitude: destinationLatitude,
                      longitude: destinationLongitude
                    }
                  }
                },
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_AWARE',
                computeAlternativeRoutes: false,
                routeModifiers: {
                  avoidTolls: false,
                  avoidHighways: false,
                  avoidFerries: false
                },
                languageCode: 'en-US',
                units: 'IMPERIAL'
              };
  
            const response = await post(googleApiUrl, requestData, headers)
            return response
    }
}
