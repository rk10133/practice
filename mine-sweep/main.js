const startBtn = document.querySelector('.start-btn');
const remain = document.querySelector('.remain');
const gameBoard = document.querySelector('.game-board');

let singleGrid, mineTotalCount, mineMarkCount;

//用于记录每个singleGrid的状态
let squareStatus = [];

const popup = document.querySelector('.popup');
const resultTitle = popup.querySelector('.title');
const mask = document.querySelector('.mask');

boot();

function boot() {
    startBtn.addEventListener("click", () => {
        startGame();
    })
}


function startGame() {
    resultTitle.innerText = '';
    gameBoard.innerHTML = '';
    squareStatus = [];
    remain.style.display = "block"
    gameBoard.style.display = "block";

    initGame();
    //在棋盘内阻止右键的默认事件
    gameBoard.oncontextmenu = function () {
        return false;
    };
    // gameBoard.addEventListener('mousedown', e => {
    // let el = e.target;
    // if (e.which == 1) {
    //     leftClick(el);
    // }
    // if (e.which == 3) {
    //     rightClick(el);
    // }
    // });
}


function initGame() {
    mineTotalCount = 10;
    mineMarkCount = 10;
    remain.innerHTML = '当前剩余:' + mineMarkCount;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let square = document.createElement('div');
            square.classList.add('single-grid');
            square.setAttribute('id', i + '-' + j);
            gameBoard.appendChild(square);
            square.addEventListener('mousedown', e => {
                let el = e.target;
                if (e.which == 1) {
                    leftClick(el);
                }
                if (e.which == 3) {
                    rightClick(el);
                }
            })
            //通过检查isMine的状态防止重复设置雷
            squareStatus.push({
                isMine: false
            })
        }
    };
    singleGrid = document.querySelectorAll('.single-grid');

    // 在生成的9x9个格子中随机选则十个设为雷
    while (mineTotalCount) {
        let squareIndex = Math.floor(Math.random() * 81);
        if (squareStatus[squareIndex].isMine == false) {
            singleGrid[squareIndex].classList.add('mine-square');
            squareStatus[squareIndex].isMine = true
            mineTotalCount--;
        };
    }
}

function leftClick(el) {
    if (resultTitle.innerText) return;
    let mineSquare = document.querySelectorAll('.mine-square');
    if (el.classList.contains('flag')) return;
    if (el && el.classList.contains("mine-square")) {
        for (let i = 0; i < mineSquare.length; i++) {
            mineSquare[i].classList.add('show-result');
        }
        showPopup('lose');
    } else {
        let n = 0;
        let posArr = el && el.getAttribute('id').split('-');
        let posX = posArr && +posArr[0];
        let posY = posArr && +posArr[1];
        el && el.classList.add('num');
        for (let i = posX - 1; i <= posX + 1; i++) {
            for (let j = posY - 1; j <= posY + 1; j++) {
                let arroundSquare = document.getElementById(i + '-' + j);
                if (arroundSquare && arroundSquare.classList.contains('mine-square'))
                    n++;
            }
        };
        el && (el.innerHTML = n);
        if (n == 0) {
            for (let i = posX - 1; i <= posX + 1; i++) {
                for (let j = posY - 1; j <= posY + 1; j++) {
                    el.innerHTML = '';
                    let nearSquare = document.getElementById(i + '-' + j);
                    if (nearSquare && nearSquare.length != 0) {
                        if (!nearSquare.classList.contains('checked')) {
                            nearSquare.classList.add('checked');
                            leftClick(nearSquare)
                        }
                    }
                }
            }
        };
        let allMineRemain = document.querySelectorAll('.num');
        if (allMineRemain.length == 71) {
            showPopup('win')
        }
    }
}

function rightClick(el) {
    if (resultTitle.innerText) return;
    if (el.classList.contains('num')) {
        return
    };
    if (!el.classList.contains('flag')) {
        el.classList.add('flag');
        mineMarkCount--;
    } else if (el.classList.contains('flag')) {
        el.classList.remove('flag');
        mineMarkCount++;
    };
    remain.innerHTML = '当前剩余:' + mineMarkCount;
    //标记出全部雷
    let flagSquare = document.querySelectorAll('.flag');
    let allMineFlag = document.querySelectorAll('.flag.mine-square');
    //只剩雷
    if (flagSquare.length == 10 && allMineFlag.length == 10) {
        showPopup('win');
    }
}

function showPopup(type) {
    if (type == 'win') {
        resultTitle.innerText = 'Win！'
    }
    if (type == 'lose') {
        resultTitle.innerText = 'Lose！'
    }
    mask.style.display = "block";
    popup.style.display = "block";
    setTimeout(() => {
        mask.style.display = "none";
        popup.style.display = "none"
    }, 2000);

}