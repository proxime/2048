class Game {
    constructor() {
        this.points = 0;
        this.tilesEl = document.querySelector('.game__tiles');

        this.gameBoard = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        this.gameMerged = [
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ]

        this.tiles = [];
        this.canMove = true;
        this.roundChanges = false;
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
        tile.style.left = x * (10 + tile.clientWidth) + 15 + 'px';
        tile.style.top = y * (10 + tile.clientHeight) + 15 + 'px';
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
        tile.style.left = newX * (10 + tile.clientWidth) + 15 + 'px';
        tile.style.top = newY * (10 + tile.clientHeight) + 15 + 'px';
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
    }

    unsetMerged() {
        for (let y = 0; y < this.gameBoard.length; ++y) {
            for (let x = 0; x < this.gameBoard.length; ++x) {
                this.gameMerged[y][x] = false;
            }
        }
    }

    move(e) {
        if (this.canMove) {
            switch (e.keyCode) {
                case 37:
                    this.onRightMove();
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
                    if (this.roundChanges) {
                        this.unsetMerged();
                        this.createRandomTile();
                    }
                    break;
                case 38:
                    this.onRightMove();
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
                    if (this.roundChanges) {
                        this.unsetMerged();
                        this.createRandomTile();
                    }
                    break;
                case 39:
                    this.onRightMove();
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
                    if (this.roundChanges) {
                        this.unsetMerged();
                        this.createRandomTile();
                    }
                    break;
                case 40:
                    this.onRightMove();
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
                    if (this.roundChanges) {
                        this.unsetMerged();
                        this.createRandomTile();
                    }
                    break;
            }
        }
    }

    init() {
        for (let i = 0; i < 2; ++i) {
            this.createRandomTile();
        }
        window.addEventListener('keydown', e => this.move(e))
    }
}

export default Game;