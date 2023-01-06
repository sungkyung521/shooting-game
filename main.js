

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let background, spaceship, bulletImage, enemy, gameOverImage;
let gameOver = false;

let score=0;

let spaceshipX = canvas.width/2-30;
let spaceshipY = canvas.height-60

let bulletLIst = [] //총알 저장하는 리스트

function Bullet(){
    this.x = 0
    this.y = 0
    this.init=function(){
        this.x=spaceshipX+20;
        this.y=spaceshipY;
        this.alive=true; //살아있는 총알 false면 죽은 총알 
        bulletLIst.push(this);
    };
    this.update = function(){
        this.y -= 7;
    }
    
    this.checkHit=function(){
        for(let i=0; i<enemyList.length;i++)
        //총알이 적군에 닿은 상태
        if(this.y <= enemyList[i].y && 
           this.x >= enemyList[i].x && 
           this.x <= enemyList[i].x +48){
            score++;
            console.log("Score", score);
            this.alive=false;//죽은총알
            enemyList.splice(i,1); //우주선 삭제 총알맞은
        }
    }

};

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList=[]
function Enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y=0;
        this.x= generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    }
    this.update = function(){
        this.y += 3;

        if(this.y >= canvas.height -48){
            gameOver = true;
            console.log("Game OVer");
        }
    }
}

function loadImage(){
    background = new Image();
    background.src = "images/space-image.jpg";

    spaceship = new Image();
    spaceship.src = "images/sapce-icons.jpg";

    bulletImage = new Image();
    bulletImage.src = "images/bullet-icons.jpg";

    enemy = new Image();
    enemy.src = "images/enemy.jpg";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.jpg";
}


let keysdown={};
function setupKeyBoard(){
    document.addEventListener("keydown", function(event){
        keysdown[event.keyCode]=true;
    });
    document.addEventListener("keyup", function(event){
        delete keysdown[event.keyCode];

        if(event.keyCode == 32){
            createBullet(); //총알 생성 
        }
    })
};

function createBullet(){
    
    console.log("총알 생성")
    let b = new Bullet();
    b.init();
    console.log("총알", bulletLIst)

    
}
function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000)
}

function update(){
    if(39 in keysdown){
        spaceshipX += 5  //우주선 속도 
    }
    if(37 in keysdown){
        spaceshipX -= 5        
    }    

    if(spaceshipX <=0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-60){
        spaceshipX = canvas.width-60;
    }

    //우주선 좌표값이 컨버스 안에서만 움직이게

    //총알의 y좌표 업데이트함수 
    for(let i=0;i<bulletLIst.length; i++){
        if(bulletLIst[i].alive){
            bulletLIst[i].update();
            bulletLIst[i].checkHit();
        }
        
    }

    for(let i=0;i<enemyList.length; i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceship, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle ="white";
    ctx.font ="20px Arial";
    
    for(let i=0;i<bulletLIst.length;i++){
        if(bulletLIst[i].alive){
            ctx.drawImage(bulletImage, bulletLIst[i].x, bulletLIst[i].y)
        }       
    } 

    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemy, enemyList[i].x, enemyList[i].y)
    }
};

function main(){
    if(!gameOver){
        update();
        render();
        console.log("main function!!")
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage,10,100,380,380);
    }
    
} ;

loadImage();
setupKeyBoard();
createEnemy();
main();
