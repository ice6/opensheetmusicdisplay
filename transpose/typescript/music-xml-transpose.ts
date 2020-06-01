import {TransposeConstant} from './music-xml-tranpose-constant'
import {MXLHelper} from '../../src/Common/FileIO/Mxl'
import {AJAX} from '../../src/opensheetmusicdisplay/AJAX'

export const main = () => {
    const transposer = new MusicXmlTransposeService();
    transposer.load(this.xmlPath).then(() => {
      transposer.transpose('E');
      // use transposer.xml variable (In my case, call `osmd.load(transposer.xml);`)
    });
};

// Thanks to @ice6 @AlbertHart
// Inspired from https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/commit/467e0a600d168e59c6376bc9c75f553801c98961#diff-19b11c7ef440f126313c8af1217075c7L122
export class MusicXmlTransposeService {
  xml: Document;

  private oldKey: string;
  private transposeKey: string;
  private transposeDirection: 'closest' | 'down' | 'up' = 'closest';

  constructor() {
  }

  transpose(key: string, direction: 'closest' | 'down' | 'up' = 'closest') {
    this.transposeKey = key;
    this.transposeDirection = direction;

    let divisions = 0;
    // let mesauresCnt = 0;
    let lastNoteDuration = 0;
    let lastStemDirection = '';
    let currentAccidentals = {};

    const stack: Element[] = [this.xml.firstElementChild];
    let target: Element;
    // tslint:disable-next-line:no-conditional-assignment
    while (target = stack.pop()) {
      // 인접 태그는 항상 탐색
      if (target.nextElementSibling) {
        stack.push(target.nextElementSibling);
      }

      switch (target.tagName.toUpperCase()) {
        case 'DIVISIONS':
          divisions = +target.innerHTML;
          break;

        case 'MEASURES':
          //mesauresCnt++;
          lastNoteDuration = 0;
          lastStemDirection = '';
          currentAccidentals = { ...TransposeConstant.accidentals_in_key[this.transposeKey] };
          break;

        case 'FIFTHS':
          const fifths = +target.innerHTML;
          const lineOfFifthsInC = TransposeConstant.line_of_fifths_numbers.C;
          const oldKeyNumber = fifths + lineOfFifthsInC;
          this.oldKey = TransposeConstant.line_of_fifths[oldKeyNumber];
          const newLineOfFifthsNumber = TransposeConstant.line_of_fifths_numbers[this.transposeKey] - lineOfFifthsInC;
          target.innerHTML = `${newLineOfFifthsNumber}`;

          currentAccidentals = { ...TransposeConstant.accidentals_in_key[this.transposeKey] };
          break;

        case 'NOTE':
          const durationElem = target.querySelector('duration');
          const duration = +durationElem.innerHTML;

          const restElem = target.querySelector('rest');
          if (restElem) {
            const stepElem = restElem.querySelector('display-step');
            const octaveElem = restElem.querySelector('display-octave');
            const transposedRest = this.transposePitch(stepElem.innerHTML, 0, +octaveElem.innerHTML);
            stepElem.innerHTML = transposedRest.step;
            octaveElem.innerHTML = `${transposedRest.octave}`;
          }

          const pitchElem = target.querySelector('pitch');
          if (pitchElem) {
            const stepElem = pitchElem.querySelector('step');
            const octaveElem = pitchElem.querySelector('octave');
            let alterElem = pitchElem.querySelector('alter');
            const accidentalElem = target.querySelector('accidental');

            const originalNote = { step: stepElem.innerHTML, alter: +alterElem?.innerHTML || 0, octave: +octaveElem.innerHTML };
            const transposedNote = this.transposePitch(originalNote.step, originalNote.alter, originalNote.octave);
            octaveElem.innerHTML = `${transposedNote.octave}`;
            stepElem.innerHTML = transposedNote.step;

            let stepAlteredNote = transposedNote.step;
            let newAccidental = '';
            let currentAccidental;
            if (transposedNote.alter === '1') {
              if (!alterElem) {
                alterElem = document.createElement('alter');
                pitchElem.appendChild(alterElem);
              }
              alterElem.innerHTML = transposedNote.alter;

              stepAlteredNote = transposedNote.step + '#';
              newAccidental = 'sharp';
            } else if (transposedNote.alter === '-1') {
              if (!alterElem) {
                alterElem = document.createElement('alter');
                pitchElem.appendChild(alterElem);
              }
              alterElem.innerHTML = transposedNote.alter;

              stepAlteredNote = transposedNote.step + 'b';
              newAccidental = 'flat';
            } else {
              if (alterElem) {
                alterElem.remove();
              }
            }
            currentAccidental = currentAccidentals[stepAlteredNote];
            currentAccidentals[stepAlteredNote] = newAccidental;
            if (accidentalElem) {
              if (currentAccidental === newAccidental) { // no change from key or last note
                accidentalElem?.remove();
              } else if (newAccidental === '') {
                accidentalElem.innerHTML = 'natural';
              } else {
                accidentalElem.innerHTML = newAccidental;
              }
            }

            const stemElem = target.querySelector('stem');
            let stemDirection;
            if (duration < divisions && lastNoteDuration > 0 && lastNoteDuration < divisions) {
              stemDirection = lastStemDirection;
            } else if (originalNote.octave > 4) {
              stemDirection = `down`;
            } else if (originalNote.octave < 4) {
              stemDirection = `up`;
            } else if (originalNote.step === 'B') {
              stemDirection = `down`;
            } else {
              stemDirection = `up`;
            }
            if (stemElem) {
              stemElem.innerHTML = stemDirection;
              lastStemDirection = stemDirection;
            }
            lastNoteDuration = duration;
          }

          continue; // 자식 태그는 더이상 탐색하지 않아도 됩니다.

        case 'ROOT':
          const rootStepElem = target.querySelector('root-step');
          const rootAlterElem = target.querySelector('root-alter');
          const transposedRoot = this.transposePitch(rootStepElem.innerHTML, +rootAlterElem.innerHTML, 0);
          rootStepElem.innerHTML = transposedRoot.step;
          if (transposedRoot.alter !== '0') {
            rootAlterElem.innerHTML = transposedRoot.alter;
          } else {
            rootAlterElem.remove();
          }
          continue; // 자식 태그는 더이상 탐색하지 않아도 됩니다.

        case 'BASS':
          const bassStepElem = target.querySelector('bass-step');
          const bassAlter = target.querySelector('bass-alter');
          const transposedBass = this.transposePitch(bassStepElem.innerHTML, +bassAlter.innerHTML, 0);
          bassStepElem.innerHTML = transposedBass.step;
          if (transposedBass.alter !== '0') {
            bassAlter.innerHTML = transposedBass.alter;
          } else {
            bassAlter.remove();
          }

          continue; // 자식 태그는 더이상 탐색하지 않아도 됩니다.
      }

      // 자식 태그 탐색
      if (target.firstElementChild) {
        stack.push(target.firstElementChild);
      }
    }
  }

  public load(str: string) {
    // Warning! This function is asynchronous! No error handling is done here.
    // console.log("typeof content: " + typeof content);
    const self = this;
    // console.log("substring: " + str.substr(0, 5));
    if (str.substr(0, 4) === '\x50\x4b\x03\x04') {
      // This is a zip file, unpack it first
      return MXLHelper.MXLtoXMLstring(str).then(
        (x: string) => {
          return self.load(x);
        }
      );
    }
    // Javascript loads strings as utf-16, which is wonderful BS if you want to parse UTF-8 :S
    else if (str.substr(0, 3) === '\uf7ef\uf7bb\uf7bf') {
      // UTF with BOM detected, truncate first three bytes and pass along
      return this.load(str.substr(3));
    }
    // first character is sometimes null, making first five characters '<?xm'.
    else if (str.substr(0, 6).includes('<?xml')) {
      // Parse the string representing an xml file
      const parser: DOMParser = new DOMParser();
      const contentDocument = parser.parseFromString(str, 'application/xml');
      this.xml = contentDocument;
      return Promise.resolve(contentDocument);
    } else if (str.length < 2083) {
      // Assume now "str" is a URL
      // Retrieve the file at the given URL
      return AJAX.ajax(str).then(
        (s: string) => self.load(s),
        (exc: Error) => {
          throw exc;
        }
      );
    } else {
      throw new Error('[MusicXMLTranspose.load(string)] Could not process string. Missing else branch?');
    }
  }

  private transposePitch(oldStep: string, oldAlter: number, oldOctave: number) {
    let oldNote = oldStep;
    if (oldAlter === 1) {
      oldNote += '#';
    } else if (oldAlter === -1) {
      oldNote += 'b';
    }

    // move to local variables
    const { oldKey, transposeKey: newKey } = this;

    const oldKeyNumber = TransposeConstant.note_numbers[oldKey];
    const newKeyNumber = TransposeConstant.note_numbers[newKey];
    let keyOffset = newKeyNumber - oldKeyNumber;

    const upOffset = (keyOffset + 12) % 12; // move up
    const downOffset = (keyOffset - 12) % 12; // move down

    switch (this.transposeDirection) {
      case 'up':
        keyOffset = upOffset;
        break;

      case 'down':
        keyOffset = downOffset;
        break;

      default: // get closest offset
        if (Math.abs(upOffset) <= Math.abs(downOffset)) {
          keyOffset = upOffset;
        } else {
          keyOffset = downOffset;
        }
    }

    const kpos1 = TransposeConstant.line_of_fifths_numbers[oldKey];
    const kpos2 = TransposeConstant.line_of_fifths_numbers[newKey];
    const fifthsOffset = kpos2 - kpos1;
    const npos1 = TransposeConstant.line_of_fifths_numbers[oldNote];
    const npos2 = npos1 + fifthsOffset;
    const newNote = TransposeConstant.line_of_fifths[npos2];
    const newStep = newNote.substr(0, 1);
    let newAlter = '';
    if (newNote.substr(1, 1) === '#') {
      newAlter = '1';
    } else if (newNote.substr(1, 1) === 'b') {
      newAlter = '-1';
    }

    // offset octave
    const oldStepNumber = TransposeConstant.step_number[oldStep];
    const newStepNumber = TransposeConstant.step_number[newStep];

    let newOctave = +oldOctave;    // ADH - calculate change of octave
    if (keyOffset > 0 && newStepNumber < oldStepNumber) {
      newOctave += 1;
    } else if (keyOffset < 0 && newStepNumber > oldStepNumber) {
      newOctave -= 1;
    }

    return {
      note: newNote,
      step: newStep,
      alter: newAlter,
      octave: newOctave,
    };
  }
}
