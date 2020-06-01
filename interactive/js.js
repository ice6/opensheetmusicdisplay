function handleNoteClick(verticalVoiceEntriesIndex) {
    console.log('verticalVoiceEntriesIndex', verticalVoiceEntriesIndex)
}

function interactive () {
    let verticalVoiceEntriesIndex = 0
    const it = osmd.cursor.iterator
    while (!it.EndReached) {
        const voices = it.CurrentVoiceEntries
        for (var i = 0; i < voices.length; i++) {
            const v = voices[i]
            const notes = v.Notes
            for (var j = 0; j < notes.length; j++) {
                const note = notes[j]
                const el = note.graphicalNote.getSVGGElement()
                // ((index) => {
                //     el.addEventListener('click', (ev) => {
                //         console.log(index, verticalVoiceEntriesIndex)
                //     })
                // })(verticalVoiceEntriesIndex)
                // use `onclick =` to avoid duplicate click event
                el.onclick = handleNoteClick.bind(this, verticalVoiceEntriesIndex)
            }
        }
        it.moveToNext()
        verticalVoiceEntriesIndex++
    }
}
