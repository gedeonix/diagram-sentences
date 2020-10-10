function drawTitle(parent, gc, title) {
    return parent.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style('font-size', '2em')
        .text(title)
        .node().getBBox()
}

function drawLine(parent, gc, x1, y1, x2, y2) {
    return parent.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", gc.line.color)
        .style("stroke-width", gc.line.width)
        .node().getBBox()
}

function drawClause(parent, gc, pos, name, type) {
    const g = parent.append('g')

    const text = g.append("text")
        .attr("text-anchor", "start")
        .attr("x", pos.x + gc.text.margin)
        .attr("y", pos.y - gc.FONT_OFFSET)
        .style('font-size', gc.text.font.size)
        .text(name)

    if(gc.types[type] !== undefined) {
        text.attr("fill", gc.types[type] )
    }

    const bbox = text.node().getBBox();

    g.append("rect")
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .style("fill", "#ffff80")
        .style("fill-opacity", ".3")
        .style("stroke", "#666")
        .style("stroke-width", "0");

    let width = 2 * gc.text.margin + bbox.width
    let x2 = pos.x + width

    drawLine(g, gc, pos.x, pos.y, x2, pos.y)

    return g.node().getBBox()
}

function drawVerticalLine(parent, gc, x, y) {
    let y2 = y + gc.Y_OFFSET + gc.Y2_OFFSET
    drawLine(parent, gc, x, y, x, y2)
    return {
        x: x,
        y: y2
    }
}

function drawModifer(parent, gc, x, y, item) {
    let pos = drawVerticalLine(parent, gc, x, y)
    return drawClause(parent, gc, pos, item.name, item.type)
}

function drawBaseline(parent, gc, x, y, items) {
    let x_offset = x
    items.forEach((item, index, array) => {

        let pos = {
            x: x_offset,
            y: y
        }

        let box = drawClause(parent, gc, pos, item.name, item.type)
        x_offset = x_offset + box.width

        // draw divide line
        if (index !== (array.length - 1)) {

            if (item.type === 'SUBJECT') {
                drawLine(parent, gc, x_offset, y - gc.Y_OFFSET, x_offset, y + gc.Y2_OFFSET)
            } else {
                let next = array[index + 1]
                if (next.type === 'PREDICATE_ADJ') {
                    drawLine(parent, gc, x_offset - gc.X2_OFFSET, y - gc.Y_OFFSET, x_offset, y)
                } else {
                    drawLine(parent, gc, x_offset, y - gc.Y_OFFSET, x_offset, y)
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
        FONT_OFFSET: 16,
        line: {
            color: 'red',
            width: '1px'
        },
        font: {

        },
        types: {
            VERB: 'red',
            SUBJECT: 'green'
        },
        text: {
            font: {
              size: '2rem'
            },
            margin: 60
        }

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

    let size = drawBaseline(parent, gc, 0, 100, data.items)

    let box = g2.node().getBBox()

    g2.attr('height', box.height + 60)
    g2.attr('width', box.width)
}
