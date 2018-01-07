import * as d3 from 'd3'

class Interactome {
  constructor (el, width, height) {
    this.svg = d3.select(el)
      .attr('width', width)
      .attr('height', height)
    this.simulation = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => 50))
      // .force('y', d3.forceY(0))
      // .force('x', d3.forceX(0))
  }

  arrangeData (data) {
    const dots = this.svg
      .selectAll('circle')
      .data(data)

    // dots.exit().remove()

    dots.enter().append('circle')
        .attr('r', 10)
        .attr('fill', 'gray')
        .attr('cx', this.svg.attr('width') / 2)
        .attr('cy', this.svg.attr('height') / 2)

    this.simulation
      .nodes(data).on('tick', function () {
        dots
          .attr('cx', node => node.x)
          .attr('cy', node => node.y)
      }).restart()
  }
}

export default Interactome
