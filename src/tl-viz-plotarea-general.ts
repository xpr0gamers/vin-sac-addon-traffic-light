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
                border-radius: 50%;
                background: #e53935;
            }
        </style>
        <div class="traffic-light-container">
            <div class="traffic-light" ></div>
        </div>
    `;

/**
 * VizPlotareaGeneral
 *
 * Custom Web Component that renders traffic light indicators over the SAC chart plotarea.
 * It overlays a colored circle (red / yellow / green) above each data point to signal
 * whether the metric (e.g. Sales) meets, exceeds, or falls below defined thresholds.
 *
 * Expects exactly three data series from SAC:
 *   - Series 0: yellow/green threshold (upper limit)
 *   - Series 1: red threshold (lower limit)
 *   - Series 2: the metric values (e.g. Sales)
 *
 * Color rules:
 *   - GREEN  → metric value is above the green threshold
 *   - YELLOW → metric value is between red and green thresholds (within limits)
 *   - RED    → metric value is below the red threshold
 *
 * Falls back to Y-pixel-coordinate comparison when numeric values are unavailable.
 */
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
   * Extracts a numeric point value from `dataInfo.pointValue`.
   * SAC sends this field as a string array (e.g. `["904000000"]`); an empty array
   * or a missing value signals that no numeric data is available and NaN is returned,
   * which will trigger the Y-coordinate fallback in the caller.
   */
  private extractPointValue(rawValue: unknown): number {
    if (Array.isArray(rawValue)) {
      return rawValue.length > 0 ? parseFloat(rawValue[0]) : NaN;
    }
    return typeof rawValue === "number" ? rawValue : NaN;
  }

  /**
   * Resolves the traffic light color for a single data point based on threshold comparison.
   *
   * @param pointValue - The actual metric value (e.g. Sales figure)
   * @param redThreshold - The lower boundary; values below this are critical (RED)
   * @param greenThreshold - The upper boundary; values above this are good (GREEN)
   * @param colors - Object containing hex color strings for each traffic light state
   * @returns The hex color string for the resolved traffic light state
   *
   * Color decision logic:
   *   pointValue > greenThreshold  → GREEN  (above upper limit: target exceeded)
   *   pointValue > redThreshold    → YELLOW (within limits: acceptable range)
   *   otherwise                    → RED    (below lower limit: critical)
   */
  protected resolveTrafficLightColor(
    pointValue: number,
    redThreshold: number,
    greenThreshold: number,
    colors: {
      color_green: string;
      color_yellow: string;
      color_red: string;
    },
  ): string {
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
  public render(): void {
    // Clear previous content
    this.shadowRoot!.querySelector(
      ".plotarea-overlay-container",
    )!.replaceChildren();

    if (!this.extensionData) {
      return;
    }

    if (this.extensionData.series.length != 3) {
      return;
    }

    // first serie is the yellow/green threshold (upper limit)
    const greenThresholdSerie = this.extensionData.series[0];

    // second serie is the red threshold (lower limit)
    const redThresholdSerie = this.extensionData.series[1];

    // third serie is the metric series (e.g. Sales)
    const valueSerie = this.extensionData.series[2];

    const TRAFFIC_LIGHT_SETTINGS = {
      width: 20,
      height: 20,
      color_green: "#43a047",
      color_yellow: "#fdd835",
      color_red: "#e53935",
    } as const;

    for (let index = 0; index < valueSerie.dataPoints.length; index++) {
      const dataPoint = valueSerie.dataPoints[index];
      const dataPointRedThreshold = redThresholdSerie.dataPoints[index];
      const dataPointGreenThreshold = greenThresholdSerie.dataPoints[index];

      const labelInfo = Array.isArray(dataPoint.labelInfo)
        ? dataPoint.labelInfo[0]
        : dataPoint.labelInfo;

      const trafficLightElement = TrafficLightTemplate.content.cloneNode(
        true,
      ) as HTMLElement;

      const trafficLightContainer = trafficLightElement.querySelector(
        ".traffic-light-container",
      ) as HTMLElement;

      const left =
        labelInfo.x + labelInfo.width / 2 - TRAFFIC_LIGHT_SETTINGS.width / 2;
      const top =
        labelInfo.y - labelInfo.height - TRAFFIC_LIGHT_SETTINGS.height / 2;
      trafficLightContainer.setAttribute(
        "style",
        `left: ${left}px; top: ${top}px; position: absolute;`,
      );

      const trafficLight = trafficLightElement.querySelector(
        ".traffic-light",
      ) as HTMLElement;

      const pointValue = this.extractPointValue(dataPoint.dataInfo.pointValue);
      const redThresholdValue = this.extractPointValue(dataPointRedThreshold.dataInfo.pointValue);
      const greenThresholdValue = this.extractPointValue(dataPointGreenThreshold.dataInfo.pointValue);
      /*
       * Fallback logic for missing threshold values:
       * In the fixtures, `pointValue` for threshold series can be missing.
       * To keep the traffic-light decision deterministic, we fall back to the
       * Y pixel coordinate from `dataInfo` as a substitute.
       * Since the Y-axis grows downward (smaller Y = higher value), we invert
       * the Y position relative to the plotarea height.
       * This preserves the same comparison direction as the numeric value logic.
       */
      const useYCoordinateFallback =
        !Number.isFinite(pointValue) ||
        !Number.isFinite(redThresholdValue) ||
        !Number.isFinite(greenThresholdValue);

      const toValue = (y: number): number =>
        this.extensionData.clipPath.height -
        (y - this.extensionData.clipPath.y);

      const resolvedPointValue = useYCoordinateFallback
        ? toValue(dataPoint.dataInfo.y)
        : pointValue;
      const resolvedRedThresholdValue = useYCoordinateFallback
        ? toValue(dataPointRedThreshold.dataInfo.y)
        : redThresholdValue;
      const resolvedGreenThresholdValue = useYCoordinateFallback
        ? toValue(dataPointGreenThreshold.dataInfo.y)
        : greenThresholdValue;

      const color = this.resolveTrafficLightColor(
        resolvedPointValue,
        resolvedRedThresholdValue,
        resolvedGreenThresholdValue,
        TRAFFIC_LIGHT_SETTINGS,
      );

      trafficLight.setAttribute(
        "style",
        `background: ${color}; width: ${TRAFFIC_LIGHT_SETTINGS.width}px; height: ${TRAFFIC_LIGHT_SETTINGS.height}px;`,
      );

      this.shadowRoot!.querySelector(
        ".plotarea-overlay-container",
      )!.appendChild(trafficLightElement);
    }
  }
}

customElements.define("tl-viz-plotarea-general", VizPlotareaGeneral);
