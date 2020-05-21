export const TransposeConstant = {
    // this has to mave room for offsets of -12 to 12
    line_of_fifths: [
      // 0
      'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G',
      'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab',
      'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A',
  
      'E', 'B',
      // 23 start here
      'Gb', 'Db', 'Ab', 'Eb', 'Bb',
      'F', 'C', 'G', 'D', 'A', 'E', 'B',
      'F#', 'C#', 'G#', 'D#', 'A#',
      // 40
      'F', 'C',
      'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
      'G#', 'D#', 'A#', 'F', 'C', 'G', 'D',
    ],
  
    line_of_fifths_numbers: {
      Gb: 23,
      Db: 24,
      Ab: 25,
      Eb: 26,
      Bb: 27,
      F: 28, 'E#': 28,
      C: 29, 'B#': 29,
      G: 30,
      D: 31,
      A: 32,
      E: 33, Fb: 33,
      B: 34, Cb: 34,
      'F#': 35,
      'C#': 36,
      'G#': 37,
      'D#': 38,
      'A#': 39,
    },
  
    // ## and bb do not work yet
    accidentals_in_key: {
      C: { C: '', D: '', E: '', F: '', G: '', A: '', B: '' },
      F: { C: '', D: '', E: '', F: '', G: '', A: '', B: 'flat' },
      Bb: { C: '', D: '', E: 'flat', F: '', G: '', A: '', B: 'flat' },
      Eb: { C: '', D: '', E: 'flat', F: '', G: '', A: 'flat', B: 'flat' },
      Ab: { C: '', D: 'flat', E: 'flat', F: '', G: '', A: 'flat', B: 'flat' },
      Db: { C: '', D: 'flat', E: 'flat', F: '', G: 'flat', A: 'flat', B: 'flat' },
      Gb: { C: '', D: 'flat', E: 'flat', F: 'flat', G: 'flat', A: 'flat', B: 'flat' },
      Cb: { C: 'flat', D: 'flat', E: 'flat', F: 'flat', G: 'flat', A: 'flat', B: 'flat' },
  
  
      G: { C: '', D: '', E: '', F: 'sharp', G: '', A: '', B: '' },
      D: { C: 'sharp', D: '', E: '', F: 'sharp', G: '', A: '', B: '' },
      A: { C: 'sharp', D: '', E: '', F: 'sharp', G: 'sharp', A: '', B: '' },
      E: { C: 'sharp', D: 'sharp', E: '', F: 'sharp', G: 'sharp', A: '', B: '' },
      B: { C: 'sharp', D: 'sharp', E: '', F: 'sharp', G: 'sharp', A: 'sharp', B: '' },
      'F#': { C: 'sharp', D: '', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp', B: '' },
      'C#': { C: 'sharp', D: '', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp', B: 'sharp' },
      'G#': { C: 'sharp', D: '', E: 'sharp', F: '##', G: 'sharp', A: 'sharp', B: 'sharp' },
      'D#': { C: '##', D: 'sharp', E: 'sharp', F: '##', G: 'sharp', A: 'sharp', B: 'sharp' },
    },
  
    note_letters_flat: ['', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
    note_letters_sharp: ['', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  
    sharp_flat_from_note: {
      C: 'b',
      'C#': '#',
      Db: 'b',
      D: '#',
      'D#': '#',
      Eb: 'b',
      E: '#',
      'E#': '#',
      Fb: 'b',
      F: 'b',
      'F#': '#',
      Gb: 'b',
      G: '#',
      'G#': '#',
      Ab: 'b',
      A: '#',
      'A#': '#',
      B: '#',
      'B#': '#',
      Cb: 'b',
    },
  
    note_numbers: {
  
      'B#': 1,
      C: 1,
      'C#': 2,
      Db: 2,
      D: 3,
      'D#': 4,
      Eb: 4,
      E: 5,
  
      Fb: 5,
      'E#': 6,
  
      F: 6,
      'F#': 7,
      Gb: 7,
      G: 8,
      'G#': 9,
      Ab: 9,
      A: 10,
      'A#': 11,
      Bb: 11,
      B: 12,
      Cb: 12,
    },
  
    // when to bump the octave
    step_number: {
      C: 0,
      D: 1,
      E: 2,
      F: 3,
      G: 4,
      A: 5,
      B: 6,
    },
  };
  