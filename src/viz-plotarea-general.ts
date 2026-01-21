import { IAddOnComponent, IVizGeneralPlotareaExtensionData } from "types";

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
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #e53935;
                box-shadow: inset 0 0 8px rgba(0,0,0,.35);
            }
        </style>
        <div class="traffic-light-container">
            <div class="traffic-light" ></div>
        </div>
    `;

class VizPlotareaGeneral extends HTMLElement implements IAddOnComponent {
  protected extensionData!: IVizGeneralPlotareaExtensionData;

  public constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      VizPlotareaGeneralContainerTemplate.content.cloneNode(true),
    );
  }

  /**
   * Called by SAC add-on extension framework to set exposed extension data to custom add-on component.
   * @param { IVizGeneralPlotareaExtensionData } extensionData The extension data that SAC exposed to custom element at this extension point;
   */
  public setExtensionData(
    extensionData: IVizGeneralPlotareaExtensionData,
  ): void {
    this.extensionData = extensionData;
    this.render();
  }

  /**
   * Called before the custom settings properties changed.
   * @param {Object} changedProps The changed settings properties of this custom element;
   */
  public onBeforeUpdate?(changedProps: any): void {}

  /**
   * Called after the custom settings properties changed.
   * @param {Object} changedProps The changed settings properties of this custom element;
   */
  public onAfterUpdate?(changedProps: any): void {}

  /**
   * Render the plotarea of chart
   */
  public render(): void {
    for (const serie of this.extensionData.series) {
      // For demonstration purpose, we just add a traffic light for each series in the plot area
      for (const dataPoint of serie.dataPoints) {
        const { labelInfo } = dataPoint;

        const trafficLightElement = TrafficLightTemplate.content.cloneNode(
          true,
        ) as HTMLElement;

        const trafficLightContainer = trafficLightElement.querySelector(
          ".traffic-light-container",
        ) as HTMLElement;

        trafficLightContainer.setAttribute(
          "style",
          `left: ${labelInfo.x}px; top: ${labelInfo.y - 30}px; position: absolute;`,
        );

        const trafficLight = trafficLightElement.querySelector(
          ".traffic-light",
        ) as HTMLElement;

        // set random traffic light color for demonstration purpose
        const colors = ["#e53935", "#fdd835", "#43a047"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        trafficLight.setAttribute("style", `background: ${randomColor};`);

        this.shadowRoot!.querySelector(
          ".plotarea-overlay-container",
        )!.appendChild(trafficLightElement);
      }
    }
  }
}

customElements.define("viz-plotarea-general", VizPlotareaGeneral);
