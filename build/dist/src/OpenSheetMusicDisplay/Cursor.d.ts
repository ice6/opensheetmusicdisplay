import { MusicPartManagerIterator } from "../MusicalScore/MusicParts/MusicPartManagerIterator";
import { MusicPartManager } from "../MusicalScore/MusicParts/MusicPartManager";
import { VoiceEntry } from "../MusicalScore/VoiceData/VoiceEntry";
import { OpenSheetMusicDisplay } from "./OpenSheetMusicDisplay";
import { GraphicalMusicSheet } from "../MusicalScore/Graphical/GraphicalMusicSheet";
import { Instrument } from "../MusicalScore/Instrument";
import { Note } from "../MusicalScore/VoiceData/Note";
/**
 * A cursor which can iterate through the music sheet.
 */
export declare class Cursor {
    constructor(container: HTMLElement, openSheetMusicDisplay: OpenSheetMusicDisplay);
    private container;
    cursorElement: HTMLImageElement;
    /** a unique id of the cursor's HTMLElement in the document.
     * Should be constant between re-renders and backend changes,
     * but different between different OSMD objects on the same page.
     */
    cursorElementId: string;
    private openSheetMusicDisplay;
    private rules;
    private manager;
    iterator: MusicPartManagerIterator;
    private graphic;
    hidden: boolean;
    /** Initialize the cursor. Necessary before using functions like show() and next(). */
    init(manager: MusicPartManager, graphic: GraphicalMusicSheet): void;
    /**
     * Make the cursor visible
     */
    show(): void;
    resetIterator(): void;
    private getStaffEntryFromVoiceEntry;
    update(): void;
    /**
     * Hide the cursor
     */
    hide(): void;
    /**
     * Go to next entry
     */
    next(): void;
    /**
     * reset cursor to start
     */
    reset(): void;
    private updateStyle;
    get Iterator(): MusicPartManagerIterator;
    get Hidden(): boolean;
    /** returns voices under the current Cursor position. Without instrument argument, all voices are returned. */
    VoicesUnderCursor(instrument?: Instrument): VoiceEntry[];
    NotesUnderCursor(instrument?: Instrument): Note[];
}
