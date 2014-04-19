var Sara = require('sara')
  , $ = require('jquery')
  , mongodb = require('sara/lib/adapters/mongodb')

var PostView = new Sara.View('Post', {
  render: function (post) {
    HomeView.render(Post.all())
    $('#modal').html('<h1>' + post.title + '</h1>' + post.body).show()
    $('#overlay').show()
    $('#overlay').click(function () {
      this.unload()
    }.bind(this))
  }
, unload: function () {
    $('#modal').hide() 
    $('#overlay').hide()
  }
})

var HomeView = new Sara.View('Home', {
  prerender: false
, render: function (posts) {
    window.onload = function () {
      var world = $('#world')
      , drg_h = world.outerHeight()
      , drg_w = world.outerWidth()
      , max_h = -$(world).height() + window.outerHeight
      , max_w = -$(world).width() + window.outerWidth

      $(posts).each(function (i, post) {
        $('#world').append('<a href="/post/' + post.id + '"><div class="dot" data-post-id="' + post.id + '" style="left: ' + post.x +'%; top: ' + post.y + '%;"></div></a>')
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
    }.bind(this)
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
  .action('show', function (req, res) {
    PostView.render(Post.find(req.params.id)).pipe(res)
  })

Sara.layout('./layout.html')
    .storage('transientinsight', mongodb('mongodb://localhost/'))
    .static('./public')
    .routes({
      '/': HomeController.index
    , '/post/:id': HomeController.show
    })
    .init({ env: 'development' })
