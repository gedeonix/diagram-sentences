function drawDot(parent, gc, pos, color) {
    if(gc.debug) {
        parent.append("circle")
            .attr("cx", pos.x)
            .attr("cy", pos.y)
            .attr("r", 3)
            .attr("fill", color === undefined ? "#0000ff" : color)
    }
}

function drawBBox(parent, gc, color) {
    let bbox = parent.node().getBBox()
    if(gc.debug) {
        parent.append("rect")
            .attr("x", bbox.x)
            .attr("y", bbox.y)
            .attr("width", bbox.width)
            .attr("height", bbox.height)
            .style("fill", color === undefined ? "#ffff80": color )
            .style("fill-opacity", ".1")
            .style("stroke", "#666")
            .style("stroke-width", "0")
    }
    return bbox
}

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
        //.attr("text-anchor", "start")
        .attr("x", pos.x + gc.text.margin)
        .attr("y", pos.y - gc.text.font.offset)
        .style('font-size', gc.text.font.size)
        .text(name)

    if (gc.types[type] !== undefined) {
        text.attr("fill", gc.types[type])
    }

    const bbox = text.node().getBBox();
    let width = 2 * gc.text.margin + bbox.width
    drawLine(g, gc, pos.x, pos.y, pos.x + width, pos.y)

    return drawBBox(g, gc)
}

function drawVerticalLine(parent, gc, pos) {
    let y2 = pos.y + gc.offset.y * 3
    drawLine(parent, gc, pos.x, pos.y, pos.x, y2)
    return {
        x: pos.x,
        y: y2
    }
}

function drawModifer(parent, gc, pos, item) {
    const g = parent.append('g')
    drawDot(parent, gc, pos, 'red')
    let pos2 = drawVerticalLine(g, gc, pos)
    drawClause(g, gc, pos2, item.name, item.type);
    return drawBBox(g, gc)
}

function drawSeparator(parent, gc, pos, item, next) {
    if (item.type === 'SUBJECT') {
        drawLine(parent, gc, pos.x, pos.y - gc.offset.y * 2, pos.x, pos.y + gc.offset.y)
    } else {
        if (next.type === 'PREDICATE_ADJ') {
            drawLine(parent, gc, pos.x - gc.offset.x, pos.y - gc.offset.y * 2, pos.x, pos.y)
        } else {
            drawLine(parent, gc, pos.x, pos.y - gc.offset.y * 2, pos.x, pos.y) // default
        }
    }
}

function drawBaseline(parent, gc, x, y, items) {
    const g = parent.append('g')

    let pos = {
        x: x,
        y: y
    }

    drawDot(parent, gc, pos)

    items.forEach((item, index, array) => {
        let box = drawClause(g, gc, pos, item.name, item.type)
        pos.x = pos.x + box.width

        // draw separator
        if (index !== (array.length - 1)) {
            let next = array[index + 1]
            drawSeparator(g, gc, pos, item, next)
        }

        // draw modifiers
        if (item.modifiers !== undefined) {
            let pos = {
                x: box.x + gc.offset.x,
                y: box.y + box.height
            }

            drawDot(parent, gc, pos, 'red') // base point

            item.modifiers.forEach(modifier => {
                let pos2 = drawModifer(g, gc, pos, modifier)
                pos.y = pos.y + gc.offset.y * 3
            })
        }
    })
    return drawBBox(g, gc)
}

export function diagram(d3, node, data) {
    const gc = {
        debug: false,
        direction: data.direction === 'rtl' ? 'rtl' : 'ltr',
        margin: {
            top: 50,
            right: 5,
            bottom: 5,
            left: 5
        },
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
            SUBJECT: 'green',
            PREDICATE_ADJ: '#00ffff',
            DIRECT_OBJECT: 'blue'
        },
        offset: {
            x: 30,
            y: 30
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

    let box = drawBBox(g2, gc)

    g2.attr('height', box.height + 60)
    g2.attr('width', box.width)
}
