// Data is formatted as "x units used/wasted/etc today" : units per year
let dataUsed = {}
let data = {
    " more million liters used": 4000000000000,
    " more deaths due to a lack of clean water": 829000,
    " more liters wasted": 7728353000000,
    " more tons of waste in the ocean": 730000000,
    " less tons of polar ice": 1200000000000,
    " more microplastic particles in you": 80000,


}

let dataCount = Object.keys(data).length;

for (key in Object.keys(data)) {
    dataUsed[key] = false;
}

function tryFindFree(label, retries) {
    if (dataUsed[label] && retries < dataCount * 5) {
        let keys = Object.keys(data);
        label = keys[Math.floor(Math.random() * keys.length)];
        retries++;
        log("retrying label")
        return tryFindFree(label, retries);
    } else {
        dataUsed[label] = true;
        log("found label")
    }
}
class DataCounter {
    constructor(element, labelElement) {
        let keys = Object.keys(data);
        this.label = keys[Math.floor(Math.random() * keys.length)];
        if (dataUsed[this.label]) {
            this.label = tryFindFree(this.label, 50)
        }

        this.data = data[this.label];
        this.dom = element;
        this.domLabel = labelElement;

        this.dom.textContent = this.getData();
        this.domLabel.textContent = this.label + " today.";

        this.delay = Math.floor(Math.random() * 350);
    }

    update() {
        setTimeout(() => {
            this.dom.textContent = this.getData();
        }, this.delay)
    }

    getData() {
        let dt = new Date()
        let secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
        let millis = dt.getMilliseconds() + secs * 1000;
        return Math.floor(this.data / 365 / 24 / 3600 / 1000 * millis).toLocaleString('en-US');
    }
}