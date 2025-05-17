// This file ensures TypeScript recognizes the global L variable
// that we're using in our RecyclingCenterMap component

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

export {}
