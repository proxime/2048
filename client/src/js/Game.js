class Game {
    constructor(points) {
        this.points = points;
        this.roundPoints = 0;

        this.gameEl = document.querySelector('.game-container');
        this.tilesEl = document.querySelector('.game__tiles');
        this.newGameBtn = document.querySelector('.header__new-game button');

        window.localStorage.gameBoard ? this.gameBoard = JSON.parse(window.localStorage.gameBoard) : this.gameBoard = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];

        this.gameMerged = [
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ];

        this.tiles = [];
        this.canMove = true;
        this.roundChanges = false;

        // Touch move
        this.touchPosition = {
            x: null,
            y: null,
        }

        this.mobileView = window.matchMedia('(max-width: 500px)')
        this.isMobeile = this.mobileView.matches;

        this.mobileView.addListener(isMobile => {
            this.isMobeile = isMobile.matches;
            this.resizeTiles();
        })
    }

    getTileValue() {
        const random = Math.random() * 4;
        if (random < 3) return 2;
        return 4;
    }

    getTilePosition() {
        const y = Math.floor(Math.random() * 4);
        const x = Math.floor(Math.random() * 4);

        if (this.gameBoard[y][x] === null) return { y, x };
        return this.getTilePosition();
    }

    createTile(y, x) {
        const tile = document.createElement('div');
        const tileContent = document.createElement('div');

        tile.className = "game__tile game__tile--new";
        tileContent.className = "game__tile-content";
        tileContent.textContent = this.gameBoard[y][x];
        this.handleColorClass(tile, this.gameBoard[y][x]);
        tile.appendChild(tileContent);
        this.tilesEl.appendChild(tile);
        this.tiles.push({ tile, y, x });

        if (this.isMobeile) {
            tile.style.left = x * (4 + tile.clientWidth) + 8 + 'px';
            tile.style.top = y * (4 + tile.clientHeight) + 8 + 'px';
        } else {
            tile.style.left = x * (10 + tile.clientWidth) + 15 + 'px';
            tile.style.top = y * (10 + tile.clientHeight) + 15 + 'px';
        }

    }

    resizeTiles() {
        this.tiles.forEach(tile => {
            if (this.isMobeile) {
                tile.tile.style.left = tile.x * (4 + tile.tile.clientWidth) + 8 + 'px';
                tile.tile.style.top = tile.y * (4 + tile.tile.clientHeight) + 8 + 'px';
            } else {
                tile.tile.style.left = tile.x * (10 + tile.tile.clientWidth) + 15 + 'px';
                tile.tile.style.top = tile.y * (10 + tile.tile.clientHeight) + 15 + 'px';
            }
        })
    }

    handleColorClass(tile, value) {
        tile.classList.remove('game__tile--2');
        tile.classList.remove('game__tile--4');
        tile.classList.remove('game__tile--8');
        tile.classList.remove('game__tile--16');
        tile.classList.remove('game__tile--32');
        tile.classList.remove('game__tile--64');
        tile.classList.remove('game__tile--128');
        tile.classList.remove('game__tile--256');
        tile.classList.remove('game__tile--512');
        tile.classList.remove('game__tile--1024');
        tile.classList.remove('game__tile--2048');
        tile.classList.remove('game__tile--4096');
        tile.classList.remove('game__tile--8192');
        tile.classList.remove('game__tile--16384');
        tile.classList.remove('game__tile--32768');
        tile.classList.remove('game__tile--65536');
        tile.classList.remove('game__tile--131072');

        tile.classList.add(`game__tile--${value}`);
    }

    tileAnim(y, x, newY, newX) {
        let tileIndex = null;
        let tile = this.tiles.filter((tile, index) => {
            if (tile.y === y && tile.x === x) {
                tileIndex = index;
                return tile;
            }
        });
        tile = tile[0].tile;
        this.tiles[tileIndex].x = newX;
        this.tiles[tileIndex].y = newY;
        this.roundChanges = true;

        let letMergedIndex = null;
        const mergedFiles = this.tiles.filter((tile, index) => {
            if (tile.y === newY && tile.x === newX) {
                letMergedIndex = index;
                return tile;
            }
        });
        if (mergedFiles.length > 1) {
            this.tiles.splice(letMergedIndex, 1);
            setTimeout(() => {
                mergedFiles[1].tile.remove()
                mergedFiles[0].tile.querySelector('.game__tile-content').textContent = this.gameBoard[newY][newX];
                mergedFiles[0].tile.classList.add('game__tile--merged');
                this.handleColorClass(mergedFiles[0].tile, this.gameBoard[newY][newX]);
            }, 150);
        }


        if (this.isMobeile) {
            tile.style.left = newX * (4 + tile.clientWidth) + 8 + 'px';
            tile.style.top = newY * (4 + tile.clientHeight) + 8 + 'px';
        } else {
            tile.style.left = newX * (10 + tile.clientWidth) + 15 + 'px';
            tile.style.top = newY * (10 + tile.clientHeight) + 15 + 'px';
        }
    }

    onRightMove() {
        this.tiles.forEach(tile => tile.tile.classList.remove('game__tile--new'));
        this.tiles.forEach(tile => tile.tile.classList.remove('game__tile--merged'));
        this.canMove = false;
        setTimeout(() => this.canMove = true, 150);
    }

    createRandomTile() {
        const tileValue = this.getTileValue();
        const tilePosition = this.getTilePosition();
        const { y, x } = tilePosition;
        this.gameBoard[y][x] = tileValue;
        this.createTile(y, x);

        this.roundChanges = false;
    }

    setMerged(y, x) {
        this.gameMerged[y][x] = true;
        this.roundPoints += this.gameBoard[y][x];
    }

    unsetMerged() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                this.gameMerged[y][x] = false;
            }
        }
    }

    updatePoints() {
        this.roundPoints > 0 && this.points.updatePoints(this.roundPoints);
        this.roundPoints = 0;
        window.localStorage.setItem('gameBoard', JSON.stringify(this.gameBoard));
    }

    leftMove() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                if (this.gameBoard[y][x]) {
                    let newX = x;

                    while (this.gameBoard[y][newX - 1] !== undefined && this.gameBoard[y][newX - 1] === null) {
                        newX--;
                    }

                    if (this.gameBoard[y][newX - 1] !== undefined && !this.gameMerged[y][newX - 1] && this.gameBoard[y][newX - 1] === this.gameBoard[y][x]) {
                        this.gameBoard[y][newX - 1] = this.gameBoard[y][x] * 2;
                        this.setMerged(y, newX - 1);
                        this.gameBoard[y][x] = null;
                        this.tileAnim(y, x, y, newX - 1);
                    } else if (x !== newX) {
                        [this.gameBoard[y][newX], this.gameBoard[y][x]] = [this.gameBoard[y][x], null];
                        this.tileAnim(y, x, y, newX);
                    }
                }
            }
        }
    }

    upMove() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                if (this.gameBoard[y][x]) {
                    let newY = y;

                    while (this.gameBoard[newY - 1] !== undefined && this.gameBoard[newY - 1][x] !== undefined && this.gameBoard[newY - 1][x] === null) {
                        --newY;
                    }

                    if (this.gameBoard[newY - 1] !== undefined && this.gameBoard[newY - 1][x] !== undefined && !this.gameMerged[newY - 1][x] && this.gameBoard[newY - 1][x] === this.gameBoard[y][x]) {
                        this.gameBoard[newY - 1][x] = this.gameBoard[y][x] * 2;
                        this.setMerged(newY - 1, x);
                        this.gameBoard[y][x] = null;
                        this.tileAnim(y, x, newY - 1, x);
                    } else if (y !== newY) {
                        [this.gameBoard[newY][x], this.gameBoard[y][x]] = [this.gameBoard[y][x], null];
                        this.tileAnim(y, x, newY, x);
                    }
                }
            }
        }
    }

    rightMove() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = this.gameBoard.length - 1; x >= 0; --x) {
                if (this.gameBoard[y][x]) {
                    let newX = x;

                    while (this.gameBoard[y][newX + 1] !== undefined && this.gameBoard[y][newX + 1] === null) {
                        newX++;
                    }

                    if (this.gameBoard[y][newX + 1] !== undefined && !this.gameMerged[y][newX + 1] && this.gameBoard[y][newX + 1] === this.gameBoard[y][x]) {
                        this.gameBoard[y][newX + 1] = this.gameBoard[y][x] * 2;
                        this.setMerged(y, newX + 1);
                        this.gameBoard[y][x] = null;
                        this.tileAnim(y, x, y, newX + 1);
                    } else if (x !== newX) {
                        [this.gameBoard[y][newX], this.gameBoard[y][x]] = [this.gameBoard[y][x], null];
                        this.tileAnim(y, x, y, newX);
                    }
                }
            }
        }
    }

    downMove() {
        for (let y = this.gameBoard.length - 1; y >= 0; --y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                if (this.gameBoard[y][x]) {
                    let newY = y;

                    while (this.gameBoard[newY + 1] !== undefined && this.gameBoard[newY + 1][x] !== undefined && this.gameBoard[newY + 1][x] === null) {
                        ++newY;
                    }

                    if (this.gameBoard[newY + 1] !== undefined && this.gameBoard[newY + 1][x] !== undefined && !this.gameMerged[newY + 1][x] && this.gameBoard[newY + 1][x] === this.gameBoard[y][x]) {
                        this.gameBoard[newY + 1][x] = this.gameBoard[y][x] * 2;
                        this.setMerged(newY + 1, x);
                        this.gameBoard[y][x] = null;
                        this.tileAnim(y, x, newY + 1, x);
                    } else if (y !== newY) {
                        [this.gameBoard[newY][x], this.gameBoard[y][x]] = [this.gameBoard[y][x], null];
                        this.tileAnim(y, x, newY, x);
                    }
                }
            }
        }
    }

    move(e) {
        if (this.canMove) {
            switch (e.keyCode) {
                case 37:
                    this.onRightMove();
                    this.leftMove();
                    break;
                case 38:
                    this.onRightMove();
                    this.upMove();
                    break;
                case 39:
                    this.onRightMove();
                    this.rightMove();
                    break;
                case 40:
                    this.onRightMove();
                    this.downMove();
                    break;
            }

            if (this.roundChanges) {
                this.unsetMerged();
                this.createRandomTile();
                this.updatePoints();
            }
        }
    }

    touchStart(e) {
        this.touchPosition = {
            x: e.touches[0].screenX,
            y: e.touches[0].screenY,
        }
    }

    touchMove(e) {
        if (this.canMove && this.touchPosition.x !== null && this.touchPosition.y !== null) {
            const currentTouch = {
                x: e.touches[0].screenX,
                y: e.touches[0].screenY,
            }

            const touchDelta = {
                x: this.touchPosition.x - currentTouch.x,
                y: this.touchPosition.y - currentTouch.y,
            }

            if (touchDelta.x * touchDelta.x > touchDelta.y * touchDelta.y) {
                if (touchDelta.x > 30) {
                    this.onRightMove();
                    this.leftMove();
                } else if (touchDelta.x < -30) {
                    this.onRightMove();
                    this.rightMove();
                }
            } else {
                if (touchDelta.y > 30) {
                    this.onRightMove();
                    this.upMove();
                } else if (touchDelta.y < -30) {
                    this.onRightMove();
                    this.downMove();
                }
            }

            if (this.roundChanges) {
                this.unsetMerged();
                this.createRandomTile();
                this.updatePoints();
                this.touchPosition = {
                    x: null,
                    y: null,
                }
            }
        }
    }

    resetGame() {
        this.gameBoard = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        this.tiles.forEach(tile => tile.tile.remove());
        this.tiles = [];
        this.points.resetPoints();
        for (let i = 0; i < 2; ++i) {
            this.createRandomTile();
        }
        window.localStorage.setItem('gameBoard', JSON.stringify(this.gameBoard));
    }

    init() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                if (this.gameBoard[y][x]) this.createTile(y, x)
            }
        }

        if (this.tiles.length === 0) {
            for (let i = 0; i < 2; ++i) {
                this.createRandomTile();
            }
        }
        window.addEventListener('keydown', e => this.move(e));
        this.gameEl.addEventListener('touchstart', e => this.touchStart(e));
        window.addEventListener('touchmove', e => this.touchMove(e));
        this.newGameBtn.addEventListener('click', () => this.resetGame());
        window.localStorage.setItem('gameBoard', JSON.stringify(this.gameBoard));
    }
}

export default Game;