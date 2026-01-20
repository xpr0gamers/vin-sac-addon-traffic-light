export const AddOnsReservedSettings = {
  ["sap.addOn.viz.plotarea.general"]: {
    ["sapHideOriginalDataPointMarks"]: {
      type: "boolean",
      description: "If the data point marks should be hidden on original chart",
      default: false,
    },
    ["sapHideOriginalDataPointLabels"]: {
      type: "boolean",
      description:
        "If the data point labels should be hidden on original chart",
      default: false,
    },
    ["sapHideOriginalXAxisLabels"]: {
      type: "boolean",
      description: "If the x-axis labels should be hidden on original chart",
      default: false,
    },
    ["sapHideOriginalYAxisLabels"]: {
      type: "boolean",
      description: "If the y-axis labels should be hidden on original chart",
      default: false,
    },
    ["sapHideOriginalXAxisStackLabels"]: {
      type: "boolean",
      description:
        "If the stack labels on x-axis should be hidden on original chart",
      default: false,
    },
    ["sapHideOriginalYAxisStackLabels"]: {
      type: "boolean",
      description:
        "If the stack labels on y-axis should be hidden on original chart",
      default: false,
    },
  },
};

export type ExtensionDataType =
  | IVizTooltipExtensionData
  | IVizGeneralPlotareaExtensionData
  | IVizNumericPointPlotareaExtensionData;

export interface IAddOnComponent {
  /**
   * Called by SAC add-on extension framework to set exposed extension data
   * to custom add-on component.
   * @param {ExtensionDataType} extensionData The extension data that SAC
   * exposed to custom element at this extension point;
   */
  setExtensionData(extensionData: ExtensionDataType): void;
  /**
   * Called before the custom settings properties changed.
   * @param {Object} changedProps The changed settings properties of this
   * custom element;
   */
  onBeforeUpdate?(changedProps: any): void;
  /**
   * Called after the custom settings properties changed.
   * @param {Object} changedProps The changed settings properties of this
   * custom element;
   */
  onAfterUpdate?(changedProps: any): void;
}

export interface IVizNumericPointPlotareaExtensionData {
  /**
   * The size of original chart
   */
  chartSize: ISize;
  /**
   * The layout information of primary values
   */
  primaryRows: IRow[];
  /**
   * The layout information of y-axis labels
   */
  secondaryRows: IRow[];
}

/**
 * Interface to describe a row displayed on chart tooltip
 */
export interface IVizTooltipRow {
  /**
   * The title of the row
   */
  title: string;
  /**
   * The value of the row
   */
  value: string;
  /**
   * The key of the row
   */
  key?: string;
}

export interface IVizTooltipHeaderRow extends IVizTooltipRow {
  /**
   * The warnings displayed on chart tooltip header
   */
  warnings?: string[];
}

/**
 * Interface of chart tooltip extension data
 */
export interface IVizTooltipExtensionData {
  /**
   * The header row data of chart tooltip
   */
  header: IVizTooltipHeaderRow;
  /**
   * The details rows data of chart tooltip
   */
  details: IVizTooltipRow[];
}

type IRect = IPoint & ISize;

interface ISize {
  width: number;
  height: number;
}

interface IPoint {
  x: number;
  y: number;
}

interface IRectWithValue extends IRect {
  /**
   * The value that current rect element is representing
   */
  pointValue: string | number;
  /**
   * The displayed/formatted value of current rect element is representing
   */
  formattedValue: string;
}

export interface IDataPoint {
  /**
   * Provide data mark layout information of current data point;
   */
  dataInfo: IDataInfo;
  /**
   * Provide data label layout information of current data point;
   */
  labelInfo: ILabelInfo;
}

export interface IDataInfo extends IRectWithValue {
  pointValue: number;
  /**
   * Color of current data point mark in original chart
   */
  color: string;
  /**
   * The border color of current data point mark in orignal chart
   */
  borderColor: string;
  /**
   * If current data point is selected
   */
  selected?: boolean;
}

interface ILabelRect extends IRect {
  /**
   * The color of this label
   */
  color: string;
  /**
   * A string of number between 0 and 1 indicating the opacity of this label
   */
  opacity: string;
  /**
    * A string of a number ending with 'px' indicating the font size of this
   label
    */
  fontSize: string;
}

export interface ILabelInfo extends ILabelRect {
  pointValue: string;
  /**
   * If this label is a variance label, then it will have this property
   * indicating
   * the type of this variance label
   */
  varianceLabelType?: "positive" | "negative" | "nullzero";
}

export interface ISeries {
  /**
   * The layout information of data points in current series
   */
  dataPoints: IDataPoint[];
  /**
   * If current series is selected
   */
  selected: boolean;
  /**
   * The name of the series;
   */
  name: string;
  /**
   * The color of the data point marks in current series
   */
  color: string;
  /**
   * If Show-as Triangle is enabled on current series
   */
  showAsTriangle?: boolean;
}

interface IAxisLabel extends ILabelRect {
  pointValue: string;
}

export interface IVizGeneralPlotareaExtensionData {
  /**
   * The size of original chart
   */
  chartSize: ISize;
  /**
   * If true, it's a bar chart, otherwise it's a column chart
   */
  isHorizontal: boolean;
  /**
   * The view range of current chart. It should be applied to
   * custom add-on component's clip-path style so that the
   * elements (data points, labels) out of view range are not
   * displayed.
   */
  clipPath: IRect;
  /**
   * The series of the chart
   */
  series: ISeries[];
  /**
   * The layout information of x-aixs labels
   */
  xAxisLabels: IAxisLabel[];
  /**
   * The layout information of y-axis labels
   */
  yAxisLabels: IAxisLabel[];
  /**
   * The layout information of x-aixs stacked labels
   */
  xAxisStackLabels: IAxisLabel[];
  /**
   * The layout information of y-aixs stacked labels
   */
  yAxisStackLabels: IAxisLabel[];
}

interface IRow {
  /**
   * The layout information of row number
   */
  number: INumber;
  /**
   * The layout information of row label
   */
  label: ILabel;
}

interface INumber extends ILabelRect {
  pointValue: string | undefined;
}

interface ILabel extends ILabelRect {
  pointValue: string | undefined;
}
