var Sara = require('sara')
  , $ = require('jquery')

var PostView = new Sara.View('Post', {
  render: function (post) {
    console.log(post)
  }
})

var HomeView = new Sara.View('Home', {
  render: function (posts) {
    var world = $('#world')
      , drg_h = world.outerHeight()
      , drg_w = world.outerWidth()
      , max_h = -$(world).height() + window.outerHeight
      , max_w = -$(world).width() + window.outerWidth

    $(posts).each(function (i, post) {
      $('#world').append('<div class="dot" data-post-id="' + post.id + '" style="left: ' + post.x +'%; top: ' + post.y + '%;"></div>')
    })

    $('.dot').click(function (e) {
      console.log(e.target.getAttribute('data-post-id'))
      PostView.render(Post.find(e.target.getAttribute('data-post-id')))
    })

    world.offset({
      top: Math.floor(Math.random()*(0-(max_h)+1)+(max_h))
    , left: Math.floor(Math.random()*(0-(max_w)+1)+(max_w))
    })
    
    $('#world').mousedown(function (e) {
      e.preventDefault()
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

var Post = new Sara.Model('Post', {
  title: String
, body: String
, created: Date.now
, x: function () { return Math.floor((Math.random()*100)+1) }
, y: function () { return Math.floor((Math.random()*100)+1) }
})

var HomeController = new Sara.Controller('Home')
  .action('index', function (req, res) {
    HomeView.render(Post.all()).pipe(res)
  })

Sara.layout('./layout.html')
    .storage('transientinsight', require('sara/lib/adapters/mongodb'))
    .static('./public')
    .routes({
     '/': HomeController.index
    })
    .init({ env: 'development' })
