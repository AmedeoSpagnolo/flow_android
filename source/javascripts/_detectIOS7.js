;(function (window, $) {
  function detectIOS7 () {
    var ios7 = navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)
    return ios7 ? true : false
  }
  app.isIOS7 = detectIOS7()
}(window, window.jQuery));
