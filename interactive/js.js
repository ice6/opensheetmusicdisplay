function handleNoteClick (verticalVoiceEntriesIndex, ev) {
    ev.stopPropagation()
    console.log('verticalVoiceEntriesIndex', verticalVoiceEntriesIndex, ev.target)
    document.getElementById('debug').innerHTML = `debug: verticalVoiceEntriesIndex is ${verticalVoiceEntriesIndex}`
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

    makeItDragable()
}

function handlerPathData (height) {
    return `M 4.00,8.00
      C 4.00,0.00 4.00,100.00 4.00,100.00M 8.00,4.00
      C 8.00,6.21 6.21,8.00 4.00,8.00
      1.79,8.00 0.00,6.21 0.00,4.00
      0.00,1.79 1.79,0.00 4.00,0.00
      6.21,0.00 8.00,4.00 8.00,4.00 Z`.replace(/100.00/ig, height)
}

function createHandler (id, rectangeF2D, svg) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('id', id)
    path.setAttribute('class', 'draggable confine')
    path.setAttribute('musicSystemIndex', 0)

    const color = id === 'handler1' ? 'red' : 'blue'
    path.setAttribute('style', `fill:red; stroke:${color}; stroke-width: 2`)
    path.setAttribute('d', handlerPathData(parseFloat(rectangeF2D.height)))

    const translate = svg.createSVGTransform()
    translate.setTranslate(rectangeF2D.x - 4, rectangeF2D.y)
    path.transform.baseVal.insertItemBefore(translate, 0)
    return path
}

// test
function createSelectionFullMask (id, rectangeF2D, svg) {
    // <rect width="1" height="100" fill="rgba(16, 90, 90, .6)" transform="scale(100, 1)" />
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('id', 'selection_mask_system_full_' + id)
    rect.setAttribute('width', 1)
    rect.setAttribute('height', rectangeF2D.height)
    rect.setAttribute('fill', 'rgba(16, 90, 90, .6)')

    const scale = svg.createSVGTransform()
    scale.setScale(0, 1)
    rect.transform.baseVal.insertItemBefore(scale, 0)

    const translate = svg.createSVGTransform()
    translate.setTranslate(rectangeF2D.x, rectangeF2D.y)
    rect.transform.baseVal.insertItemBefore(translate, 0)

    return rect
}

let handler1, handler2, masks = [], maskBoundaries = []

function makeItDragable () {
    const svg = document.getElementsByTagName('svg')[0]

    for (let i = 0; i < osmd.graphic.calculator.musicSystems.length; i++) {
        const musicSystem = osmd.graphic.calculator.musicSystems[i]
        const bb = musicSystem.boundingBox

        const boundary = {
            width: bb.boundingRectangle.width * 10,
            height: bb.boundingRectangle.height * 10,
            x: (bb.absolutePosition.x + bb.borderLeft) * 10,
            y: (bb.absolutePosition.y + bb.borderTop) * 10
        }
        const m = createSelectionFullMask(0, boundary, svg)
        svg.appendChild(m)
        masks.push(m)
        maskBoundaries.push(boundary)
    }

    handler1 = createHandler('handler1', maskBoundaries[0], svg)
    handler2 = createHandler('handler2', maskBoundaries[0], svg)
    svg.appendChild(handler1)
    svg.appendChild(handler2)

    makeDraggable(svg)
}

function makeDraggable (svg) {

    svg.addEventListener('mousedown', startDrag)
    svg.addEventListener('mousemove', drag)
    svg.addEventListener('mouseup', endDrag)
    svg.addEventListener('mouseleave', endDrag)
    svg.addEventListener('touchstart', startDrag)
    svg.addEventListener('touchmove', drag)
    svg.addEventListener('touchend', endDrag)
    svg.addEventListener('touchleave', endDrag)
    svg.addEventListener('touchcancel', endDrag)

    var selectedElement, offset, transform,
        bbox, minX, maxX, minY, maxY, confined,
        mouseMusicSystemIndex,
        boundaryX1, boundaryX2, boundaryY1, boundaryY2

    function getMousePosition (evt) {
        var CTM = svg.getScreenCTM();
        if (evt.touches) { evt = evt.touches[0]; }
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        }
    }

    function getMouseMusicSystemIndex (offset) {
        console.log(offset)
        let index = -1
        if (offset.y < maskBoundaries[0].y) {
            index = 0
        }
        const lastIndex = maskBoundaries.length - 1
        if (offset.y > maskBoundaries[lastIndex].y) {
            index = lastIndex
        }
        for (let i = 0; i < maskBoundaries.length; i++) {
            const boundary = maskBoundaries[i]
            if (offset.y > boundary.y && offset.y < boundary.y + boundary.height) {
                index = i
            }
        }
        if (index < 0) {
            throw new Error('getMouseMusicSystemIndex')
        }
        updateMouseMusicSystemBoundary(index)
        return index
    }

    function updateMouseMusicSystemBoundary (index) {
        if (index === mouseMusicSystemIndex) {
            return
        }
        boundaryX1 = maskBoundaries[index].x - 4
        boundaryX2 = maskBoundaries[index].x + maskBoundaries[index].width + 4
        boundaryY1 = maskBoundaries[index].y
        boundaryY2 = maskBoundaries[index].y + maskBoundaries[index].height

        bbox = selectedElement.getBBox();
        minX = boundaryX1 - bbox.x;
        maxX = boundaryX2 - bbox.x - bbox.width;
        minY = boundaryY1 - bbox.y;
        maxY = boundaryY2 - bbox.y - bbox.height;
    }

    function paintMask (maskIndex, startPointX, width) {
        const originalY = masks[maskIndex].transform.baseVal.getItem(0).matrix.f
        masks[maskIndex].transform.baseVal.getItem(0).setTranslate(startPointX, originalY)
        masks[maskIndex].transform.baseVal.getItem(1).setScale(width, 1)
    }

    function updateMask () {

        console.log('handler1', handler1.transform.baseVal)
        console.log('handler2', handler2.transform.baseVal)

        const handler1Transforms = handler1.transform.baseVal
        const handler2Transforms = handler2.transform.baseVal
        if (handler1Transforms.length === 0 || handler1Transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            return
        }
        if (handler2Transforms.length === 0 || handler2Transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            return
        }

        const handler1X = handler1Transforms.getItem(0).matrix.e
        const handler2X = handler2Transforms.getItem(0).matrix.e

        // 无脑清
        for (let i = 0; i < maskBoundaries.length; i++) {
            const boundary = maskBoundaries[i]
            masks[i].transform.baseVal.getItem(0).setTranslate(0, boundary.y)
            masks[i].transform.baseVal.getItem(1).setScale(0, 1)
        }

        const h1MusicSystemIndex = parseInt(handler1.getAttribute('musicSystemIndex'))
        const h2MusicSystemIndex = parseInt(handler2.getAttribute('musicSystemIndex'))

        // 先处理同行
        if (h1MusicSystemIndex === h2MusicSystemIndex) {
            const maskWidth = Math.abs(handler1X - handler2X)
            const startPointX = 4 + Math.min(handler1X, handler2X)
            paintMask(h1MusicSystemIndex, startPointX, maskWidth)
            return
        }

        // 处理非同行
        let begin, end, beginHandleX, endHandleX
        if (h1MusicSystemIndex < h2MusicSystemIndex) {
            begin = h1MusicSystemIndex
            end = h2MusicSystemIndex
            beginHandleX = handler1X
            endHandleX = handler2X
        } else {
            begin = h2MusicSystemIndex
            end = h1MusicSystemIndex
            beginHandleX = handler2X
            endHandleX = handler1X
        }
        for (let i = begin; i <= end; i++) {
            const boundary = maskBoundaries[i]
            let maskWidth
            let beginMaskX
            if (i === begin) {
                beginMaskX = beginHandleX + 4
                maskWidth = boundary.width + boundary.x - beginHandleX - 4
            } else if (i === end) {
                beginMaskX = boundary.x
                maskWidth = endHandleX + 4 - boundary.x
            } else {
                beginMaskX = boundary.x
                maskWidth = boundary.width
            }

            paintMask(i, beginMaskX, maskWidth)
        }
    }

    function startDrag (evt) {
        if (evt.target.classList.contains('draggable')) {
            selectedElement = evt.target
            offset = getMousePosition(evt)
            mouseMusicSystemIndex = getMouseMusicSystemIndex(offset)

            // Make sure the first transform on the element is a translate transform
            var transforms = selectedElement.transform.baseVal

            if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                // Create an transform that translates by (0, 0)
                var translate = svg.createSVGTransform();
                translate.setTranslate(0, 0);
                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            // Get initial translation
            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;

            confined = evt.target.classList.contains('confine');
            if (confined) {
                bbox = selectedElement.getBBox();
                minX = boundaryX1 - bbox.x;
                maxX = boundaryX2 - bbox.x - bbox.width;
                minY = boundaryY1 - bbox.y;
                maxY = boundaryY2 - bbox.y - bbox.height;
            }
        }
    }

    function drag (evt) {
        if (selectedElement) {
            evt.preventDefault();

            var coord = getMousePosition(evt);
            mouseMusicSystemIndex = getMouseMusicSystemIndex(coord)
            console.log('mouseMusicSystemIndex', mouseMusicSystemIndex)
            selectedElement.setAttribute('musicSystemIndex', mouseMusicSystemIndex)
            const boundary = maskBoundaries[mouseMusicSystemIndex]
            selectedElement.setAttribute('d', handlerPathData(boundary.height))

            var dx = coord.x - offset.x;
            var dy = coord.y - offset.y;

            if (confined) {
                if (dx < minX) { dx = minX; }
                else if (dx > maxX) { dx = maxX; }
                if (dy < minY) { dy = minY; }
                else if (dy > maxY) { dy = maxY; }
            }

            transform.setTranslate(dx, boundary.y)

            updateMask()
        }
    }

    function endDrag (evt) {
        selectedElement = false
    }
}
