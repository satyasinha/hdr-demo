<template>
  <svg width="80%" height="100%"></svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: ['nodes', 'edges'],
  watch: {
    nodes: function (newNodes) {
      this.arrangeNodes(newNodes)
      this.reset()
    },
    edges: function (newEdges) {
      this.arrangeEdges(newEdges)
      this.reset()
    }
  },
  mounted: function () {
    this.initiate()
  },
  methods: {
    dots () {
      const dots = this.svg
        .selectAll('circle')
        .data(this.nodes)

      dots
        .exit().remove()
      dots
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', 'gray').merge(dots)
      return dots
    },
    lines () {
      const lines = this.svg
        .selectAll('line')
        .data(this.edges)

      lines
        .exit().remove()
      lines
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'black').merge(lines)
      return lines
    },
    arrangeNodes (nodes) {
      this.nodes = nodes
    },
    arrangeEdges (edges) {
      this.edges = edges
    },
    initiate () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.svg = d3.select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      this.reset()
    },
    reset () {
      if (this.interactome) this.interactome.stop()
      this.interactome = this.simulation()

      this.interactome.nodes(this.nodes)
      this.interactome.force('link').links(this.edges)
      this.interactome.restart()

      const dots = this.dots()
      const lines = this.lines()

      this.interactome.on('tick', () => {
        dots
          .attr('cx', node => node.x)
          .attr('cy', node => node.y)
        lines
          .attr('x1', edge => edge.source.x)
          .attr('y1', edge => edge.source.y)
          .attr('x2', edge => edge.target.x)
          .attr('y2', edge => edge.target.y)
      })
    },
    simulation () {
      // stop the simulation, set alpha (currently default) and set nodes
      let sim = d3.forceSimulation().stop().nodes(this.nodes)

      sim
        // set the charge
        .force('charge', d3.forceManyBody().strength(-1000))
        // set the center
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        // set the links/edges
        .force('link', d3.forceLink(this.edges).id(node => node.id).distance(200))
        // set x force
        .force('x', d3.forceX())
        // set y force
        .force('y', d3.forceY())
        // set alpha target
        .alphaTarget(1)

      return sim
    }
  }
}
</script>