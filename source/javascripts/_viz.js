class Viz {

  constructor(data, options) {
    this.data = data,
    this.options = $.extend({
      'target': "document",
      'margin': {top: 20, right: 120, bottom: 20, left: 120},
      'width': $(document).width(),
      'height': $(document).height(),
      'duration': 400,
      'overflow': 'auto'
    }, options)
  }

  init () {

    var obj = this.options

    // create svg
    var svg = d3.select(obj.target)
      .style("overflow", obj.overflow)
      .style("width", $(document).width())
    .append("svg")
      .attr("width", obj.width)
      .attr("height", obj.height)
      .attr("style", "border: solid 1px gray")
      .attr("id","svg")
    .append("g")
      .attr("transform", "translate(" + obj.margin.left + "," + obj.margin.top + ")");

    // tree
    var tree = d3.layout.tree()
      .size([obj.height, obj.width]);

    // diagonal
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  }

  collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(function (el) {
        this.collapse(el)
      });
      d.children = null;
    }
  }

}
