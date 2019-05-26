import { GoogleChartComponentInterface } from "../google-charts-interfaces";

export interface ChartReadyEvent {
  message: string;
  component?:GoogleChartComponentInterface;
}
