<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name: 'MapContainer'
}
</script>

<style scoped>
.map-container {
  flex: 1;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}
</style>