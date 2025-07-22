import { useCacheStore } from '../stores/cacheStore.js'

export const searchNearbyPlaces = async (lat, lng) => {
  const cacheStore = useCacheStore()
  const cacheKey = `nominatim_${lat.toFixed(6)}_${lng.toFixed(6)}`
  
  const cached = cacheStore.getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=uk,ru,en`,
      {
        headers: {
          'User-Agent': 'Vue-GeoData-App/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    cacheStore.setCachedData(cacheKey, data)
    
    await new Promise(resolve => setTimeout(resolve))
    
    return data
  } catch (error) {
    cacheStore.setCachedData(cacheKey, null)
    return null
  }
}

export const loadPolygonsFromFile = async () => {
  try {
    const response = await fetch('./polygons.json')
    
   
    
    const fileContent = await response.text()
    const data = JSON.parse(fileContent)
    
    return data
  } catch (error) {
   
  }
}