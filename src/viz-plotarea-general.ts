import { IAddOnComponent, IVizGeneralPlotareaExtensionData } from "types";

class VizPlotareaGeneral extends HTMLElement implements IAddOnComponent {
  protected extensionData!: IVizGeneralPlotareaExtensionData;

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
    debugger;
  }
}

customElements.define("viz-plotarea-general", VizPlotareaGeneral);
