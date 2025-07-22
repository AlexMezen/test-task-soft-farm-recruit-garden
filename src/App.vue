<template>
  <div class="app">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Геоданні України</h1>
        <SearchInput 
          v-if="!selectedSettlement" 
          v-model="searchQuery" 
        />
      </div>
      
      <div class="sidebar-content">
        <div class="content-area">
          <ErrorMessage v-if="error" :message="error" />

          <SettlementDetail 
            v-if="selectedSettlement" 
            :settlement="selectedSettlement"
            :nominatim-loading="nominatimLoading"
          />

          <LoadingSpinner 
            v-else-if="loading" 
            message="Завантаження полігонів..."
          />
          
          <SettlementsList 
            v-else
            :settlements="paginatedSettlements"
            @select-settlement="handleSelectSettlement"
          />
        </div>
      </div>

      <Pagination 
        v-if="!selectedSettlement && !loading && filteredSettlements.length > itemsPerPage"
        :current-page="currentPage"
        :total-pages="totalPages"
        :items-per-page="itemsPerPage"
        :total-items="filteredSettlements.length"
        @next-page="nextPage"
        @prev-page="prevPage"
        @go-to-page="goToPage"
        @change-items-per-page="changeItemsPerPage"
      />

      <div v-if="selectedSettlement" class="sidebar-footer">
        <button @click="handleClearSelection" class="back-button">
          ← Назад до списку
        </button>
      </div>
    </div>
    
    <MapContainer />
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useAppStore } from './stores/appStore.js'
import { useCacheStore } from './stores/cacheStore.js'
import { useSettlements } from './composables/useSettlements.js'
import { useMap } from './composables/useMap.js'

import SearchInput from './components/SearchInput.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import SettlementsList from './components/SettlementsList.vue'
import SettlementDetail from './components/SettlementDetail.vue'
import Pagination from './components/Pagination.vue'
import MapContainer from './components/MapContainer.vue'

export default {
  name: 'App',
  components: {
    SearchInput,
    LoadingSpinner,
    ErrorMessage,
    SettlementsList,
    SettlementDetail,
    Pagination,
    MapContainer
  },
  setup() {
    const appStore = useAppStore()
    const cacheStore = useCacheStore()
    
    const {
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
    } = useSettlements()

    const {
      initMap,
      addPolygonsToMap,
      selectSettlementOnMap,
      clearSelection: clearMapSelection
    } = useMap()

    const handleSelectSettlement = async (settlement) => {
      await selectSettlement(settlement)
      selectSettlementOnMap(settlement)
    }

    const handleClearSelection = () => {
      clearSelection()
      clearMapSelection()
    }

    onMounted(async () => {
      try {
        await initMap()
        await loadSettlements()
      } catch (err) {
        appStore.setError(err.message)
      }
    })

    watch(() => appStore.settlements, (settlements) => {
      if (settlements.length > 0) {
        addPolygonsToMap(settlements, handleSelectSettlement)
      }
    })

    watch(searchQuery, () => {
      currentPage.value = 1
      loadNominatimForCurrentPage()
    })

    return {
      settlements: appStore.settlements,
      loading: appStore.loading,
      error: appStore.error,
      nominatimLoading: appStore.nominatimLoading,
      cacheInfo: computed(() => cacheStore.getCacheInfo()),
      
      searchQuery,
      selectedSettlement,
      currentPage,
      itemsPerPage,
      totalPages,
      filteredSettlements,
      paginatedSettlements,
      
      handleSelectSettlement,
      handleClearSelection,
      clearCache,
      loadSettlements,
      nextPage,
      prevPage,
      goToPage,
      changeItemsPerPage
    }
  }
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
}

.sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.back-button {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.back-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-height: 50vh;
  }
}
</style>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
}
</style>