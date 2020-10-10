function drawTitle(parent, gc, title) {
    return parent.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style('font-size', gc.title.font.size)
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
        .attr("y", pos.y - gc.text.font.offset)
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
        .style("fill-opacity", ".4")
        .style("stroke", "#666")
        .style("stroke-width", "0");

    let width = 2 * gc.text.margin + bbox.width
    drawLine(g, gc, pos.x, pos.y, pos.x + width, pos.y)

    return g.node().getBBox()
}

function drawVerticalLine(parent, gc, pos) {
    let y2 = pos.y + gc.Y_OFFSET + gc.Y2_OFFSET
    drawLine(parent, gc, pos.x, pos.y, pos.x, y2)
    return {
        x: pos.x,
        y: y2
    }
}

function drawModifer(parent, gc, pos, item) {
    let pos2 = drawVerticalLine(parent, gc, pos)
    return drawClause(parent, gc, pos2, item.name, item.type)
}

function drawSeparator(parent, gc, pos, item, next) {
    if (item.type === 'SUBJECT') {
        drawLine(parent, gc, pos.x, pos.y - gc.Y_OFFSET, pos.x, pos.y + gc.Y2_OFFSET)
    } else {
        if (next.type === 'PREDICATE_ADJ') {
            drawLine(parent, gc, pos.x - gc.X2_OFFSET, pos.y - gc.Y_OFFSET, pos.x, pos.y)
        } else {
            drawLine(parent, gc, pos.x, pos.y - gc.Y_OFFSET, pos.x, pos.y) // default
        }
    }
}

function drawBaseline(parent, gc, x, y, items) {

    let pos = {
        x: x,
        y: y
    }

    items.forEach((item, index, array) => {

        let box = drawClause(parent, gc, pos, item.name, item.type)
        pos.x = pos.x + box.width

        // draw separator
        if (index !== (array.length - 1)) {
            let next = array[index + 1]
            drawSeparator(parent, gc, pos, item, next)
        }

        // draw modifiers
        if (item.modifiers !== undefined) {
            let pos = {
                x: box.x + gc.X2_OFFSET,
                y: box.y + gc.Y2_OFFSET
            }
            item.modifiers.forEach(modifier => {
                let box2 = drawModifer(parent, gc, pos, modifier)
                pos.y = pos.y + gc.Y_OFFSET + gc.Y2_OFFSET
            })
        }
    })
}

export function diagram(d3, node, data) {
    const gc = {
        direction: data.direction === 'rtl' ? 'rtl' : 'ltr',
        margin: {
            top: 50,
            right: 5,
            bottom: 5,
            left: 5
        },
        X2_OFFSET: 30,
        Y_OFFSET: 60,
        Y2_OFFSET: 30,
        title: {
            font: {
                size: '2rem'
            }
        },
        line: {
            color: 'black',
            width: '1px'
        },
        text: {
            font: {
              size: '2rem',
              offset: '16'
            },
            margin: 60
        },
        types: {
            VERB: 'red',
            SUBJECT: 'green'
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
