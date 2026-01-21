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
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #e53935;
                box-shadow: inset 0 0 8px rgba(0,0,0,.35);
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
    /**
     * Render the plotarea of chart
     */
    render() {
      debugger;
      for (const serie of this.extensionData.series) {
        for (const dataPoint of serie.dataPoints) {
          const { labelInfo } = dataPoint;
          const trafficLightElement = TrafficLightTemplate.content.cloneNode(
            true
          );
          const trafficLightContainer = trafficLightElement.querySelector(
            ".traffic-light-container"
          );
          trafficLightContainer.setAttribute(
            "style",
            `left: ${labelInfo.x}px; top: ${labelInfo.y}px; position: absolute;`
          );
          this.shadowRoot.querySelector(
            ".plotarea-overlay-container"
          ).appendChild(trafficLightElement);
        }
      }
    }
  }
  customElements.define("viz-plotarea-general", VizPlotareaGeneral);
})();
