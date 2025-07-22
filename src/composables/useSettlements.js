import { ref, computed, nextTick } from 'vue'
import { useAppStore } from '../stores/appStore.js'
import { useCacheStore } from '../stores/cacheStore.js'
import { searchNearbyPlaces, loadPolygonsFromFile } from '../utils/apiUtils.js'
import { validateAndFixPolygon, calculatePolygonCenter, generateRandomColor } from '../utils/geoUtils.js'

export function useSettlements() {
  const appStore = useAppStore()
  const cacheStore = useCacheStore()
  
  const searchQuery = ref('')
  const selectedSettlement = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)

  const filteredSettlements = computed(() => {
    if (!searchQuery.value) {
      return appStore.settlements
    }
    const filtered = appStore.settlements.filter(settlement =>
      settlement.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (settlement.display_name && settlement.display_name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
    if (currentPage.value > Math.ceil(filtered.length / itemsPerPage.value)) {
      currentPage.value = 1
    }
    return filtered
  })

  const totalPages = computed(() => Math.ceil(filteredSettlements.value.length / itemsPerPage.value))

  const paginatedSettlements = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredSettlements.value.slice(start, end)
  })

  const loadNominatimForCurrentPage = async () => {
    const currentPageSettlements = paginatedSettlements.value
    
    const settlementToLoad = currentPageSettlements.filter(s => !s.nominatimLoaded && !s.nominatimLoading)
    
    if (settlementToLoad.length === 0) return
    
    settlementToLoad.forEach(settlement => {
      settlement.nominatimLoading = true
    })
    
    for (const settlement of settlementToLoad) {
      try {
        const nominatimData = await searchNearbyPlaces(settlement.center.lat, settlement.center.lng)
        if (nominatimData && nominatimData.display_name) {
          settlement.display_name = nominatimData.display_name
          settlement.address = nominatimData.address
          settlement.nominatimData = nominatimData
        }
        settlement.nominatimLoaded = true
        settlement.nominatimLoading = false
      } catch (error) {
        settlement.nominatimLoaded = true
        settlement.nominatimLoading = false
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  const loadSettlements = async () => {
    appStore.setLoading(true)
    appStore.setError('')
    appStore.setSettlements([])

    try {
      const polygonsFromFile = await loadPolygonsFromFile()
      
      if (!polygonsFromFile || !Array.isArray(polygonsFromFile)) {
        throw new Error('Некорректные данные в файле polygons.json')
      }

      const results = []
      
      for (let i = 0; i < polygonsFromFile.length; i++) {
        const polygonData = polygonsFromFile[i]
        
        try {
          if (!polygonData.polygon || !Array.isArray(polygonData.polygon)) {
            continue
          }

          const validPolygon = validateAndFixPolygon(polygonData.polygon)
          if (!validPolygon) {
            continue
          }

          const center = calculatePolygonCenter(validPolygon)
          
          const settlement = {
            id: polygonData.id,
            name: polygonData.name,
            polygon: validPolygon,
            center,
            color: generateRandomColor(),
            display_name: `${polygonData.name}`,
            nominatimLoaded: false,
            coordinates: `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
          }

          results.push(settlement)
          
        } catch (polygonError) {
        }
      }

      appStore.setSettlements(results)

      await nextTick()
      await loadNominatimForCurrentPage()
      
    } catch (err) {
      appStore.setError(err.message || 'Не удалось загрузить населенные пункты')
    } finally {
      appStore.setLoading(false)
    }
  }

  const selectSettlement = async (settlement) => {
    selectedSettlement.value = settlement

    if (!settlement.nominatimLoaded) {
      appStore.setNominatimLoading(true)
      
      try {
        const nominatimData = await searchNearbyPlaces(settlement.center.lat, settlement.center.lng)
        if (nominatimData && nominatimData.display_name) {
          settlement.display_name = nominatimData.display_name
          settlement.address = nominatimData.address
          settlement.nominatimData = nominatimData
          settlement.nominatimLoaded = true
        } else {
          settlement.nominatimLoaded = true
        }
      } catch (error) {
        settlement.nominatimLoaded = true
      }
      
      appStore.setNominatimLoading(false)
    }
  }

  const clearSelection = () => {
    selectedSettlement.value = null
  }

  const clearCache = () => {
    cacheStore.clearCache()
    appStore.settlements.forEach(settlement => {
      settlement.nominatimLoaded = false
      settlement.display_name = settlement.name
      delete settlement.address
      delete settlement.nominatimData
    })
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      nextTick(() => loadNominatimForCurrentPage())
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      nextTick(() => loadNominatimForCurrentPage())
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      nextTick(() => loadNominatimForCurrentPage())
    }
  }

  const changeItemsPerPage = (newSize) => {
    itemsPerPage.value = newSize
    currentPage.value = 1
    nextTick(() => loadNominatimForCurrentPage())
  }

  return {
    searchQuery,
    selectedSettlement,
    currentPage,
    itemsPerPage,
    totalPages,
    filteredSettlements,
    paginatedSettlements,
    loadSettlements,
    selectSettlement,
    clearSelection,
    clearCache,
    loadNominatimForCurrentPage,
    nextPage,
    prevPage,
    goToPage,
    changeItemsPerPage
  }
}