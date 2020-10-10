const type = {
    SUBJECT: 'SUBJECT',
    VERB: 'VERB',
    DIRECT_OBJECT: 'DIRECT_OBJECT',
    PREDICATE_ADJ: 'PREDICATE_ADJ'
}

/*
export const type = {
  ADJ: 'adjective',
  ADP: 'adposition',
  ADV: 'adverb',
  AUX: 'auxiliary',
  CCONJ: 'coordinating conjunction',
  DET: 'determiner',
  INTJ: 'interjection',
  NOUN: 'noun',
  NUM: 'numeral',
  PART: 'particle',
  PRON: 'pronoun',
  PROPN: 'proper noun',
  PUNCT: 'punctuation',
  SCONJ: 'subordinating conjunction',
  SYM: 'symbol',
  VERB: 'verb',
  X: 'other'
}
*/

function drawTitle(parent, gc, title) {
    const text = parent.append("text")
        //.attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", 0)
        .style('font-size', '2em')
        .text(title)
}

function drawLine(parent, gc, x1, y1, x2, y2) {
    parent.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", gc.line.color)
        .style("stroke-width", gc.line.width)
}

function drawClause(parent, gc, x, y, name, type) {
    const g = parent.append('g')

    const text = g.append("text")
        .attr("text-anchor", "start")
        .attr("x", x + gc.MARGIN)
        .attr("y", y - gc.FONT_OFFSET)
        .style('font-size', '3em')
        .text(name)

    if (type === 'VERB') {
        text.attr("fill", "red")
    }
    if (type === 'SUBJECT') {
        text.attr("fill", "green")
    }

    const bbox = text.node().getBBox();

    const rect = g.append("rect")
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .style("fill", "#ffff80")
        .style("fill-opacity", ".3")
        .style("stroke", "#666")
        .style("stroke-width", "0");

    let width = gc.MARGIN + bbox.width + gc.MARGIN
    let x2 = x + width

    g.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x2)
        .attr("y2", y)
        .style("stroke", gc.line.color)
        .style("stroke-width", gc.line.width)

    return g.node().getBBox()
}

function drawDivideLineSubject(parent, gc, x, y) {
    drawLine(parent, gc, x, y - gc.Y_OFFSET, x, y + gc.Y2_OFFSET)
}

function drawDivideLinePredicateAdj(parent, gc, x, y) {
    drawLine(parent, gc, x - gc.X2_OFFSET, y - gc.Y_OFFSET, x, y)
}

function drawDivideLineDefault(parent, gc, x, y) {
    drawLine(parent, gc, x, y - gc.Y_OFFSET, x, y)
}

function drawVerticalLine(parent, gc, x, y) {
    let y2 = y + gc.Y_OFFSET + gc.Y2_OFFSET
    parent.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", y2)
        .style("stroke", gc.line.color)
        .style("stroke-width", gc.line.width)
    return {
        x: x,
        y: y2
    }
}

function drawModifer(parent, gc, x, y, item) {
    let pos = drawVerticalLine(parent, gc, x, y)
    return drawClause(parent, gc, pos.x, pos.y, item.name, item.type)
}

function drawItems(parent, gc, x, y, items) {
    let x_offset = x
    items.forEach((item, index, array) => {
        let box = drawClause(parent, gc, x_offset, y, item.name, item.type)
        x_offset = x_offset + box.width

        // draw divide line
        if (index !== (array.length - 1)) {

            if (item.type === 'SUBJECT') {
                drawDivideLineSubject(parent, gc, x_offset, y)
            } else {
                let next = array[index + 1]
                if (next.type === 'PREDICATE_ADJ') {
                    drawDivideLinePredicateAdj(parent, gc, x_offset, y)
                } else {
                    drawDivideLineDefault(parent, gc, x_offset, y)
                }
            }

        }

        // draw modifiers
        if (item.modifiers !== undefined) {

            let x = box.x + gc.X2_OFFSET
            let y = box.y + gc.Y_OFFSET
            item.modifiers.forEach(modifier => {
                let box2 = drawModifer(parent, gc, x, y, modifier)
                y = y + gc.Y_OFFSET + gc.Y2_OFFSET
            })
        }
    })

    // size
    return {
        x: 100,
        y: 200
    }

}

export function diagram(d3, node, data) {

    // grafix context
    const gc = {
        margin: {
            top: 50,
            right: 5,
            bottom: 5,
            left: 5
        },
        direction: data.direction === 'rtl' ? 'rtl' : 'ltr',
        X2_OFFSET: 30,
        X_OFFSET: 40,
        Y_OFFSET: 60,
        Y2_OFFSET: 30,
        MARGIN: 60,
        FONT_OFFSET: 16,
        line: {
            color: 'red',
            width: '1px'
        },
        type: [

        ]
    }

    let width = 1000 - gc.margin.left - gc.margin.right
    let height = 500 - gc.margin.top - gc.margin.bottom

    const g1 = d3.select(node)
    const g2 = g1.append('svg')
        .attr("width", width + gc.margin.left + gc.margin.right)
        .attr("height", height + gc.margin.top + gc.margin.bottom)

    const parent = g2.append("g")
        .attr("transform", "translate(" + gc.margin.left + "," + gc.margin.top + ")")

    drawTitle(parent, gc, data.title)
    let size = drawItems(parent, gc, 0, 100, data.items)

    let box = g2.node().getBBox()

    g2.attr('height', box.height + 60)
    g2.attr('width', box.width)
}
