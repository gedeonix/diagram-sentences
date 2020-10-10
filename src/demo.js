
function drawDot(parent, x, y) {
    parent.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", "blue")
}

function drawPath(svg, d) {
    svg.append("path")
        .style("stroke", "grey")
        .style("fill", "none")
        .attr("d", d)
}

export function demo(svg) {
    // text
    // DEMO 1
    drawPath(svg, "M60,15 L60,110 M30,40 L90,40 M30,75 L90,75 M30,110 L90,110")

    svg.append("text")
        .attr("text-anchor", "start")
        .attr("x", 60)
        .attr("y", 40)
        .text("A")

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 60)
        .attr("y", 75)
        .text("A")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 60)
        .attr("y", 110)
        .text("A")

    svg.append("circle")
        .attr("cx", 60)
        .attr("cy", 40)
        .attr("r", 3)
        .attr("fill", "red")

    drawDot(svg, 60, 40)
    drawDot(svg, 60, 75)
    drawDot(svg, 60, 110)

    //DEMO 2
    drawPath(svg, "M60,10 L60,110 M30,10 L300,10 M30,65 L300,65 M30,110 L300,110")

    svg.append("text")
        .attr("alignment-baseline", "hanging")
        .attr("x", 60)
        .attr("y", 10)
        .text("A hanging")

    svg.append("text")
        .attr("alignment-baseline", "middle")
        .attr("x", 60)
        .attr("y", 64)
        .text("A middle")

    svg.append("text")
        .attr("alignment-baseline", "baseline")
        .attr("x", 60)
        .attr("y", 110)
        .text("A baseline")

    // next text

    svg.append("text")
        .style("fill", "black")
        .attr("x", 50)
        .attr("y", 300)
        .text("Hello World")


    svg.append("text")
        .style("fill", "black")
        .attr("x", 50+100)
        .attr("y", 300)
        .attr("text-anchor", "middle")
        .text("Hello World")

    svg.append("text")
        .style("fill", "black")
        .style("writing-mode", "tb")
        .style("glyph-orientation-vertical", 0)
        .attr("x", 50+200)
        .attr("y", 300)
        .text("Hello World")


    // line
    svg.append(  /*
  //The line SVG Path we draw
  var lineGraph = svg.append("path")
    .attr("d", d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate('linear')(lineData))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  */

        /*
        g.selectAll('path')
          .data(sortedGDP)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (d, i) => color(i))
          .attr('stroke', '#FFF')
          .attr('stroke-width', '1px')
          .on('mouseenter', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('opacity', 0.5)
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('opacity', 1)
          })
        */

        "line")
        .style("stroke", "black")
        .attr("x1", 50)
        .attr("y1", 400)
        .attr("x2", 50+80)
        .attr("y2", 440)

    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 20)
        .style("stroke-linecap", "butt")
        .attr("x1", 50+100)
        .attr("y1", 400)
        .attr("x2", 50+80+100)
        .attr("y2", 440)

    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 20)
        .style("stroke-linec/ap", "round")
        .attr("x1", 50+200)
        .attr("y1", 400)
        .attr("x2", 50+80+200)
        .attr("y2", 440)

    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 20)
        .style("stroke-linecap", "square")
        .attr("x1", 50+300)
        .attr("y1", 400)
        .attr("x2", 50+80+300)
        .attr("y2", 440)

    // rect
    svg.append("rect")
        .attr("x", 50)
        .attr("y", 500)
        .attr("height", 40)
        .attr("width", 80)

    svg.append("rect")
        .attr("x", 50+100)
        .attr("y", 500)
        .attr("height", 40)
        .attr("width", 80)
        .attr("rx", 10)
        .attr("ry", 10)

    svg.append("rect")
        .attr("x", 50+200)
        .attr("y", 500)
        .attr("height", 40)
        .attr("width", 80)
        .attr("fill", "#9895FF")

    // circle
    svg.append("circle")
        .attr("cx", 50+40)
        .attr("cy", 600)
        .attr("r", 40)
        .style("stroke", "red")
        .style("stroke-width", 5)
        .attr("fill", "none")

    svg.append("circle")
        .attr("cx", 50+40+100)
        .attr("cy", 600)
        .attr("r", 40)
        .style("opacity", .2)
        .style("stroke", "red")
        .style("stroke-width", 5)
        .attr("fill", "#7CE8D5")

    svg.append("circle")
        .attr("cx", 50+40+200)
        .attr("cy", 600)
        .attr("r", 40)
        .style("fill-opacity", .2)
        .style("stroke", "red")
        .style("stroke-width", 5)
        .style("stroke-dasharray", ("10,3"))
        .attr("fill", "#7CE8D5")

    // polyline
    svg.append("polyline")
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 3)
        .style("stroke-linejoin", "round")
        .attr("points", "50,680, 100,730, 150,680, 200,680, 200,730")

    // polyline
    svg.append("polygon")
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 3)
        .style("stroke-linejoin", "round")
        .attr("points", "300,680, 400,730, 500,680")

    // path
    //  MoveTo: M, m
    //  LineTo: L, l, H, h, V, v
    //  Cubic Bézier Curve: C, c, S, s
    //  Quadratic Bézier Curve: Q, q, T, t
    //  Elliptical Arc Curve: A, a
    //  ClosePath: Z, z

    svg.append("path")
        .style("stroke", "black")
        .style("fill", "none")
        .attr("d", "M 600,680, L 700,730, L 800,680 Z");

    drawPath(svg, 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z')

    drawPath(svg, 'M 10,10 h 10\n' +
        '       m  0,10 h 10\n' +
        '       m  0,10 h 10\n' +
        '       M 40,20 h 10\n' +
        '       m  0,10 h 10\n' +
        '       m  0,10 h 10\n' +
        '       m  0,10 h 10\n' +
        '       M 50,50 h 10\n' +
        '       m-20,10 h 10\n' +
        '       m-20,10 h 10\n' +
        '       m-20,10 h 10')

    /*
  //The line SVG Path we draw
  var lineGraph = svg.append("path")
    .attr("d", d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate('linear')(lineData))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  */

    /*
    g.selectAll('path')
      .data(sortedGDP)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#FFF')
      .attr('stroke-width', '1px')
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.5)
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
      })
    */

}
