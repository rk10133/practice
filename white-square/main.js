;
(function () {
    'use strict';

    let main = document.querySelector('.main')
    let gameBoard = main.querySelector('.game-board');
    let scoreBoard = main.querySelector('.score-board');
    let score = scoreBoard.innerText;
    let menu = main.querySelector('.menu')
    let timer = null;
    let status;
    let speed = 2;

    boot()

    function boot() {
        menu.style.display = "block";
        menu.innerText = '开始游戏';
        menu.addEventListener('click', () => {
            startGame()
        })
    }

    function startGame() {
        gameBoard.innerHTML = '';
        timer = null;
        status = null
        speed = 2;
        scoreBoard.innerText = score = 0;
        scoreBoard.style.display = 'block';
        menu.style.display = 'none';
        for (let i = 0; i < 4; i++) {
            createRow();
        };
        move();
    }

    //创建单行
    function createRow() {
        let row = createEl('row');
        let classNameArr = addClassName()
        //创建一行 每行4个suqare
        for (let i = 0; i < 4; i++) {
            let square = createEl(classNameArr[i])
            row.appendChild(square);
            square.addEventListener('click', e => {
                bindClick(e)
            })
        };

        if (!gameBoard.firstChild)
            gameBoard.appendChild(row);
        gameBoard.insertBefore(row, gameBoard.firstChild)
    }


    //从每行四个suqare中随机找一个添加black类名 修改样式
    function addClassName() {
        let arr = ['square', 'square', 'square', 'square'];
        let index = Math.floor(Math.random() * 4);
        arr[index] = 'square black';
        return arr;
    }

    function createEl(className) {
        let el = document.createElement('div');
        el.className = className;
        return el
    }

    function bindClick(e) {
        let tg = e.target;
        if (status == 'lose') {
            return;
        };
        if (tg.classList.contains('black')) {
            tg.style.backgroundColor = 'white';
            score++;
            scoreBoard.innerText = score;
            //每得十分加一次速
            if (score != 0 && (score % 10 == 0)) {
                speedUp();
            }
        } else {
            endGame()
        }
    }

    function move() {
        timer = setInterval(() => {
            let top = parseInt(window.getComputedStyle(gameBoard, null)['top']);
            if (speed + top > 0) {
                top = 0
            } else {
                top += speed
            }
            gameBoard.style.top = top + 'px';
            if (top == 0) {
                createRow();
                let width = document.documentElement.clientWidth
                if (width >= 770) {
                    gameBoard.style.top = '-150px';
                } else {
                    gameBoard.style.top = '-7.5rem';
                }
                if (gameBoard.childNodes.length == 6)
                    gameBoard.removeChild(gameBoard.lastChild);
            }

            //通过最后一行元素的backgroundColor判断是否点击过
            let newArr = [];
            gameBoard.lastChild.childNodes.forEach(it => {
                newArr.push(it.style.backgroundColor)
            });
            if (top == 0 && (newArr.indexOf('white') === -1)) {
                endGame()
            }
        }, 10)
    }

    function speedUp() {
        speed += 1;
        if (speed > 10)
            speed = 10;
    }

    function endGame() {
        clearInterval(timer);
        status = 'lose';
        menu.innerText = '再玩一次';
        menu.style.display = 'block';
    }
})()