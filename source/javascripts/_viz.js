;class Viz {

  constructor(options) {
    this.options = $.extend({
      'dataset': {},
      'target': ".container",
      'margin': {top: 20, right: 20, bottom: 20, left: 20},
      'width': $(document).width(),
      'height': $(document).height(),
      'duration': 400,
      'floors': 1,
      'overflow': 'auto',
      'depth': 240,
      'label': false,
      'image': true,
      'image_width': 180,
      'image_height': 180 * 1.1,
      'image_shift': 0,
      'placeholder_img': true,
      'collapse_nodes': false,
    }, options)

    this.data = this.options.dataset,
    this.data.x0 = this.options.height / 2
    this.data.y0 = 0
    this.svg = null
    this.i = 0

    this.options.height = this.options.floors * this.options.image_height

    // tree init
    this.tree = d3.layout.tree()
        .size([this.options.height, this.options.width]);

    this.diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

  }

  init () {

    // collapse all
    if (this.options.collapse_nodes) this.collapse(this.data)

    // update
    this.update(this.data)

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

    function max_depth () {
      var md = 0
      function _max (obj) {
        if (obj.depth > md) md = obj.depth
        if (obj.children) {
          obj.children.forEach(function (el){
            _max(el)
          })
        }
      }
      _max(source)
      return md
    }

    function max_height (s) {
      var mh = []
      function _max (obj) {
        if (obj.children){
          var tmp = Object.keys(obj.children).length
          if (!mh[obj.depth]) mh[obj.depth] = 0
          mh[obj.depth] += tmp
          obj.children.forEach(function (el){
            _max(el)
          })
        }
      }
      _max(source)
      return _.max(mh)
    }

    function resize_width (s) {
      var t = (max_depth(s) + 2) * vm.options.depth + vm.options.margin.left + vm.options.margin.right
      return t
    }

    // function resize_height (s) {
    //   var t = (max_height(s) + 1) * vm.options.image_height + 50 + vm.options.margin.top + vm.options.margin.bottom
    //   return 1000
    // }
    // console.log(max_height(source))

    // Compute the new tree layout.
    var nodes = vm.tree.nodes(vm.data).reverse()
    var links = vm.tree.links(nodes)

    // update svg
    d3.select(vm.options.target)
      .style("overflow", vm.options.overflow)
      .style("width", $(document).width())

    d3.select(".wrap")
      .attr("transform", "translate(" + vm.options.margin.left + "," + vm.options.margin.top + ")")

    this.svg = d3.select("#svg")
      .attr("width", resize_width())
      .attr("height", vm.options.height + vm.options.image_height*2)
      .attr("style", "border: solid 1px gray")

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
      nodeEnter.append('image')
        .attr('xlink:href', function(d) {
          if (vm.placeholder_img) {
            return '../images/placeholders/phone1.jpg'
          } else {
            return '../images/' + d.name
          }
        })
        .attr('class', 'screenshot')
        .attr('width', vm.options.image_width)
        .attr('overflow', "visible")
        // .attr('style', 'transform: translate(-110%,-50%)')
        .attr('transform', 'matrix(1 0 0 1 ' + vm.options.image_shift + ' '+vm.options.image_shift+')')
        .style("opacity", 1);

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

    nodeUpdate.select("image")
        .style("opacity", 1);

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

    nodeExit.select("image")
        .style("opacity", 0);

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
