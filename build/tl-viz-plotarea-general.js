(function() {
  "use strict";
  const VizPlotareaGeneralContainerTemplate = document.createElement("template");
  VizPlotareaGeneralContainerTemplate.innerHTML = `
        <style>
            .plotarea-overlay-container {
                width: 100%;
                height: 100%;
                position: relative;
            }
        </style>
        <div class="plotarea-overlay-container"/>
    `;
  const TrafficLightTemplate = document.createElement("template");
  TrafficLightTemplate.innerHTML = `
        <style>
            .traffic-light-container {
                width: 100%;
                height: 100%;
                position: relative;
            }
            .traffic-light {
                border-radius: 50%;
                background: #e53935;
            }
        </style>
        <div class="traffic-light-container">
            <div class="traffic-light" ></div>
        </div>
    `;
  class VizPlotareaGeneral extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).appendChild(
        VizPlotareaGeneralContainerTemplate.content.cloneNode(true)
      );
    }
    /**
     * Called by SAC add-on extension framework to set exposed extension data to custom add-on component.
     * @param { IVizGeneralPlotareaExtensionData } extensionData The extension data that SAC exposed to custom element at this extension point;
     */
    setExtensionData(extensionData) {
      this.extensionData = extensionData;
      this.render();
    }
    /**
     * Called before the custom settings properties changed.
     * @param {Object} changedProps The changed settings properties of this custom element;
     */
    onBeforeUpdate(changedProps) {
    }
    /**
     * Called after the custom settings properties changed.
     * @param {Object} changedProps The changed settings properties of this custom element;
     */
    onAfterUpdate(changedProps) {
    }
    resolveTrafficLightColor(pointValue, redThreshold, greenThreshold, colors) {
      if (pointValue > greenThreshold) {
        return colors.color_green;
      }
      if (pointValue > redThreshold) {
        return colors.color_yellow;
      }
      return colors.color_red;
    }
    /**
     * Render the plotarea of chart
     */
    render() {
      this.shadowRoot.querySelector(
        ".plotarea-overlay-container"
      ).replaceChildren();
      if (!this.extensionData) {
        return;
      }
      if (this.extensionData.series.length != 3) {
        return;
      }
      const valueSerie = this.extensionData.series[0];
      const redThresholdSerie = this.extensionData.series[1];
      const greenThresholdSerie = this.extensionData.series[2];
      const TRAFFIC_LIGHT_SETTINGS = {
        width: 20,
        height: 20,
        color_green: "#43a047",
        color_yellow: "#fdd835",
        color_red: "#e53935"
      };
      for (let index = 0; index < valueSerie.dataPoints.length; index++) {
        const dataPoint = valueSerie.dataPoints[index];
        const dataPointRedThreshold = redThresholdSerie.dataPoints[index];
        const dataPointGreenThreshold = greenThresholdSerie.dataPoints[index];
        const { labelInfo } = dataPoint;
        const trafficLightElement = TrafficLightTemplate.content.cloneNode(
          true
        );
        const trafficLightContainer = trafficLightElement.querySelector(
          ".traffic-light-container"
        );
        const left = labelInfo.x + labelInfo.width / 2 - TRAFFIC_LIGHT_SETTINGS.width / 2;
        const top = labelInfo.y - labelInfo.height - TRAFFIC_LIGHT_SETTINGS.height / 2;
        trafficLightContainer.setAttribute(
          "style",
          `left: ${left}px; top: ${top}px; position: absolute;`
        );
        const trafficLight = trafficLightElement.querySelector(
          ".traffic-light"
        );
        const pointValue = dataPoint.dataInfo.pointValue;
        const redThresholdValue = dataPointRedThreshold.dataInfo.pointValue;
        const greenThresholdValue = dataPointGreenThreshold.dataInfo.pointValue;
        const useYCoordinateFallback = !Number.isFinite(pointValue) || !Number.isFinite(redThresholdValue) || !Number.isFinite(greenThresholdValue);
        const toValue = (y) => this.extensionData.clipPath.height - (y - this.extensionData.clipPath.y);
        const resolvedPointValue = useYCoordinateFallback ? toValue(dataPoint.dataInfo.y) : pointValue;
        const resolvedRedThresholdValue = useYCoordinateFallback ? toValue(dataPointRedThreshold.dataInfo.y) : redThresholdValue;
        const resolvedGreenThresholdValue = useYCoordinateFallback ? toValue(dataPointGreenThreshold.dataInfo.y) : greenThresholdValue;
        const color = this.resolveTrafficLightColor(
          resolvedPointValue,
          resolvedRedThresholdValue,
          resolvedGreenThresholdValue,
          TRAFFIC_LIGHT_SETTINGS
        );
        trafficLight.setAttribute(
          "style",
          `background: ${color}; width: ${TRAFFIC_LIGHT_SETTINGS.width}px; height: ${TRAFFIC_LIGHT_SETTINGS.height}px;`
        );
        this.shadowRoot.querySelector(
          ".plotarea-overlay-container"
        ).appendChild(trafficLightElement);
      }
    }
  }
  customElements.define("tl-viz-plotarea-general", VizPlotareaGeneral);
})();
