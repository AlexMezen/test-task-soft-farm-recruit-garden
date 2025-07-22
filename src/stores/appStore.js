import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const settlements = ref([])
  const loading = ref(false)
  const error = ref('')
  const polygonsData = ref([])
  const nominatimLoading = ref(false)
  
  const setSettlements = (data) => {
    settlements.value = data
  }
  
  const setLoading = (value) => {
    loading.value = value
  }
  
  const setError = (message) => {
    error.value = message
  }
  
  const setPolygonsData = (data) => {
    polygonsData.value = data
  }
  
  const setNominatimLoading = (value) => {
    nominatimLoading.value = value
  }
  
  return {
    settlements,
    loading,
    error,
    polygonsData,
    nominatimLoading,
    setSettlements,
    setLoading,
    setError,
    setPolygonsData,
    setNominatimLoading
  }
})