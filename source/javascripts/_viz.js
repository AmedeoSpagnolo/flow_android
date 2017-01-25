class Viz {

  constructor(data, options) {
    this.options = $.extend({
      'target': "document",
      'margin': {top: 20, right: 120, bottom: 20, left: 120},
      'width': $(document).width(),
      'height': $(document).height(),
      'duration': 400,
      'overflow': 'auto',
      'depth': 100,
      'label': false,
      'image': false,
      'placeholder_img': true,
      'collapse_nodes': true
    }, options)

    this.data = data,
    this.data.x0 = this.options.height / 2
    this.data.y0 = 0
    this.svg = null
    this.i = 0

    this.tree = d3.layout.tree()
    .size([this.options.height, this.options.width]);

    this.diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
  }

  init () {

    //
    // create svg tag
    //
    this.create_svg()

    //
    // collapse all
    //
    // if (!this.collapse_nodes) this.collapse_all()

    //
    // update
    //
    this.update(this.data)

  }

  create_svg () {
    var obj = this.options
    this.svg = d3.select(obj.target)
      .style("overflow", obj.overflow)
      .style("width", $(document).width())
    .append("svg")
      .attr("width", obj.width)
      .attr("height", obj.height)
      .attr("style", "border: solid 1px gray")
      .attr("id","svg")
    .append("g")
      .attr("transform", "translate(" + obj.margin.left + "," + obj.margin.top + ")")

    this.svg.append("g")
      .attr("class","links")

    this.svg.append("g")
      .attr("class","nodes")
  }

  collapse (d) {
    var vm = this
    if (d.children) {
      d._children = d.children;
      d._children.forEach(function (el) {
        vm.collapse(el)
      });
      d.children = null;
    }
  }

  collapse_all (root = this.data) {
    var vm = this
    root.children.forEach(function (el) {
      vm.collapse(el)
    })
  }

  update (source) {
    var vm = this

    // Compute the new tree layout.
    var nodes = vm.tree.nodes(vm.data).reverse()
    var links = vm.tree.links(nodes)

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * vm.options.depth })

    // Update the nodes…
    var node = d3.select(".nodes").selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++vm.i) })

    //
    // nodeEnter
    // Enter any new nodes at the parent's previous position.
    //
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function (el) { vm.click(el) });

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill","#fff")
      .style("stroke","steelblue")
      .style("stroke-width","1.5px")
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    if (vm.options.label) {
      nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .style("font","10px")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);
    }

    if (vm.options.image) {
      node.append('image')
        .attr('xlink:href', function(d) {
          if (vm.placeholder_img) {
            return '../images/test1.JPG'
          } else {
            return '../images/' + d.name
          }
        })
        .attr('xlink:href', function(d) { return '../images/' + d.name })
        // .attr('xlink:href', function(d) { return '../images/test1.JPG' })
        .attr('class', 'screenshot')
        .attr('width', '60')
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .attr('style', 'transform: translate(-110%,-50%)')
        .attr('opacity', .5)
    }



    //
    // nodeUpdate
    // Transition nodes to their new position.
    //
    var nodeUpdate = node.transition()
        .duration(vm.options.duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 2)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // nodeUpdate.select("image")
    //     .style("opacity", 1);

    //
    // nodeExit
    // Transition exiting nodes to the parent's new position.
    //
    var nodeExit = node.exit().transition()
        .duration(vm.options.duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // nodeUpdate.select("image")
    //     .style("opacity", 0);

    //
    // links
    // Update the links…
    //
    var link = d3.select(".links").selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .style("fill","none")
        .style("stroke","#ccc")
        .style("stroke-width","1.5px")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return vm.diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(vm.options.duration)
        .attr("d", vm.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(vm.options.duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return vm.diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  click (d) {
    console.log(d);
    var vm = this
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    vm.update(d);
  }

}
