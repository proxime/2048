import './styles/index.scss'
import Game from './js/Game';
import Points from './js/Points';

const points = new Points();
const game = new Game(points);
points.initPoints();
game.init();

window.addEventListener("keydown", function (e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

