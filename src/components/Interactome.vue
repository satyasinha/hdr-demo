<template>
  <svg width="80%" height="100%"></svg>
</template>

<script>
import * as d3 from 'd3'
import { mapActions } from 'vuex'

const RADIUS = 10

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
    ...mapActions([
      'selectEdge',
      'selectNode'
    ]),
    dots () {
      const selectNode = this.selectNode
      const dots = this.svg
        .selectAll('circle')
        .data(this.nodes)
        .on('mouseover', function () {
          d3.select(this).attr('r', RADIUS + 5)
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', RADIUS)
        })
        .on('click', function (data) {
          selectNode(data.index)
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
      const selectEdge = this.selectEdge
      const lines = this.svg
        .selectAll('line')
        .data(this.edges)
        .on('mouseover', function () {
          d3.select(this).attr('stroke-width', 8)
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke-width', 5)
        })
        .on('click', function (data) {
          selectEdge(data.index)
        })

      lines
        .exit().remove()
      lines
        .enter().append('line')
        .attr('stroke-width', 5)
        .attr('stroke', 'black').merge(lines)

      return lines
    },

    text () {
      const text = this.svg
        .selectAll('text')
        .data(this.nodes)

      text.exit().remove()
      text
        .enter().append('text')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '15px')
        .attr('fill', 'seagreen')
        .text(node => node.title || node.id)

      return text
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
        const text = this.text()

        dots
          .attr('cx', node => {
            if (!node.x) {
              node.x = this.width / 2
            }

            if (node.x > this.width) {
              node.x = this.width - RADIUS
            } else if (node.x < 0) {
              node.x = RADIUS
            }

            return node.x
          })
          .attr('cy', node => {
            if (!node.y) {
              node.y = this.height / 2
            }

            if (node.y > this.height) {
              node.y = this.height - RADIUS
            } else if (node.y < 0) {
              node.y = RADIUS
            }

            return node.y
          })
        lines
          .attr('x1', edge => edge.source.x || 0)
          .attr('y1', edge => edge.source.y || 0)
          .attr('x2', edge => edge.target.x || 0)
          .attr('y2', edge => edge.target.y || 0)
        text
          .attr('dx', node => node.x + 10 || 0)
          .attr('dy', node => node.y + 10 || 0)
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