function handleNoteClick(verticalVoiceEntriesIndex) {
    console.log('verticalVoiceEntriesIndex', verticalVoiceEntriesIndex)
    window.alert(`verticalVoiceEntriesIndex is ${verticalVoiceEntriesIndex}, you can use this for playback`)
}

function interactive () {
    let verticalVoiceEntriesIndex = 0
    osmd.cursor.reset()
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
    osmd.cursor.reset()
}
