import * as d3 from 'd3'

class Interactome {
  _cleanup () {
    // this.simulation.stop()
    const dots = this.svg
      .selectAll('circle')
      .data(this.nodes)

    const lines = this.svg
      .selectAll('line')
      .data(this.edges)

    lines.exit().remove()
    dots.exit().remove()
  }

  _restart () {
    // this.simulation.stop()
    const dots = this.svg
      .selectAll('circle')
      .data(this.nodes)

    const lines = this.svg
      .selectAll('line')
      .data(this.edges)

    dots.enter().append('circle')
        .attr('r', 10)
        .attr('fill', 'gray').merge(dots)
        // .attr('cx', this.svg.attr('width') / 2)
        // .attr('cy', this.svg.attr('height') / 2)

    lines
      .enter().append('line')
      .attr('stroke-width', 1)
      .attr('stroke', 'black').merge(lines)

    this.simulation.force('link').links(this.edges)
    this.simulation.nodes(this.nodes)
    this.simulation
      .on('tick', () => {
        dots
          .attr('cx', node => node.x)
          .attr('cy', node => node.y)
        lines
          .attr('x1', edge => edge.source.x)
          .attr('y1', edge => edge.source.y)
          .attr('x2', edge => edge.target.x)
          .attr('y2', edge => edge.target.y)
      })
      .restart()
  }

  constructor (el, width, height) {
    this.svg = d3.select(el)
      .attr('width', width)
      .attr('height', height)
      // .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    this.nodes = []
    this.edges = []
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(this.edges).id(node => node.id)
        .distance(200))
  }

  arrangeNodes (nodes) {
    this.nodes = nodes
    this._restart()
  }

  arrangeEdges (edges) {
    this.edges = edges
    this._restart()
  }
}

export default Interactome
