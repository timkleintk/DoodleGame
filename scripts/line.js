// line class ----------------------------------------------------
function Line() {
    this.length = lineLength;
    this.people = [];

    this.state = "done";

    // populate
    for (let i = 0; i < this.length; i++) {
        this.people.push(new Person(i * personSpacing, 100));
    }
    this.people[this.length - 1].state = "aanDeBeurt";

    this.update = function () {

        // update the peoples
        this.people.forEach((p, i) => {
            p.update();
            if (p.state === "offScreen") {
                this.people.splice(i, 1);
                this.people.unshift(new Person(-personSpacing, 100));
                this.state = "shuffling";
            }
        });

        if (this.state === "shuffling") {
            // gap in the line

            this.state = "shuffled";
            this.people.forEach((p, i) => {
                if (i * personSpacing - p.posX < walkSpeed) {
                    p.posX += i * personSpacing - p.posX;
                } else {
                    p.posX += walkSpeed;
                    this.state = "shuffling";
                }
            });
            if (this.state === "shuffled") {
                // done shuffling
                this.people[this.length - 1].state = "aanDeBeurt";
            }
        }
    }

    this.show = function () {
        this.people.forEach(p => { p.show(); })
    }
}