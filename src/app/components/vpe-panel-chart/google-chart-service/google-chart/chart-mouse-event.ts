import { ChartHTMLTooltip } from './chart-html-tooltip';

export interface DataPointPosition {
  row: number;
  column: number;
}

export interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export class ChartMouseEvent {
  public position: DataPointPosition = { row: -1, column: -1 };
  public boundingBox: BoundingBox = { top: -1, left: -1, width: -1, height: -1 };
  public value: any = null;
  public columnType: string = "";
  public columnLabel: string = "";
}

/**
 * @deprecated Use ChartMouseOverEvent instead
 */
export class MouseOverEvent extends ChartMouseEvent {
  public tooltip: ChartHTMLTooltip | null = null;
}

export class ChartMouseOverEvent extends ChartMouseEvent {
  public tooltip: ChartHTMLTooltip | null = null;
}

export class ChartMouseOutEvent extends ChartMouseEvent {}

export class ChartMouseWheelEvent {
  public delta:number = 0;
}
