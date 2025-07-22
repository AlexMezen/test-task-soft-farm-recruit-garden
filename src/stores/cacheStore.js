import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCacheStore = defineStore('cache', () => {
  const cache = ref(new Map())
  
  const getCachedData = (key) => {
    return cache.value.get(key)
  }
  
  const setCachedData = (key, data) => {
    cache.value.set(key, data)
  }
  
  const getCacheSize = () => {
    return cache.value.size
  }
  
  const clearCache = () => {
    cache.value.clear()
  }
  
  const getCacheInfo = () => {
    return {
      size: cache.value.size,
      keys: Array.from(cache.value.keys()).slice(0, 5)
    }
  }
  
  return {
    cache,
    getCachedData,
    setCachedData,
    getCacheSize,
    clearCache,
    getCacheInfo
  }
})