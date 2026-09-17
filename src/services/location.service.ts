import { config } from "@/config";
import { LocationStatus } from "@/types/enums";

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class LocationApiError extends Error {
  readonly status: LocationStatus;

  constructor(status: LocationStatus, message: string) {
    super(message);
    this.name = "LocationApiError";
    this.status = status;
  }
}

export async function getCurrentPosition(): Promise<GeolocationResult> {
  if (!("geolocation" in navigator)) {
    throw new LocationApiError(
      LocationStatus.UNAVAILABLE,
      "Geolocation is not supported by this browser."
    );
  }

  return new Promise<GeolocationResult>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new LocationApiError(
              LocationStatus.PERMISSION_DENIED,
              "Location permission was denied. Please enable location access to mark your attendance."
            )
          );
        } else if (error.code === error.TIMEOUT) {
          reject(
            new LocationApiError(
              LocationStatus.ERROR,
              "Location request timed out. Please try again."
            )
          );
        } else {
          reject(
            new LocationApiError(
              LocationStatus.UNAVAILABLE,
              "We couldn't determine your current location. Please try again."
            )
          );
        }
      },
      {
        enableHighAccuracy: config.location.highAccuracy,
        timeout: config.location.timeoutMs,
        maximumAge: 0,
      }
    );
  });
}