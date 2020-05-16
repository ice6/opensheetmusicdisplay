import Vex from "vexflow";
import { GraphicalNote } from "../GraphicalNote";
import { Note } from "../../VoiceData/Note";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { OctaveEnum } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
/**
 * The VexFlow version of a [[GraphicalNote]].
 */
export declare class VexFlowGraphicalNote extends GraphicalNote {
    constructor(note: Note, parent: GraphicalVoiceEntry, activeClef: ClefInstruction, octaveShift?: OctaveEnum, graphicalNoteLength?: Fraction);
    octaveShift: OctaveEnum;
    vfpitch: [string, string, ClefInstruction];
    vfnote: [Vex.Flow.StaveNote, number];
    private clef;
    /**
     * Update the pitch of this note. Necessary in order to display accidentals correctly.
     * This is called by VexFlowGraphicalSymbolFactory.addGraphicalAccidental.
     * @param pitch
     */
    setPitch(pitch: Pitch): void;
    /**
     * Set the VexFlow StaveNote corresponding to this GraphicalNote, together with its index in the chord.
     * @param note
     * @param index
     */
    setIndex(note: Vex.Flow.StaveNote, index: number): void;
    /**
     * Gets the clef for this note
     */
    Clef(): ClefInstruction;
    /**
     * Gets the id of the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGId(): string;
    /**
     * Gets the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGGElement(): SVGGElement;
}
