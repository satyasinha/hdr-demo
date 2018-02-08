<template>
  <svg width="80%" height="100%"></svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: ['nodes', 'edges'],

  watch: {
    nodes: function (newNodes) {
      this.nodes = newNodes
      this.reset()
    },
    edges: function (newEdges) {
      this.edges = newEdges
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
        .on('mouseover', function () {
          d3.select(this).attr('r', 15)
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 10)
        })

      dots
        .exit().remove()
      dots
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', 'gray').merge(dots)
        .attr('cx', this.width / 2)
        .attr('cy', this.height / 2)

      return dots
    },

    lines () {
      const lines = this.svg
        .selectAll('line')
        .data(this.edges)
        .on('mouseover', function () {
          d3.select(this).attr('stroke-width', 8)
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke-width', 5)
        })

      lines
        .exit().remove()
      lines
        .enter().append('line')
        .attr('stroke-width', 5)
        .attr('stroke', 'black').merge(lines)

      return lines
    },

    initiate () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.svg = d3.select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
    },

    reset () {
      if (this.interactome) this.interactome.stop()
      this.interactome = this.simulation()

      this.interactome.nodes(this.nodes)
      this.interactome.force('link').links(this.edges)
      this.interactome.restart()

      this.interactome.on('tick', () => {
        const dots = this.dots()
        const lines = this.lines()

        dots
          .attr('cx', node => node.x || this.width / 2)
          .attr('cy', node => node.y || this.height / 2)
        lines
          .attr('x1', edge => edge.source.x || 0)
          .attr('y1', edge => edge.source.y || 0)
          .attr('x2', edge => edge.target.x || 0)
          .attr('y2', edge => edge.target.y || 0)
      })
    },
    simulation () {
      // stop the simulation, set alpha (currently default) and set nodes
      let sim = d3.forceSimulation().nodes(this.nodes)

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

      return sim
    }
  }
}
</script>