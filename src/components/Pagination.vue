<template>
  <div class="pagination">
    <div class="pagination-controls">
      <div class="pagination-info">
        Показано {{ startIndex }}-{{ endIndex }} з {{ totalItems }}
      </div>
      <div class="pagination-size">
        <span>На сторінці:</span>
        <select :value="itemsPerPage" @change="$emit('change-items-per-page', +$event.target.value)">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
    
    <div class="pagination-buttons">
      <button 
        @click="$emit('prev-page')" 
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        ←
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="$emit('go-to-page', page)"
        :class="['pagination-button', { active: currentPage === page }]"
      >
        {{ page }}
      </button>
      
      <span v-if="totalPages > 5" class="pagination-button" style="border: none; cursor: default;">
        ...
      </span>
      
      <button 
        v-if="totalPages > 5 && currentPage !== totalPages"
        @click="$emit('go-to-page', totalPages)"
        :class="['pagination-button', { active: currentPage === totalPages }]"
      >
        {{ totalPages }}
      </button>
      
      <button 
        @click="$emit('next-page')" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        →
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  },
  emits: ['next-page', 'prev-page', 'go-to-page', 'change-items-per-page'],
  setup(props) {
    const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
    const endIndex = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
    const visiblePages = computed(() => Math.min(5, props.totalPages))

    return {
      startIndex,
      endIndex,
      visiblePages
    }
  }
}
</script>

<style scoped>
.pagination {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.pagination-info {
  font-size: 12px;
  color: #64748b;
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.pagination-size select {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.pagination-button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
  min-width: 32px;
  text-align: center;
}

.pagination-button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e0;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>