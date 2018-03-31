window.onload = function() {
  
  //Polygon constructor
  function Polygon(x,y,r,s,co) {
    this.x = x
    this.y = y
    //radius
    this.r = r
    //sides
    this.s = s
    //color
    this.co = co
    
    this.dragging = false
  }
  
  //App constructor
  function App() {
    if (App.instance) {
      return App.instance
    }
	App.instance = this
    
    //draggable polygon
    this.dgP = null

    this.polygons = []
    this.mouseCords = { x: 0, y: 0 }
  }
  
  App.prototype.init = function() {
    this.cvs = document.createElement('canvas')
    this.cvs.width = window.innerWidth
    this.cvs.height = window.innerHeight
    this.ctx = this.cvs.getContext('2d')
    document.body.appendChild(this.cvs)
    
    this.cvs.addEventListener('mousedown', onMouseDown.bind(this))
    this.cvs.addEventListener('mouseup', onMouseUp.bind(this))
    this.cvs.addEventListener('mousemove', onMouseMove.bind(this))
  }
  App.prototype.getPolygons = function(amount) {
    var polygon = null,
        y = 200,
        x = 200,
        radius = 100,
        sides
    
    for (var i = 0; i <= amount - 1; i++) {
      sides = Math.ceil(Math.random() * 7 + 3)
      
      if (y + radius >= window.innerHeight) {
        y = 200
        x += 250
      }
      if (x + radius >= window.innerWidth) {
        alert(this.polygons.length +' polygons have been drawn.')
        return this.polygons
      }
      
      polygon = new Polygon(x, y, radius, sides, '#456789')
      this.polygons.push(polygon)
      y += 250
    }
  }
  App.prototype.drawPolygon = function(polygon) {
    var { x, y, r, s, co } = polygon
    
    if (s < 3) return false
    var a = ((Math.PI * 2)/s)
    this.ctx.beginPath()
    this.ctx.translate(x,y)
    this.ctx.moveTo(r,0)
    for (var i = 1; i < s; i++) {
      this.ctx.lineTo(r*Math.cos(a*i),r*Math.sin(a*i))
    }
    this.ctx.fillStyle = co
    this.ctx.strokeStyle = co
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.translate(-x, -y)
  }
  App.prototype.drawPolygons = function() {
    if (this.polygons.length === 0) {
      alert('There is no polygons to draw!')
      return false
    }
    for (var i = 0; i < this.polygons.length; i++) {
      var p = this.polygons[i]
      this.drawPolygon(p)
      this.ctx.stroke()
    }
  }
  
  
  //Mouse events
  function onMouseDown(e) {
    e = e || window.event
    this.mouseCords.x = e.pageX - this.cvs.offsetLeft
    this.mouseCords.y = e.pageY - this.cvs.offsetTop
    //defining what polygon we are touching now
    for (var i = 0; i<this.polygons.length; i++) {
      var p = this.polygons[i]
      if (this.mouseCords.x>p.x-p.r && this.mouseCords.x<p.x+p.r && this.mouseCords.y>p.y-p.r && this.mouseCords.y<p.y+p.r) {
        p.dragging = true
        this.dgP = p
      }
    }
  }
  function onMouseUp(e) {
    for (var i = 0; i<this.polygons.length; i++) {
      var p = this.polygons[i]
      if (p.dragging === true) {
        p.dragging = false
        this.dgP = null
      }
    }
    this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height)
    this.drawPolygons()
  }
  function onMouseMove(e) {
    this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height)
    this.drawPolygons()
    if (this.dgP) {
      this.dgP.x = e.pageX - this.cvs.offsetLeft
      this.dgP.y = e.pageY - this.cvs.offsetTop
      
      var that = this
      var noDragPs = this.polygons.filter(function(p) { return p !== that.dgP })
      var nearestPs = noDragPs.filter(function(p) {
        if (p.x-60 > that.dgP.x+that.dgP.r || p.x+p.r+60 < that.dgP.x || p.y-60 > that.dgP.y+that.dgP.r || p.y+p.r+60 < that.dgP.y) {
          return false
        } else {
          return true
        }
      })
      
      for (var i = 0; i < this.polygons.length; i++) {
        var p = this.polygons[i]
        p.co = '#456789'
        this.dgP.co = '#456789'
      }
      if (nearestPs.length > 0) {
        this.dgP.co = '#ff6363'
        for (var i = 0; i < nearestPs.length; i++) {
          var p = nearestPs[i]
          p.co = '#ff6363'
        }
      }
    }
  }
  
  
  var app = new App()
  app.init()
  app.getPolygons(999)
  app.drawPolygons()
  
}
