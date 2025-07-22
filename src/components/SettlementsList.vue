<template>
  <div>
    <div v-if="settlements.length === 0" class="no-results">
      <div class="no-results-icon">🏘️</div>
      <div>Населені пункти не знайдені</div>
    </div>
    
    <div v-else>
      <div class="settlements-list">
        <div
          v-for="settlement in settlements"
          :key="settlement.id"
          @click="$emit('select-settlement', settlement)"
          class="settlement-card"
          :style="{ borderLeft: '4px solid ' + settlement.color }"
        >
          <div class="settlement-name">
            {{ settlement.name }}
            <span v-if="settlement.nominatimLoading" class="loading-indicator-small">🔄</span>
          </div>
          <div class="settlement-info">
            <div v-if="settlement.nominatimLoading" class="loading-text">
              Завантаження назви...
            </div>
            <div v-else>{{ settlement.display_name }}</div>
            <div v-if="settlement.address?.country">
              🌍 {{ settlement.address.country }}
            </div>
            <div v-if="settlement.address?.state">
              📍 {{ settlement.address.state }}
            </div>
            <div class="coordinates">
              📍 {{ settlement.coordinates }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettlementsList',
  props: {
    settlements: {
      type: Array,
      required: true
    }
  },
  emits: ['select-settlement']
}
</script>

<style scoped>
.settlements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settlement-card {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settlement-card:hover {
  background: #e2e8f0;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settlement-name {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-indicator-small {
  font-size: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #667eea;
  font-style: italic;
  font-size: 12px;
}

.settlement-info {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.coordinates {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>