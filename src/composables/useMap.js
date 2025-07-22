import { ref, nextTick } from "vue";
import { validateAndFixPolygon } from "../utils/geoUtils.js";

export function useMap() {
  const mapInstance = ref(null);
  const polygonLayers = ref([]);
  const selectedLayer = ref(null);

  const initMap = async () => {
    await nextTick();

    try {
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        throw new Error("Элемент карты не найден");
      }

      if (typeof window !== "undefined" && window.L) {
        mapInstance.value = window.L.map("map", {
          center: [49.0, 32.0],
          zoom: 6,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
          }
        ).addTo(mapInstance.value);
      } else {
        throw new Error("Leaflet не загружен");
      }
    } catch (error) {
      throw error;
    }
  };

  const addPolygonsToMap = (settlements, onPolygonClick = null) => {
    if (!mapInstance.value || settlements.length === 0) {
      return;
    }

    polygonLayers.value.forEach((layer) => {
      mapInstance.value.removeLayer(layer);
    });
    polygonLayers.value = [];

    settlements.forEach((settlement) => {
      try {
        const validPolygon = validateAndFixPolygon(settlement.polygon);
        if (!validPolygon) {
          return;
        }

        const latLngs = validPolygon.map((point) => [point.lat, point.lng]);

        const polygon = window.L.polygon(latLngs, {
          color: settlement.color,
          fillColor: settlement.color,
          fillOpacity: 0.6,
          weight: 3,
          opacity: 1,
        }).addTo(mapInstance.value);

        const bounds = polygon.getBounds();
        const area = bounds.getNorthEast().distanceTo(bounds.getSouthWest());

        polygon.bindPopup(`
          <div style="min-width: 200px;">
            <strong style="color: ${settlement.color};">${
          settlement.name
        }</strong><br>
            <hr style="margin: 8px 0;">
            <small>Центр: ${settlement.center.lat.toFixed(
              4
            )}, ${settlement.center.lng.toFixed(4)}</small><br>
            <small>Точок: ${validPolygon.length}</small><br>
            <small>Розмір: ~${area.toFixed(0)}м</small>
          </div>
        `);

        if (onPolygonClick) {
          polygon.on("click", () => {
            onPolygonClick(settlement);
          });
        }

        polygonLayers.value.push(polygon);
      } catch (error) {
      }
    });

    if (polygonLayers.value.length > 0) {
      try {
        const group = new window.L.featureGroup(polygonLayers.value);
        const bounds = group.getBounds();

        if (bounds.isValid()) {
          mapInstance.value.fitBounds(bounds.pad(0.05));
        } else {
          mapInstance.value.setView([49.0, 32.0], 6);
        }
      } catch (error) {
        mapInstance.value.setView([49.0, 32.0], 6);
      }
    } else {
      mapInstance.value.setView([49.0, 32.0], 6);
    }
  };

  const selectSettlementOnMap = (settlement) => {
    if (!mapInstance.value || !settlement.polygon) {
      return;
    }

    if (selectedLayer.value) {
      mapInstance.value.removeLayer(selectedLayer.value);
    }

    try {
      const latLngs = settlement.polygon.map((point) => [point.lat, point.lng]);
      selectedLayer.value = window.L.polygon(latLngs, {
        color: "#ff0000",
        fillColor: "#ff0000",
        fillOpacity: 0.7,
        weight: 5,
        opacity: 1,
      }).addTo(mapInstance.value);

      selectedLayer.value
        .bindPopup(
          `
        <div style="min-width: 250px;">
          <strong style="color: #ff0000;">🎯 ${settlement.name}</strong><br>
          <em>Обраний населений пункт</em><br>
          <hr style="margin: 8px 0;">
          ${settlement.display_name}<br>
          <small>Центр: ${settlement.center.lat.toFixed(
            6
          )}, ${settlement.center.lng.toFixed(6)}</small>
        </div>
      `
        )
        .openPopup();

      const bounds = selectedLayer.value.getBounds();
      if (bounds.isValid()) {
        mapInstance.value.fitBounds(bounds.pad(0.2));
      }
    } catch (error) {
    }
  };

  const clearSelection = () => {
    if (selectedLayer.value && mapInstance.value) {
      mapInstance.value.removeLayer(selectedLayer.value);
      selectedLayer.value = null;
    }

    if (polygonLayers.value.length > 0 && mapInstance.value) {
      try {
        const group = new window.L.featureGroup(polygonLayers.value);
        const bounds = group.getBounds();
        if (bounds.isValid()) {
          mapInstance.value.fitBounds(bounds.pad(0.1));
        }
      } catch (error) {
        mapInstance.value.setView([49.0, 32.0], 6);
      }
    }
  };

  return {
    mapInstance,
    polygonLayers,
    selectedLayer,
    initMap,
    addPolygonsToMap,
    selectSettlementOnMap,
    clearSelection,
  };
}