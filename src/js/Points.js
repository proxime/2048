class Points {
    constructor() {
        this.points = window.localStorage.points && !isNaN(window.localStorage.points) ? Number(window.localStorage.points) : 0;
        this.prevPoints = null;
        this.record = window.localStorage.record && !isNaN(window.localStorage.record) ? Number(window.localStorage.record) : 0;
        this.pointsEl = document.querySelector('.header__current-points p');
        this.reacordEl = document.querySelector('.header__record-points p');
    }

    initPoints() {
        this.pointsEl.textContent = this.points;
        this.reacordEl.textContent = this.record;
    }

    updateRecord() {
        this.record = this.points;
        window.localStorage.record = this.points;
        this.reacordEl.textContent = this.points;
    }

    updatePoints(value) {
        this.prevPoints = this.points;
        this.points += value;
        window.localStorage.points = this.points;
        this.pointsEl.textContent = this.points;
        if (this.points > this.record) this.updateRecord();
    }

    setPrevPoints() {
        if (this.prevPoints !== null) {
            this.points = this.prevPoints;
            this.prevPoints = null;
            window.localStorage.points = this.points;
            this.pointsEl.textContent = this.points;
            if (this.points > this.record) this.updateRecord();
        }
    }

    resetPoints() {
        this.points = 0;
        this.prevPoints = null;
        this.pointsEl.textContent = this.points;
        window.localStorage.points = this.points;
    }

    getPoints() {
        return this.points;
    }
}

export default Points;