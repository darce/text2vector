import * as opentype from './node_modules/opentype.js/dist/opentype.module.js'

const text = document.getElementById('content').innerText
console.log('text', text)
const fontPath = './fonts/Geist.Mono/GeistMonoVariableVF.ttf'

opentype.load(fontPath, (error, font) => {
    if (error) {
        console.error('Unable to load font:', error)
        return
    }

    const svgContainer = document.getElementById('svgContainer')

    /** Initial positions */
    let xPos = 0
    const yPos = 500
    const scale = 0.3

    for (let i = 0; i < text.length; i++) {
        const char = text[i]

        const glyph = font.charToGlyph(char)
        console.log('glyph', glyph)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('transform', `translate(${xPos}, ${yPos}) scale(${scale}, -${scale})`)
        const newPathData = offsetBezierCurves(glyph.path.commands, 5)

        console.log(newPathData)

        path.setAttribute('d', newPathData)
        svgContainer.appendChild(path)
        xPos += glyph.advanceWidth * scale
    }
})

const offsetBezierCurves = (commands, mod) => {
    const offset = 0
    const newCommands = commands.map(command => {
        if (command.type === 'C') {
            const x1 = command.x1 + offset
            const y1 = command.y1 + offset
            const x2 = command.x2 + offset
            const y2 = command.y2 + offset

            return {
                type: 'C',
                x: command.x + offset,
                y: command.y + offset,
                x1,
                y1,
                x2,
                y2
            }
        } else {
            return command
        }
    })
    /** convert new commands back to svg path data */
    return newCommands.map(command => {
        const values = [command.x, command.y, command.x1, command.y1, command.x2, command.y2].join(' ');
        return command.type + ' ' + values;
    }).join('');
}