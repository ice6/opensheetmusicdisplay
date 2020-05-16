import { PlacementEnum } from "../Expressions/AbstractExpression";
export declare enum TechnicalInstructionType {
    Fingering = 0
}
export declare class TechnicalInstruction {
    type: TechnicalInstructionType;
    value: string;
    placement: PlacementEnum;
}
