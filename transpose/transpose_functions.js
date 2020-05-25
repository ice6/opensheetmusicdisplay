

    

    // create namespace if it does not exist yet
    var osmd_transpose = osmd_transpose || {};

    osmd_transpose.version = "2020-05-24";
    console.log("IN tranpose_functions.js Version: %s", osmd_transpose.version);

  
    // add items to the namespace

    (function() {
        // scan from <step>D</step>
        this.get_xml_value = function(sline)
        {
            let ipos = sline.indexOf("<");
            if (ipos < 0)
                return("");

            let stext = sline.substr(ipos);
            // skip first <>
            let ipos2 = stext.indexOf(">");
            stext = stext.substr(ipos2+1);
            let ipos3 = stext.indexOf("<");
            stext = stext.substr(0, ipos3);
            return(stext);
        }

        this.get_xml_number = function(sline)
        {
            let value = this.get_xml_value(sline);
            if (value == "")
                value = 0;
            return (Number(value));
        }

        // <dynamics default-x="6.58" default-y="-40.00" relative-y="-40.00">
        this.get_xml_attribute = function(sline, name)
        {
            let ipos = sline.indexOf("<");
            if (ipos < 0)
            {   
                console.log("VALUE NOT FOUND: %s in SLINE: %s", name, sline);
                return("");
            }

            let stext = sline.substr(ipos + 1);
            let ipos2 = stext.indexOf(" ");
            if (ipos2 >= 0)
                stext = stext.substr(ipos2 + 1);

            // skip first <>
            let ipos3 = stext.indexOf(name + "=");
            if (ipos3 < 0)
            {   
                console.log("VALUE NOT FOUND: %s in SLINE: %s STEXT: %s", name, sline, stext);
                return("");
            }
            stext = stext = stext.substr(ipos3);

            let ipos4 = stext.indexOf("=");
            if (ipos4 < 0)
            {   
                console.log("VALUE NOT FOUND: %s in SLINE: %s STEXT: %s", name, sline, stext);
                return("");
            }

            stext = stext.substr(ipos4 + 1);
            stext = stext.trim();

            //console.log("stext.substr(0,1): %s ==: %s", stext.substr(0,1), stext.substr(0,1) == '"');
            if (stext.substr(0,1) == '"')
            {
                // strip off quotes - we are not scanning for nested quotes
                stext = stext.substr(1);
                let ipos5 = stext.indexOf('"');
                //console.log("IPOS5: %s", ipos5);
                if (ipos5 >= 0)
                {
                    svalue = stext.substr(0, ipos5);
                    return(svalue);
                }
                console.log("VALUE NOT FOUND: %s in SLINE: %s STEXT: %s", name, sline, stext);
            
            }

            if (stext.substr(0,1) == "'")
            {
                // strip off quotes - we are not scanning for nested quotes
                stext = stext.substr(1);
                let ipos5 = stext.indexOf("'");
                if (ipos5 >= 0)
                {
                    svalue = stext.substr(0, ipos5);
                    return(svalue);
                }
            
            }


            console.log("VALUE NOT FOUND: %s in SLINE: %s STEXT: %s", name, sline, stext);
            return("");

        }

        this.get_xml_attribute_number = function(sline, name)
        {
            let value = this.get_xml_attribute(sline, name);
            if (value == "")
                value = 0;
            //console.log("SLINE: %s NAME: %s VALUE: %s", sline, name, value);
            return (Number(value));
        }



    }).apply(osmd_transpose);    
     



    // this has to mave room for offsets of -12 to 12
    osmd_transpose.line_of_fifths = [
        // 0
            "Db", "Ab", "Eb", "Bb", "F", "C", "G",
            "D", "A", "E", "B", "Gb", "Db", "Ab",      
            "Eb", "Bb", "F", "C", "G", "D", "A",

            "E", "B",
        // 23 start here
            "Gb", "Db", "Ab", "Eb", "Bb",
            "F", "C", "G", "D", "A", "E", "B",
            "F#", "C#", "G#", "D#", "A#",
        // 40
            "F", "C",
            "G", "D", "A", "E", "B", "F#", "C#",
            "G#", "D#", "A#", "F", "C", "G", "D", 
    ];

    // generate letters for each new line_)of_fifths number
    osmd_transpose.line_of_fifths_numbers = {
        "Gb": 23,
        "Db": 24,
        "Ab": 25,
        "Eb": 26, 
        "Bb": 27,
        "F": 28, "E#": 28,
        "C": 29, "B#": 29,
        "G": 30,
        "D": 31,
        "A": 32,
        "E": 33, "Fb": 33,
        "B": 34, "Cb": 34,
        "F#": 35,
        "C#": 36,
        "G#": 37,
        "D#": 38,
        "A#": 39,
    };

    // ## and bb do not work yet
    osmd_transpose.accidentals_in_key = {
        "C": {"C": "", "D": "", "E": "", "F": "", "G": "", "A": "", "B": ""},
        "F": {"C": "", "D": "", "E": "", "F": "", "G": "", "A": "", "B": "flat"},
        "Bb": {"C": "", "D": "", "E": "flat", "F": "", "G": "", "A": "", "B": "flat"},
        "Eb": {"C": "", "D": "", "E": "flat", "F": "", "G": "", "A": "flat", "B": "flat"},
        "Ab": {"C": "", "D": "flat", "E": "flat", "F": "", "G": "", "A": "flat", "B": "flat"},
        "Db": {"C": "", "D": "flat", "E": "flat", "F": "", "G": "flat", "A": "flat", "B": "flat"},
        "Gb": {"C": "", "D": "flat", "E": "flat", "F": "flat", "G": "flat", "A": "flat", "B": "flat"},
        "Cb": {"C": "flat", "D": "flat", "E": "flat", "F": "flat", "G": "flat", "A": "flat", "B": "flat"},


        "G": {"C": "", "D": "", "E": "", "F": "sharp", "G": "", "A": "", "B": ""},
        "D": {"C": "sharp", "D": "", "E": "", "F": "sharp", "G": "", "A": "", "B": ""},
        "A": {"C": "sharp", "D": "", "E": "", "F": "sharp", "G": "sharp", "A": "", "B": ""},
        "E": {"C": "sharp", "D": "sharp", "E": "", "F": "sharp", "G": "sharp", "A": "", "B": ""},
        "B": {"C": "sharp", "D": "sharp", "E": "", "F": "sharp", "G": "sharp", "A": "sharp", "B": ""},
        "F#": {"C": "sharp", "D": "", "E": "sharp", "F": "sharp", "G": "sharp", "A": "sharp", "B": ""},
        "C#": {"C": "sharp", "D": "", "E": "sharp", "F": "sharp", "G": "sharp", "A": "sharp", "B": "sharp"},
        "G#": {"C": "sharp", "D": "", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},
        "D#": {"C": "##", "D": "sharp", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},

    };

    osmd_transpose.note_letters_flat = ["", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    osmd_transpose.note_letters_sharp = ["", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    osmd_transpose.sharp_flat_from_note = {
        "C": "b",
        "C#": "#",
        "Db": "b",
        "D": "#",
        "D#": "#",
        "Eb": "b",
        "E": "#",
        "E#": "#",
        "Fb": "b",
        "F": "b", 
        "F#": "#",
        "Gb": "b",
        "G": "#",
        "G#": "#",
        "Ab": "b", 
        "A": "#",
        "A#": "#",
        "B": "#",
        "B#": "#",
        "Cb": "b", 
    };

    osmd_transpose.note_numbers = {
            
        "B#" : 1,
        "C" : 1,
        "C#" : 2,
        "Db" : 2,
        "D" : 3,
        "D#" : 4,
        "Eb" : 4,
        "E" : 5,

        "Fb" : 5,
        "E#" : 6,

        "F" : 6,
        "F#" : 7,
        "Gb" : 7,
        "G" : 8,
        "G#" : 9,
        "Ab" : 9,
        "A" : 10,
        "A#" : 11,
        "Bb" : 11,
        "B" : 12,
        "Cb" : 12,
    };

    



    // when to bump the octave
    osmd_transpose.step_number = {
        "C" : 0,
        "D" : 1,
        "E" : 2,
        "F" : 3,
        "G" : 4,
        "A" : 5,
        "B" : 6,      
    };

    osmd_transpose.note_from_step = ["C", "D", "E", "F", "G", "A", "B"];

    // this is the center line note and octave for each clef sign and line
    osmd_transpose.clef_positions = [];
    //                   Sign Line
    osmd_transpose.clef_positions["G"] = [];
    osmd_transpose.clef_positions["G"][1] = {middle_letter: "D", middle_octave: 5, middle_number: 1};
    osmd_transpose.clef_positions["G"][2] = {middle_letter: "B", middle_octave: 4, middle_number: 6};
    osmd_transpose.clef_positions["G"][3] = {middle_letter: "G", middle_octave: 4, middle_number: 4};
    osmd_transpose.clef_positions["G"][4] = {middle_letter: "E", middle_octave: 4, middle_number: 2};
    osmd_transpose.clef_positions["G"][5] = {middle_letter: "C", middle_octave: 4, middle_number: 0};


    osmd_transpose.clef_positions["F"] = [];
    osmd_transpose.clef_positions["F"][1] = {middle_letter: "C", middle_octave: 3, middle_number: 0};
    osmd_transpose.clef_positions["F"][2] = {middle_letter: "A", middle_octave: 3, middle_number: 5};
    osmd_transpose.clef_positions["F"][3] = {middle_letter: "F", middle_octave: 3, middle_number: 3};
    osmd_transpose.clef_positions["F"][4] = {middle_letter: "D", middle_octave: 3, middle_number: 1};
    osmd_transpose.clef_positions["F"][5] = {middle_letter: "B", middle_octave: 2, middle_number: 6};


    osmd_transpose.clef_positions["C"] = [];
    osmd_transpose.clef_positions["C"][1] = {middle_letter: "G", middle_octave: 4, middle_number: 4};
    osmd_transpose.clef_positions["C"][2] = {middle_letter: "E", middle_octave: 4, middle_number: 2};
    osmd_transpose.clef_positions["C"][3] = {middle_letter: "C", middle_octave: 4, middle_number: 0};
    osmd_transpose.clef_positions["C"][4] = {middle_letter: "A", middle_octave: 3, middle_number: 5};
    osmd_transpose.clef_positions["C"][5] = {middle_letter: "F", middle_octave: 3, middle_number: 3};
  

    osmd_transpose.old_key;
    osmd_transpose.new_key;

    // all measures
    osmd_transpose.measure_data_array = [];
    var measure_data_array = osmd_transpose.measure_data_array; // for debugging

    // all notes
    osmd_transpose.note_array = [];
    var note_array = osmd_transpose.note_array; // for debugging

    // all chords
    osmd_transpose.chord_array = [];
    var chord_array = osmd_transpose.chord_array; // for debugging



    osmd_transpose.transpose = function(old_step, old_alter, old_octave) 
    {
        let parameters = this.parameters;
        let show_output = parameters.show_output;

        if (show_output)
            console.log("transpose(): old_step: %s old_alter: %s old_octave: %s", old_step, old_alter, old_octave)
        let old_note = old_step;
        if (old_alter == 1)
            old_note += "#";
        else if (old_alter == -1)
            old_note += "b";

        // move to local variables for easier access
        let old_key = this.old_key;
        let new_key = this.new_key;
        
        
        if (show_output)
            console.log("old_key: %s new_key: %s old_note: %s", old_key, new_key, old_note);

        let old_key_number = this.note_numbers[old_key];
        let new_key_number = this.note_numbers[new_key];
        let key_offset = new_key_number - old_key_number;

        let up_offset = (key_offset + 12) % 12; // move up
        let down_offset = (key_offset - 12) % 12; // move down

        if (parameters.transpose_direction == "up")
            key_offset = up_offset; // move up
        else if (parameters.transpose_direction == "down")
            key_offset = down_offset; // move down
        else    // closest
        {
            // get closest offset
            
            if (Math.abs(up_offset) <= Math.abs(down_offset))
                key_offset = up_offset;
            else
                key_offset = down_offset;
        }
        
        let new_fifths = this.line_of_fifths_numbers[new_key] - this.line_of_fifths_numbers["C"];
        //console.log("old_key: %s new_key: %s key_offset: %s new_fifths: %s", old_key, new_key, key_offset, new_fifths);

        let kpos1 = this.line_of_fifths_numbers[old_key];
        let kpos2 = this.line_of_fifths_numbers[new_key];
        let fifths_offset = kpos2 - kpos1;
        let  npos1 = this.line_of_fifths_numbers[old_note]; 
        let npos2 = npos1 + fifths_offset;
        let new_note = this.line_of_fifths[npos2];
        //console.log("npos1: %s npos2: %s fifths_offset: %s new_note: %s",
        //    npos1, npos2, fifths_offset, new_note);
        let new_step = new_note.substr(0,1);
        let new_alter = "";
        if (new_note.substr(1,1) == '#')
            new_alter = "1";
        else if (new_note.substr(1,1) == 'b')
            new_alter = "-1";

        // offset octave
        //old_note_number = this.note_numbers[old_note];
        //new_note_number = this.note_numbers[new_note];
        let old_step_number = this.step_number[old_step];
        let new_step_number = this.step_number[new_step];

        let new_octave = Number(old_octave);    // ADH - calculate change of octave
        if (key_offset > 0 && new_step_number < old_step_number)
            new_octave += 1;
        else if (key_offset < 0 && new_step_number > old_step_number)
            new_octave -= 1;
        
        if (show_output)
            console.log(`npos1: %s npos2: %s old_octave: %s old_step: %s old_step_number: %s 
                new_step: %s new_step_number: %s new_alter: %s new_octave: %s`, 
                npos1, npos2, old_octave, old_step, old_step_number, new_step, new_step_number, new_alter, new_octave);
        transposed_note = {
            "note": new_note,
            "step": new_step,
            "alter": new_alter,
            "octave": new_octave,
        };
        return (transposed_note);
    }



    // parameters used:
    // transpose_key e.g. "Bb"
    // transpose_direction - "up" or "down" (use closest if not set)
    // song_name - not currently used
    // show_output - true to show all console.logs

    osmd_transpose.str_out = "";
    osmd_transpose.pass = 0;

    var attributes = {divisions: 0, 
        time: {beats: 0, beat_type: 0}, 
        key: {fifths: 0, mode: null},
        staves: null, clef: []};



    
    osmd_transpose.transpose_xml = function(parameters, xml_string_in)
    {
        this.parameters = parameters;
        let xml_string = xml_string_in;

        console.log("transpose_xml: transpose_key: %s xml_string_in.length: %s", parameters.transpose_key, xml_string_in.length);
        if (parameters.transpose_key == "None")
            return(xml_string);

        show_output = this.parameters.show_output;

        // move some namespace variables to local variables for easier access
        let old_key = this.old_key;
        let new_key = this.new_key;
        let measure_data_array = this.measure_data_array;

        let str_in = xml_string.split("\n");
        if (show_output)
            console.log("transpose_xml lines: %s", str_in.length);

        // in pass 1 we get certain parameters per measure
        // to start with just the number of voices
        for (this.pass = 1; this.pass <= 2; this.pass++)
        {
            console.log("\n*** this.pass %s ***\n", this.pass);

            this.str_out = "";

            // save data for elements
        
        
            let note_array_index = 0;
            let chord_array_index = 0; // 1 will be used first




        
            // what type of element are we in?
            let in_type = {measure: false, clef: false, note: false, rest: false, 
                pitch: false, root: false , bass: false, notations: false, lyric: false};
            

            
            let clef_number = null;

            let clef = {};
        
        

            this.current_accidentals = []; // accidental for octave and note

            let measure_number = 0; // measure count 



            
            let show_debugs = false;    // to display output for only certain measures
            let measure_data = {};
        


            //str_out = "this.pass: " + this.pass + "\n";

            if (this.pass == 1)
            {
                // we store read ahead data in pass 1
                measure_data_array.length = 0;  // reset
     
            }
            else if (this.pass == 2)
            {
                
                
            }
            measure_data = {};  // no measure yet
            measure_number = 0; // measure count
            for (let iline = 0; iline < str_in.length; iline++)
        {
                let sline = str_in[iline];
                if (show_output && this.pass == 2)
                    console.log("%s sline: %s", iline, sline);

                //if (this.pass == 2)
                //    console.log("%s sline: %s", iline, sline);

                if (sline.indexOf("<attributes") >= 0)
                {
                    in_type.attributes = true;
                    // fall through
                }
                if (sline.indexOf("/attributes") >= 0)
                {
                    in_type.attributes = false;
                    // fall through to write sline
                }

                if (in_type.attributes)
                {
            //  divisions element indicates how many divisions per quarter note are used to indicate a note's duration
            //  <divisions>256</divisions>
            if (sline.indexOf("<divisions>") >= 0)
            {
                        attributes.divisions = this.get_xml_number(sline);
                        if (show_output)
                            console.log("attributes.divisions: %s SLINE: %s", attributes.divisions, sline);
                    }
                    // <time>
                    //  <beats>4</beats>
                    //  <beat-type>4</beat-type>
                    // </time>
                    if (sline.indexOf("<beats>") >= 0)
                    {
                        attributes.time.beats = this.get_xml_number(sline);
                        if (show_output)
                            console.log("attributes.time.beats: %s SLINE: %s", attributes.time.beats, sline);
                    }
                    if (sline.indexOf("<beat-type>") >= 0)
                    {
                        attributes.time.beat_type = this.get_xml_number(sline);
                if (show_output)
                            console.log("attributes.time.beat_type: %s SLINE: %s", attributes.time.beat_type, sline);
                    }
                    if (sline.indexOf("<staves>") >= 0)
                    {
                        attributes.staves = this.get_xml_number(sline);
                        if (show_output)
                            console.log("attributes.staves: %s SLINE: %s", attributes.staves, sline);
                    }
                    // fall through to write sline
                }

                if (sline.indexOf("<clef-octave-change>") >= 0)
                {
                    if (in_type.clef)
                    {
                        clef.octave_change = this.get_xml_number(sline);
                        //console.log("clef.octave_change: %s", clef.octave_change);
                    }
                    else
                    {
                        console.log("item not in clef element: " + sline);
                    }
                    
                    this.add_to_output(sline); // copy to output
                    continue;   // to not confuse woth <clef ...
                }
                
                if (sline.indexOf("<clef") >= 0)
                {
                    /***
                    <clef number="1">
                    <sign>G</sign>
                    <line>2</line>
                    </clef>
                    <clef number="2">
                        <sign>F</sign>
                        <line>4</line>
                        </clef>
                    </attributes>

                    or just
    f
                    <clef number="1">

                    and perhaps
                    <clef-octave-change>-1</clef-octave-change>

                    ***/
                    // we want to ocrtave and note on the middle line
                    // note: muse_score does not use clef numbers
                    if (sline.indexOf("<clef>") >= 0)
                        clef_number = 0;
                    else
                        clef_number = this.get_xml_attribute_number(sline, "number");
                    in_type.clef = true;
                    clef = {number: clef_number, sign: null, line: null, octave_change: 0, middle_octave: 0, 
                            middle_number: 0, middle_letter: ""}
                    //console.log("<CLEF: number: %s SLINE: %s", clef_number, sline);
                    

                    // fall through to output

                }

                if (sline.indexOf("</clef") >= 0)
                {
                    
                    // we want the octave and note step number of the middle line.
                    // step_mumbers:
                    //  C D E F G A B
                    //  0 1 2 3 4 5 6
                    clef_position = this.clef_positions[clef.sign][clef.line];
                    if (clef_position)
                    {
                        // we can transpose this clef
                        clef.do_transpose = true;
                        clef.middle_letter = clef_position.middle_letter;
                        clef.middle_number = clef_position.middle_number;
                        clef.middle_octave = clef_position.middle_octave;
                        if (clef.octave_change)
                        {
                            clef.middle_octave += clef.octave_change;
                            //console.log("OCTAVE CHANGE: %s new middle_octave: %s", clef.octave_change, clef.middle_octave);
                        }
                        //console.log("</CLEF: %s SIGN: %s LINE: %s middle: %s %s octave: %s",
                         //s   clef.number, clef.sign, clef.line, clef.middle_number, clef.middle_letter, clef.middle_octave)
                    }
                
                
                    attributes.clef[clef_number] = clef;
                    
                    
                    // fall through to output

                }

                if (in_type.clef)
                {
                    if (sline.indexOf("<sign") >= 0)
                    {
                        clef.sign = this.get_xml_value(sline);
                        //console.log("clef.sign: %s", clef.sign); 
                        


                    }
                    if (sline.indexOf("<line") >= 0)
                    {
                        clef.line = this.get_xml_number(sline);
                        //console.log("clef.line: %s", clef.line);
                            


                    }
                    // fall through to output
            }

            if (sline.indexOf("<measure") >= 0)
            {
                // break grouped notes at measure
                    measure_number++;
                if (show_output)
                        console.log("MEASURE: %s: %s", measure_number, sline);

                    if (this.pass == 1)
                    {
                        
                        measure_data_array[measure_number] = {measure_number: measure_number,
                            beam_data_array: [], staff_data_array: []};
                        //console.log("measure_data_array SET this.pass 1: measure_number: %s measure_data_array set: %s", 
                        //   measure_number, measure_data_array[measure_number].measure_number);
                    }
                    measure_data = measure_data_array[measure_number];
                    measure_data.beam_index = 0; // position of beam_data in array


  	
                    this.current_accidentals.length = 0;

            }


            if (sline.indexOf("</measure") >= 0)
            {
            }

            // <fifths>-4</fifths>
            if (sline.indexOf("</fifths") >= 0)
            {
                    attributes.key.fifths = this.get_xml_number(sline);
                if (show_output)
                        console.log("SLINE: %s attributes.key.fifths: %s", sline, attributes.key.fifths);
                    let line_of_fifths_c = this.line_of_fifths_numbers["C"];
                    let old_key_number = attributes.key.fifths + line_of_fifths_c;
                this.old_key = this.line_of_fifths[old_key_number];
                if (show_output)
                        console.log("attributes.key.fifths: %s old_key_number: %s old_key: %s", attributes.key.fifths, old_key_number, this.old_key);

                this.new_key = parameters.transpose_key;
                    let new_line_of_fifths_number = this.line_of_fifths_numbers[this.new_key] - line_of_fifths_c;
                if (show_output)
                    console.log("<fifths>%s</fifths> old_key: %s new_key: %s \n", new_line_of_fifths_number, this.old_key, this.new_key);
                        
                    this.add_to_output(`<fifths>` + new_line_of_fifths_number + `</fifths>`);
                
                    this.current_accidentals.length = 0;

                // musescore puts mode on the same line as fifths
                    let ipos = sline.indexOf("</fifths");
                sline = sline.substr(ipos + 9);
                sline = sline.trim();
 
                if (sline == "")
                        continue;   // nothing left
                    // fall thorugh to output

            }


            // skip note-size alike, conflict with note element
                if (sline.indexOf('<note-') > -1) 
                {
                    this.add_to_output(sline); // copy to output
                    continue;   // to not confuse woth <note ,,,
            }


            if (sline.indexOf("<note") >= 0)
            {
                    in_type.note = true;

                    // preset voice and staff in case they are not set
                    // staff 0 and voice 0 do not get written out
                    note_index = note_array_index++;
                    if (this.pass == 1)
                    {
                        note = {index: note_index, rest: null, chord: null,  chord_index: null, first_chord_note: false,
                            pitch: null, duration: null, 
                        instrument: null, voice: 0, type: null, dot: null, accidental: null, stem: null, staff: 0,
                            notations: null, lyric: null, beam_status_array: [] };

                        this.note_array[note_index] = note;
                    }
                    else
                    {
                        note = note_array[note_index];  // reuse entry from pass 1
                        //console.log("NOTE: %s first_chord_note: %s", note.index, note.first_chord_note);
                    }

                note_start = sline.trim(); // to put out later
                additional_note_items = "";

                    // lets get the beat of the note in the measure
                    // need to track durations by voice and staff

                    continue; // output after </note


            } 
            if (sline.indexOf("</note") >= 0)
            {
                    staff_data = this.get_staff_data(measure_data, note.staff);
                    if (this.pass == 1)
                    {
                        if (note.voice > 0)
                        {
                            if (!staff_data.min_voice)
                                staff_data.min_voice = note.voice;
                            else 
                                staff_data.min_voice = Math.min(staff_data.min_voice, note.voice);
                            if (!staff_data.max_voice)
                                staff_data.max_voice = note.voice;
                            else 
                                staff_data.max_voice = Math.max(staff_data.max_voice, note.voice);
                        }
                        //console.log("SKIP IN PASS 1");

                    }

                note_xml = note_start + "\n";
                if (note.rest)
                {
                    note_xml += note.rest;
                }

                if (note.chord)
                {
                    note_xml += ` <chord/>\n`;
                }
                
                if (note.grace)
                    note_xml += note.grace;   // exactly as found

                if (note.pitch)
                {
                        note.pitch.step = transposed_note.step;
                        note.pitch.alter = transposed_note.alter;
                        note.pitch.octave = transposed_note.octave;

                    pitch_xml = ` <pitch>\n`;
                        pitch_xml += `  <step>` + note.pitch.step + `</step>\n`;
                        snew_step = note.pitch.step;
                        snew_note = note.pitch.step;
                    new_accidental = "";
                        if (note.pitch.alter == 1)
                    {
                        new_accidental = "sharp";
                        snew_note = snew_note + "#";
                            pitch_xml += `  <alter>` + note.pitch.alter + `</alter>\n`;
                    }
                        else if (note.pitch.alter == -1)
                    {
                        new_accidental = "flat";
                        snew_note = snew_note + "b";
                            pitch_xml += `  <alter>` + note.pitch.alter + `</alter>\n`;
                    }
                    

                    // see if we need a new accidental
                    current_accidental = this.get_current_accidental(note.voice, note.pitch.octave, snew_step);
                    if (show_output)
                        console.log("snew_step: %s snew_note: %s current_accidental: %s", snew_step, snew_note, current_accidental);

                    //current_accidental = current_accidentals[note.voice][note.pitch.octave][snew_note];
                    if (show_output)
                            console.log("snew_note: %s note.pitch.alter: %s note.voice: %s note.pitch.octave: %s current_accidental: %s new_accidental: %s",
                                snew_note, note.pitch.alter, note.voice, note.pitch.octave, current_accidental,  new_accidental);

                
                    if (current_accidental == new_accidental)
                    {
                        note.accidental = "";     // no change from key or last note
                    }
                    else if (new_accidental == "")
                    {
                        note.accidental = "natural";               
                    }
                    else 
                    {
                        note.accidental = new_accidental;
                    }
                        //if (show_debugs)
                        //    console.log("snew_note: %s note.pitch.alter: %s new_accidental: %s snew_note: %s note.accidental: %s",
                        //        snew_note, note.pitch.alter, new_accidental, snew_note, note.accidental);

                        // we should not need this
                        this.current_accidentals[note.voice][note.pitch.octave][snew_step] = new_accidental;

                        pitch_xml += `  <octave>` + note.pitch.octave + `</octave>\n`;
                        pitch_xml += ` </pitch>\n`;
                
                        note_xml += pitch_xml;
                        pitch_xml = "PTCH_XML";
                    
                    }

                    if (note.stem )
                    {
                        voice_data = this.get_voice_data(measure_data, note.staff, note.voice);


                        // get clef information
                        if (attributes.clef[note.staff])
                        {
                            clef = attributes.clef[note.staff];
                        }
                        else
                        {
                            clef = attributes.clef[0];    // MuseScore does not store clefs by staff number
                        }
                        //console.log("CLEF: middle: %s %s octave: %s NOTE: voice: %s step: %s octave: %s", 
                        //    clef.middle_number, clef.middle_letter, clef.middle_octave,
                        //    note.voice, note.pitch.step, note.pitch.octave);
                        
                        if (show_debugs)
                            console.log("staff_data: %s min_voice: %s max_voice: %s", staff_data.staff, staff_data.min_voice, staff_data.max_voice);
                            if (show_debugs)
                            console.log("NOTE: index: %s chord_index: %s first_chord_note: %s step: %s octave: %s", 
                            note.index, note.chord_index, note.first_chord_note, note.pitch.step, note.pitch.octave);
                        
                        
                        if (staff_data.min_voice && staff_data.min_voice < staff_data.max_voice)
                        {
                            if (note.voice >  staff_data.min_voice)
                            {
                                // this is only for staffs with multiple voices - which we need to locate
                                stem_direction = "down";    // other voices tend to go down
                                if (show_debugs)
                                    console.log("USE VOICE: %s STEM DOWN", note.voice);
                            }
                            else
                            { 
                                stem_direction = "up";    // other voices tend to go down
                                if (show_debugs)
                                    console.log("USE VOICE: %s STEM UP", note.voice);
                            }
                        }
                        else if (note.chord_index !== null)
                        {
                            // get highest and lowest position of notes in chord
                            if (show_debugs)
                                console.log("NOTE: %s chord_array[note.chord_index = %s]  first_chord_note: %s", 
                                    note.index, note.chord_index, note.first_chord_note);
                            let chord_data = this.chord_array[note.chord_index];
                            
                            if (this.pass == 1)
                            {
                                // we need to set for first note in chord in pass 2.
                                this.set_chord_range(note);
                            }

                            if (this.pass == 2)
                            {
                                if (note.first_chord_note)
                        {
                                    this.set_chord_range(note);
                        }

                                if (Math.abs(chord_data.max_offset) > Math.abs(chord_data.min_offset))
                        {
                                    stem_direction = "down"; 
                        }
                                else
                        {
                                    // we could handle "equal" differently
                                    stem_direction = "up"; 
                        }
                                if (show_debugs)
                                    console.log("PASS 2: CHORD index: %s max: %s min: %s stem_direction: %s", 
                                        note.chord_index, chord_data.max_offset, chord_data.min_offset, stem_direction);
                            }
                            
                        }
                        else
                        {
                            // are we above or below the center staff line

                            note_offset = this.get_note_offset(note);
                       
                            if (note_offset > 0)
                            {
                                note_position = "above";
                                stem_direction = "down";        
                        }
                            else if (note_offset < 0)
                        {
                                note_position = "below";
                                stem_direction = "up";
                        }
                        else
                        {
                                if (show_debugs)
                                    console.log("Middle line - last or down");
                                note_position = "middle";
                                if (voice_data.last_direction)
                                    stem_direction = voice_data.last_direction;
                                else
                                    stem_direction = "down"; 
                                if (show_debugs)
                                    console.log("ON MIDDLE LINE: %s", stem_direction);   
                            }
                        }

                        if (show_debugs)
                                    console.log("note.beam_status_array[1]: %s", note.beam_status_array[1]);
                        // lets only combine notes in first beam for now
                        if (note.beam_status_array[1])
                        {
                            beam_status = note.beam_status_array[1];
                            if (beam_status == "begin")
                            {
                                measure_data.beam_index++;
                                if (this.pass == 1)
                                {
                                    measure_data.beam_data_array[measure_data.beam_index] = {notes: 0, above_count: 0, below_count: 0};
                                    if (show_debugs)
                                        console.log("START beam_data_array[%s]", measure_data.beam_index);
                                }
                            }
                            beam_data = measure_data.beam_data_array[measure_data.beam_index];
                            if (this.pass == 1)
                            {
                                beam_data.notes++;
                                if (note_position == "above")
                                    beam_data.above_count++;
                                else
                                    beam_data.below_count++;
                                if (show_debugs)
                                    console.log("COUNT BEAM above: %s below: %s", 
                                        beam_data.above_count, beam_data.below_count);


                            }
                            else 
                            {
                                // pass == 2
                                if (beam_data.above_count > beam_data.below_count)
                                {
                                    stem_direction = "down"; 
                                }
                                else
                                {
                                    stem_direction = "up"; 
                                }
                                if (show_debugs)
                                    console.log("USE BEAM above: %s below: %s stem_direction: %s", 
                                        beam_data.above_count, beam_data.below_count, stem_direction);
                            }
                        }

                        if (this.pass == 2)
                        {
                            if (show_debugs)
                                console.log("USE STEM_DIRECTION: %s", stem_direction);
                            note.stem = stem_direction;    
                        }
                        voice_data.last_direction = note.stem;

            
                        
                        //throw("STEM");
                }

                /***
                        <note default-x="210">
                    <pitch>
                            <step>A</step>
                            <octave>5</octave>
                    </pitch>
                        <duration>2</duration>
                        <voice>1</voice>
                        <type>16th</type>
                        <accidental>natural</accidental>
                        <stem default-y="-22">down</stem>
                        <staff>1</staff>
                        <beam number="1">end</beam>
                        <beam number="2">end</beam>
                    </note>
                 */

                if (note.duration !== null)
                    note_xml += ` <duration>` + note.duration + `</duration>\n`;
                if (note.tie)
                    note_xml += note.tie;   // exactly as found
                    if (note.instrument !== null)
                        note_xml += note.instrument;   // exactly as found
                    if (note.voice !== 0)
                    note_xml += ` <voice>` + note.voice + `</voice>\n`;
                if (note.type)
                    note_xml += ` <type>` + note.type + `</type>\n`;
                if (note.dot)
                    note_xml += `<dot/>\n`;
                if (note.accidental && note.accidental != "")
                {
                        //if (show_debugs)
                        //    console.log("<accidental>%s</accidental>\n", note.accidental);
                    note_xml += `<accidental>` + note.accidental + `</accidental>\n`;
                }
                if (note.stem)
                    note_xml += ` <stem>` + note.stem + `</stem>\n`;

                    

                    if (note.staff !== 0)
                    note_xml += ` <staff>` + note.staff + `</staff>\n`;

                if (additional_note_items)
                {
                    note_xml += additional_note_items;
                }

                    if (note.notations)
                    {
                        note_xml += note.notations;
                    }
                    
                    if (note.lyric)
                    {
                        note_xml += note.lyric;
                    }
                    
                    note_xml += `</note>`;

                //console.log("note_xml: %s", note_xml);
                    //throw("NOTE STEM");

                    this.add_to_output(note_xml);
                    note_xml = "NOTE_XML";
                    in_type.note = false;

                    continue;   // skip default output

            }

                if (in_type.note)
            {
                if (sline.indexOf("<duration>") >= 0)
                {
                    note.duration = this.get_xml_number(sline);
                    //console.log("note.duration: %s", note.duration);
                    continue;   // output later
                }

                if (sline.indexOf("<grace") >= 0)
                {
                    note.grace = sline + "\n";   // save entire line
                        //console.log("note.grace: %s", note.grace);
                        continue;   // output later

                    }

                    if (sline.indexOf("<notations") >= 0)
                    {
                        note.notations = sline + "\n";   // save entire line
                        //console.log("note.notations: %s", note.notations);
                        in_type.notations = true;
                        continue;   // output later

                    }

                    if (in_type.notations)
                    {
                        note.notations += sline + "\n";
                        if (sline.indexOf("</notations") >= 0)
                            in_type.notations = false;
                        continue;   // output later
                    }

                    if (sline.indexOf("<lyric") >= 0)
                    {
                        note.lyric = sline + "\n";   // save entire line
                        //console.log("note.lyric: %s", note.lyric);
                        in_type.lyric = true;
                        continue;   // output later

                    }

                    if (in_type.lyric)
                    {
                        note.lyric += sline + "\n";
                        if (sline.indexOf("</lyric") >= 0)
                            in_type.lyric = false;
                    continue;   // output later
                }

                if (sline.indexOf("<tied") >= 0)
                {
                        note.tied = sline + "\n";   // save entire line
                        //console.log("note.tied: %s", note.tied);
                        continue;   // output later
                }
                    
                    if (sline.indexOf("<tie") >= 0)
                {
                    note.tie = sline + "\n";   // save entire line
                        //console.log("note.tie: %s", note.tie);
                    continue;   // output later

                    }
                    if (sline.indexOf("<instrument") >= 0)
                    {       
                        note.instrument = sline + "\n"; // copy to output
                        //console.log("note.instrument: %s", note.instrument);
                        continue;   // output later

                }
                if (sline.indexOf("<voice>") >= 0)
                {
                    note.voice = this.get_xml_number(sline);
                    //console.log("note.voice: %s", note.voice);
                    continue;   // output later
                }
                if (sline.indexOf("<type>") >= 0)
                {
                    note.type = this.get_xml_value(sline);
                    //console.log("note.type: %s", note.type);
                    continue;   // output later
                };
                if (sline.indexOf("<dot") >= 0)
                {
                    note.dot = true
                    continue;   // output later
                }
                if (sline.indexOf("<staff>") >= 0)
                {
                    note.staff = this.get_xml_number(sline);
                    //console.log("note.staff: %s", note.staff);
                    continue;   // output later

                    }
                    if (sline.indexOf("<beam") >= 0)
                    {
                        // <beam number="1">end</beam>
                        beam_number = this.get_xml_attribute_number(sline, "number");
                        beam_status = this.get_xml_value(sline);
                        note.beam_status_array[beam_number] = beam_status;
                        //console.log("beam_status_array[%s]: %s", beam_number, note.beam_status_array[beam_number]);
                        // fall through to output
                }
                // <rest>
                // <display-step>C</display-step>
                // <display-octave>4</display-octave>
                // </rest>
                // or
                // <rest/>
                    // <rest />  (Sibleius addes a space)
                    if (sline.indexOf("<rest/>") >= 0|| sline.indexOf("<rest />") >= 0)
                {
                    note.rest = sline.trim() + "\n";
                    //console.log("note.rest: %s", note.rest);
                    continue;   // output later
                }
                if (sline.indexOf("<rest>") >= 0)
                {
                    note.rest = sline.trim() + "\n";
                        in_type.rest = true;
                    //console.log("note.rest: %s", note.rest);
                    continue;   // output later
                }
                    if (in_type.rest)
                {
                    note.rest += sline.trim() + "\n";
                    if (sline.indexOf("</rest>") >= 0)
                            in_type.rest = false;
                        continue;   // output later

                }
                if (sline.indexOf("<chord") >= 0)
                {
                        if (this.pass == 1)
                        {
                    note.chord = true;
                            //console.log("chord_array_index = %s", chord_array_index);
                            //console.log("PASS: %s note_array[%s].chord_index: %s", 
                            //    this.pass, note.index - 1, this.note_array[note.index - 1].chord_index);
                            // set for previous note
                            if (!this.note_array[note.index - 1].chord_index)
                            {    
                                // first <chord is on second note in chord     
                                chord_array_index++; // bump index if first chord entry in chord notes 
                                            
                                this.note_array[note.index - 1].chord_index = chord_array_index;
                                this.note_array[note.index - 1].first_chord_note = true;    // add to min/max in pass 2
                                //console.log("SET (-1) note_array[%s].chord_index", note.index - 1, this.note_array[note.index - 1].chord_index);
                            
                                
                                this.chord_array[chord_array_index] = {index: chord_array_index, note_index: note.index - 1, 
                                    notes: 0, max_offset: null, min_offset: null, 
                                    stem_direction: null};
                                //console.log("SET chord_array[%s].note_index: %s", chord_array_index, note.index - 1);
                                
                            }
                            this.note_array[note.index].chord_index = chord_array_index;
                            //console.log("SET (note_array[%s].chord_index", note.index, this.note_array[note.index].chord_index);
  
                        }

                    //console.log("note.chord: %s", note.chord);
                    continue;   // output later

                        
            }

            // <pitch>
            //     <step>E</step>
            //     <alter>-1</alter>
            //     <octave>4</octave>S
            //     </pitch>
            if (sline.indexOf("<pitch") >= 0)
            {
                        in_type.pitch = true;

                note.pitch = {alter: 0, step: 0, octave: 0};
                new_accidental = "";
                continue;   // output later
            }
            if (sline.indexOf("</pitch") >= 0)
            {
                transposed_note = this.transpose(note.pitch.step, note.pitch.alter, note.pitch.octave);

                
                        in_type.pitch = false;
                continue;   // output later
            }
                
            
                    if (in_type.pitch)
            {
                if (sline.indexOf("<step") >= 0)
                {
                    note.pitch.step = this.get_xml_value(sline);

                }
                if (sline.indexOf("<alter") >= 0)
                {
                    note.pitch.alter = this.get_xml_number(sline);

                }
                if (sline.indexOf("<octave") >= 0)
                {
                    note.pitch.octave = this.get_xml_number(sline);

                }
                        continue;   // output later
            }

            // <accidental>sharp</accidental>
            // ADH - do we ever force 'natural'?
            // YES: We need to check against last accidental in this measure,
                    // and the accidentals in this key */
                
            if (sline.indexOf("<accidental>") >= 0)
            {
                        continue;   // we will output our own accidentals
            }

            // <stem>down</stem>
                    // <stem default-y="-22">down</stem>
                    if (sline.indexOf("<stem") >= 0)
            {
                        note.stem = this.get_xml_value(sline);
                        continue;   // output later
                }
                


                // items we do not process - but just add to <note>
                additional_note_items += " " + sline.trim() + "\n";
                    continue; // skip after additional

f
            }
            
            // transpose root
            // <root>
            // <root-step>A</root-step>
            // <root-alter>-1</root-alter>
            // </root>

            if (sline.indexOf("<root>") >= 0)
            {
                //console.log("START %s", sline);
                    in_type.root = true;
                root_alter = "";
                root_step = "";

            }
                
            
            if (sline.indexOf("</root>") >= 0)
            {
                //console.log("END %s root_step: %s ", sline, root_step);

                transposed_note = this.transpose(root_step, root_alter, 0);


                root_xml = `<root>
                <root-step>` + transposed_note.step + `</root-step>\n`
                if (transposed_note.alter != 0)
                root_xml += `     <root-alter>` + transposed_note.alter + `</root-alter>\n`;

                
                    root_xml += `</root>`;
                //console.log("root_XML: %s", root_xml);
                    this.add_to_output(root_xml);
                    root_xml = "ROOT_XML";
                    in_type.root = false;

            }
                
                if (in_type.root)
            {
                if (show_output)
                    console.log("IN ROOT: %s", sline);
                if (sline.indexOf("<root-step") >= 0)
                {
                    root_step = this.get_xml_value(sline);
                    if (show_output)
                        console.log("ROOT_STEP; %s", root_step);

                }
                else if (sline.indexOf("<root-alter") >= 0)
                {
                    root_alter = this.get_xml_number(sline);
                    if (show_output)
                        console.log("root_alter; %s", root_alter);

                }
                else
                    throw("Unknown ROOT line: " + sline);
            }

            

            // transpose bass
            // <bass>
            // <bass-step>A</bass-step>
            // <bass-alter>-1</bass-alter>
            // </bass>

            if (sline.indexOf("<bass>") >= 0)
            {
                if (show_output)
                    console.log("START BASS %s", sline);
                    in_type.bass = true;
                bass_alter = "";
                bass_step = "";

            }
                
            
            if (sline.indexOf("</bass>") >= 0)
            {
                if (show_output)
                    console.log("END %s bass_step: %s ", sline, bass_step);

                transposed_note = this.transpose(bass_step, bass_alter, 0);


                bass_xml = `<bass>\n`;
                bass_xml += ` <bass-step>` + transposed_note.step + `</bass-step>\n`;
                if (transposed_note.alter != 0)
                bass_xml += ` <bass-alter>` + transposed_note.alter + `</bass-alter>\n`;

                
                    bass_xml += `</bass>`;
                if (show_output)
                    console.log("bass_XML: %s", bass_xml);
                    this.add_to_output(bass_xml);
                    bass_xml = "BASS_XML";
                    in_type.bass = false;

            }
                
                if (in_type.bass)
            {
                if (show_output)
                    console.log("IN bass: %s", sline);
                if (sline.indexOf("<bass-step") >= 0)
                {
                    bass_step = this.get_xml_value(sline);
                    if (show_output)
                        console.log("bass_STEP; %s", bass_step);

                        }
                else if (sline.indexOf("<bass-alter") >= 0)
                {
                    bass_alter = this.get_xml_number(sline);
                    if (show_output)
                        console.log("bass_alter; %s", bass_alter);

                }
                else
                    throw("Unknown bass line: " + sline);
            }

                //if (sline.indexOf("<text>") >= 0)
                //    console.log("%s SLINE: %s", iline, sline);  // for debugging - show lyric
            
                if (this.pass == 2)
                {
                    //console.log("ADD DEFAULT TO OUTPUT: %s", sline);
                    this.add_to_output(sline); // copy to output
                }
            


            }
        } // end of pass loop
        
            

        xml_string_out = this.str_out;
        //console.log("NEW xml_string_out length: %s", xml_string_out.length);



        return(xml_string_out);
    }

    
    osmd_transpose.add_to_output = function(str)
    {
        //console.log("PASS: %s STR: %s", this.pass, str);
        if (this.pass == 1)
            return;
        
        this.str_out += str + "\n";
        //console.log("add_to_output PASS: %s LEN: %s STR: %s", this.pass, this.str_out.length, str);
        //console.log("STR_OUT: %s", this.str_out.substr(0, 100));

    }

    // steps above or below middle line of staff
    osmd_transpose.get_note_offset = function(note)
    {
        if (attributes.clef[note.staff])
        {
            clef = attributes.clef[note.staff];
        }
        else
        {
            clef = attributes.clef[0];    // MuseScore does not store clefs by staff number
        }
        note_offset = (note.pitch.octave - clef.middle_octave) * 7 + this.step_number[note.pitch.step] - clef.middle_number;
        //console.log("get_note_offset: pitch.octave: %s middle_octave: %s pitch.step]: %s %s middle_number: %s note_offset: %s", 
        //    note.pitch.octave, clef.middle_octave, note.pitch.step, this.step_number[note.pitch.step], clef.middle_number,
        //    note_offset);
        return(note_offset);
    }

    osmd_transpose.set_chord_range = function(note)
    {
        let chord_data = this.chord_array[note.chord_index];
        chord_data.notes++;

        note_offset = this.get_note_offset(note);
        if (chord_data.min_offset === null)
        {
            chord_data.min_offset = note_offset;
        }
        else
        {
            chord_data.min_offset = Math.min(chord_data.min_offset, note_offset);
        }
        if (chord_data.max_offset === null)
        {
            chord_data.max_offset = note_offset;
        }
        else
        {
            chord_data.max_offset = Math.max(chord_data.max_offset, note_offset);
        }
        // console.log("SET CHORD RANGE: note; %s chord_index: %s note_offset: %s min_offset: %s max_offset: %s",
        //    note.index, note.chord_index, note_offset, chord_data.min_offset, chord_data.max_offset);
    }
    

    // after you get this, and changes will automatically be stored in array
    osmd_transpose.get_current_accidental = function(voice, octave, note)
    {
        // we need to track accidentals by both voice and octave
        if (!this.current_accidentals[voice])
        {
            this.current_accidentals[voice] = [];
        }
        
        if (!this.current_accidentals[voice][octave])
        {
            // since this is an object, we need to clone it
            this.current_accidentals[voice][octave] = JSON.parse(JSON.stringify(this.accidentals_in_key[this.new_key]));
        }
        // see if we need "this.""
       // console.log("note: %s current_accidental: %s", note, this.current_accidentals[voice][octave][note]);
        return (this.current_accidentals[voice][octave][note]);
    }

    // after you get this, any changes to the returned object will automatically be stored in original array
    osmd_transpose.get_staff_data = function(measure_data, staff)
    {
        // we need to track accidentals by both voice and octave
        // voice_data_array has the current beam and voice data for each voice in the measure by staff
        if (!measure_data.staff_data_array[staff])
        {
            measure_data.staff_data_array[staff] = {staff: staff, min_voice: null, max_voice: null, voice_data_array: []};
        }
        
        return(measure_data.staff_data_array[staff]);
    }


    // after you get this, any changes to the returned object will automatically be stored in original array
    osmd_transpose.get_voice_data = function(measure_data, staff, voice)
    {
        // we need to track accidentals by both voice and octave
        staff_data = this.get_staff_data(measure_data, staff);
        if (!staff_data.voice_data_array[voice])
        {
            staff_data.voice_data_array[voice] = {last_direction: null, in_beam: false, beam_count: 0};
        }
        return(staff_data.voice_data_array[voice]);
    }

    // after you get this, any changes to the returned object will automatically be stored in original array
    osmd_transpose.get_beam_data = function(measure_data, staff, voice)
    {
        // we need to track accidentals by both voice and octave
        if (!measure_data.beam_data_array[staff])
        {
            measure_data.beam_data_array[staff] = [];
        }
        if (!measure_data.beam_data_array[staff][voice])
        {
            measure_data.beam_data_array[staff][voice] = [];
        }
        return(measure_data.beam_data_array[staff][voice]);
    }


    

