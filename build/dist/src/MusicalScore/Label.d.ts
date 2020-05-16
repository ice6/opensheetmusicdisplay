import { TextAlignmentEnum } from "../Common/Enums/TextAlignment";
import { OSMDColor } from "../Common/DataObjects/OSMDColor";
import { Fonts } from "../Common/Enums/Fonts";
import { FontStyles } from "../Common/Enums/FontStyles";
/**
 * A text label on the graphical music sheet.
 * It is used e.g. for titles, composer names, instrument names and dynamic instructions.
 */
export declare class Label {
    constructor(text?: string, alignment?: TextAlignmentEnum, font?: Fonts);
    text: string;
    color: OSMDColor;
    colorDefault: string;
    font: Fonts;
    fontStyle: FontStyles;
    fontHeight: number;
    textAlignment: TextAlignmentEnum;
    ToString(): string;
}
