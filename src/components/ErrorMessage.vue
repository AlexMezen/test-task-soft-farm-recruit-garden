<template>
  <div class="error-message">
    <strong>❌ Помилка:</strong><br>
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}
</style>