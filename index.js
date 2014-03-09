var Sara = require('sara')
  , $ = require('jquery')

var HomeView = new Sara.View('Home', {
  render: function () {
    var world = $('#world')
      , drg_h = world.outerHeight()
      , drg_w = world.outerWidth()
      , max_h = -$(world).height() + window.outerHeight
      , max_w = -$(world).width() + window.outerWidth

    world.offset({
      top: Math.floor(Math.random()*(0-(max_h)+1)+(max_h))
    , left: Math.floor(Math.random()*(0-(max_w)+1)+(max_w))
    })

    $('#world').mousedown(function (e) {
      var pos_y = world.offset().top + drg_h - e.pageY
        , pos_x = world.offset().left + drg_w - e.pageX

      $(document).mousemove(function (e) {
        $(world).offset({          
          top: Math.max(Math.min(e.pageY + pos_y - drg_h, 0), max_h)
        , left: Math.max(Math.min(e.pageX + pos_x - drg_w, 0), max_w)
        })
      })
    }).mouseup(function (e) {
      $(document).off('mousemove')
    })
  }
})

var HomeController = new Sara.Controller('Home')
  .action('index', function (req, res) {
    HomeView.render().pipe(res)
  })

Sara.layout('./layout.html')
    .storage('transientinsight', require('sara/lib/adapters/mongodb'))
    .static('./public')
    .routes({
     '/': HomeController.index
    })
    .init({ env: 'development' })
