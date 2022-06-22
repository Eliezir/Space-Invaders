var interval;
var ctx = document.getElementById("canvas").getContext("2d");
var isGameOver
const background = new Image();
background.src = "space.png";
const m1 = new Image();
m1.src = "missile.png";


function gameObject(x,y,img){
this.x = x; this.y = y; this.img = img; this.active = true;
}

gameObject.prototype.draw = function(ctx){
    this.active && ctx.drawImage(this.img, this.x, this.y, 40, 40)
}

gameObject.prototype.move = function(dx,dy){
    this.x += dx; this.y += dy
}

gameObject.prototype.fire = function(dy){
    return new Shot(this.x+20,this.y+20,dy)
}

gameObject.prototype.isHitBy = function(shot){
    function between(x,a,b){return a <x && x <b}
    return this.active && between(shot.x, this.x, this.x+40) && between(shot.y+10, this.y, this.y +20)
}

var invaderDx = -5
var invaders = []
var cannon = new gameObject(230,550, document.getElementById("cannon"));
var invaderShot, cannonShot
var rightPressed = false;
var leftPressed = false;
const velocity = 10;


$(document).on("keydown",this.keydown);
$(document).on("keyup",this.keyup)

function init(){
for(var y = 0; y < 3; y++){
    for(var x = 0; x < 8; x++){
        var r =  Math.floor(Math.random() * 5 + 1)
        var img = document.getElementById("invader"+r)
        invaders.push(new gameObject(50+x*50, 20+y*50, img))
    }
}}

function draw(){
invaders.forEach(inv => inv.draw(ctx))
cannon.draw(ctx)
invaderShot && invaderShot.draw(ctx,m1)
cannonShot && cannonShot.draw(ctx,m1)

}


function move(){
var leftX = invaders[0].x, rightX = invaders[invaders.length-1].x
if(leftX <=20 || rightX >= 440) invaderDx = -invaderDx
invaders.forEach(inv => inv.move(invaderDx, 0.5))
if(invaderShot && !invaderShot.move()) {
    invaderShot = null
}
if(!invaderShot){
    var active = invaders.filter(i => i.active) 
    var r = active[Math.floor(Math.random()*active.length)]
    invaderShot = r.fire(25)
}
if(cannonShot){
    var hit = invaders.find(inv => inv.isHitBy(cannonShot))
    if(hit){
        hit.active = false
        cannonShot = null
    }
    else{
        if(!cannonShot.move()) cannonShot = null

        
    }
}
}

function Shot(x,y,dy){
this.x = x; this.y = y; this.dy = dy
}

Shot.prototype.move = function() {
this.y  += this.dy
return this.y > 0 && this.y < 600
}

Shot.prototype.draw = function(ctx,img){
    ctx.drawImage(img, this.x, this.y, 40, 40)
   /*  ctx.fillStyle = color;
    ctx.fillRect(this.x-1,this.y, 3,20) */
}

function moveCannon(){
    if(cannon.x < 40){
        cannon.x = 40;
    }
    if(cannon.x > 420){
        cannon.x = 420;
    }

    if(rightPressed){
        cannon.move(velocity,0)
      
    }
    else if(leftPressed){
        cannon.move(-velocity,0)
    }
}


function isGameOver(){
    return cannon.isHitBy(invaderShot) || invaders.find(inv => inv.active && inv.y > 530)
}

function game(){
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);   
move()
draw()
moveCannon()    
if(isGameOver()){
    alert("Game over")
    clearInterval(interval)
}
}
function start(){
    init()
    $(document).on("keypress",function(e){
        if(e.key == ' ' && !cannonShot) cannonShot = cannon.fire(-30)
    })
    $(document).on("keydown",function(e){
        if(e.code =='ArrowRight'){
            rightPressed = true
    }
        if(e.code =='ArrowLeft'){
            leftPressed = true
        }
    $(document).on("keyup",function(e){
        if(e.code =='ArrowRight'){
            rightPressed = false;
        }
        if(e.code =='ArrowLeft'){
            leftPressed = false;
    }
})

   
})}

interval = setInterval(game,50)
window.onload = start
