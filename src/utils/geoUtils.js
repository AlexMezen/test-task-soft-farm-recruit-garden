export const calculatePolygonCenter = (polygon) => {
  try {
    if (typeof window !== 'undefined' && typeof window.turf !== 'undefined') {
      let coordinates = polygon.map(point => [point.lng, point.lat])
      
      const first = coordinates[0]
      const last = coordinates[coordinates.length - 1]
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coordinates.push([first[0], first[1]])
      }
      
      const geoJsonPolygon = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        }
      }
      
      const center = window.turf.centroid(geoJsonPolygon)
      const centerCoords = {
        lat: center.geometry.coordinates[1],
        lng: center.geometry.coordinates[0]
      }
      
      return centerCoords
    } else {
      let totalLat = 0
      let totalLng = 0
      
      for (const point of polygon) {
        totalLat += point.lat
        totalLng += point.lng
      }
      
      const centerCoords = {
        lat: totalLat / polygon.length,
        lng: totalLng / polygon.length
      }
      
      return centerCoords
    }
  } catch (error) {
    return { lat: 49, lng: 32 }
  }
}

export const validateAndFixPolygon = (polygon) => {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    return null
  }

  const validPoints = polygon.filter(point => 
    point && 
    typeof point.lat === 'number' && 
    typeof point.lng === 'number' &&
    !isNaN(point.lat) && 
    !isNaN(point.lng) &&
    point.lat >= -90 && point.lat <= 90 &&
    point.lng >= -180 && point.lng <= 180
  )

  if (validPoints.length < 3) {
    return null
  }

  return validPoints
}

export const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', 
    '#AB47BC', '#66BB6A', '#EF5350', '#26C6DA',
    '#FF7043', '#9CCC65', '#5C6BC0', '#FFCA28',
    '#FF8A65', '#A1C181', '#D32F2F', '#7B1FA2',
    '#512DA8', '#303F9F', '#1976D2', '#0288D1'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}