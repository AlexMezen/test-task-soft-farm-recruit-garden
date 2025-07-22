<template>
  <div class="settlement-detail">
    <div v-if="nominatimLoading" class="loading-indicator">
      🌐 Завантаження деталей населеного пункту...
    </div>

    <div class="detail-header">
      <h2 class="detail-title">
        {{ settlement.name }}
      </h2>
    </div>
    
    <div class="detail-info">
      <div class="detail-field">
        <div class="field-label">Повна назва</div>
        <div class="field-value">
          {{ settlement.display_name }}
          <span v-if="!settlement.nominatimLoaded" class="info-note">
            (базова інформація)
          </span>
        </div>
      </div>
      
      <div class="detail-field">
        <div class="field-label">Координати центру</div>
        <div class="field-value">
          {{ settlement.center.lat.toFixed(6) }}, {{ settlement.center.lng.toFixed(6) }}
        </div>
      </div>
      
      <div v-if="settlement.address?.country" class="detail-field">
        <div class="field-label">Країна</div>
        <div class="field-value">{{ settlement.address.country }}</div>
      </div>
      
      <div v-if="settlement.address?.state" class="detail-field">
        <div class="field-label">Регіон/Область</div>
        <div class="field-value">{{ settlement.address.state }}</div>
      </div>
      
      <div v-if="settlement.nominatimData?.type" class="detail-field">
        <div class="field-label">Тип об'єкта</div>
        <div class="field-value">{{ settlement.nominatimData.type }}</div>
      </div>
      
      <div class="detail-field">
        <div class="field-label">Кількість точок полігону</div>
        <div class="field-value">{{ settlement.polygon.length }}</div>
      </div>

      <div class="detail-field">
        <div class="field-label">Колір полігону</div>
        <div class="field-value" :style="{ color: settlement.color }">
          {{ settlement.color }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettlementDetail',
  props: {
    settlement: {
      type: Object,
      required: true
    },
    nominatimLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.settlement-detail {
  padding: 0;
}

.loading-indicator {
  background: #e6fffa;
  color: #234e52;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  margin: 12px 0;
}

.detail-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-field {
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.field-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
}

.field-value {
  color: #1a202c;
  font-weight: 500;
}

.info-note {
  color: #94a3b8;
  font-style: italic;
}
</style>