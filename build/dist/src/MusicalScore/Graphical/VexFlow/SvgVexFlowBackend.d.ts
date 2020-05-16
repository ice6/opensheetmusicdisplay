import Vex from "vexflow";
import { VexFlowBackend } from "./VexFlowBackend";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { Fonts } from "../../../Common/Enums/Fonts";
import { RectangleF2D } from "../../../Common/DataObjects/RectangleF2D";
import { PointF2D } from "../../../Common/DataObjects/PointF2D";
import { EngravingRules } from "..";
import { BackendType } from "../../../OpenSheetMusicDisplay";
export declare class SvgVexFlowBackend extends VexFlowBackend {
    private ctx;
    constructor(rules: EngravingRules);
    getVexflowBackendType(): Vex.Flow.Renderer.Backends;
    getOSMDBackendType(): BackendType;
    initialize(container: HTMLElement): void;
    getContext(): Vex.Flow.SVGContext;
    getSvgElement(): SVGElement;
    clear(): void;
    scale(k: number): void;
    translate(x: number, y: number): void;
    renderText(fontHeight: number, fontStyle: FontStyles, font: Fonts, text: string, heightInPixel: number, screenPosition: PointF2D, color?: string): void;
    renderRectangle(rectangle: RectangleF2D, styleId: number, alpha?: number): void;
    renderLine(start: PointF2D, stop: PointF2D, color?: string, lineWidth?: number): void;
    renderCurve(points: PointF2D[]): void;
}
