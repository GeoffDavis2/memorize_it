console.log("\033c");

const fs = require('fs');
const readlineSync = require('readline-sync');

let testbank = [];

const dynamicSort = (property) => {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => ((a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0) * sortOrder;
}

const genMultiplicationTestJson = () => {
    const returnQuestionObject = (q, a, askedDt) => ({ q, a, askedCt: 0, guessedCt: 0, missedCt: 0, timeCt: 0, askedDt });
    const now = Date.now();

    for (let n1 = 0; n1 <= 12; n1++) for (let n2 = 0; n2 <= 12; n2++) {
        if ([0, 1, 2, 5, 10, 11].includes(n1) || [0, 1, 2, 5, 10, 11].includes(n2)) { initValue = now } else { initValue = now - 86400000 };
        testbank.push(returnQuestionObject(`${n1} * ${n2} = `, n1 * n2, initValue));
    };

    fs.writeFileSync('multiplication.json', JSON.stringify(testbank));
}

const giveTest = (testbank) => {
    readlineSync.question(`Hit Enter to start test...`);
    testbank.every(obj => {
        console.log("\033c\u001b[1;37m");
        const startTime = Date.now();
        let ans = readlineSync.question(`${obj.q}`);
        const delay = Date.now() - startTime;
        if (ans.toUpperCase() === "X") return false;
        obj.askedCt++;
        obj.timeCt += delay;
        obj.askedDt = Date.now();
        if (ans.includes("?")) {
            obj.guessedCt++;
            ans = ans.replace("?", "");
        }
        if (obj.a.toString() !== ans) {
            obj.missedCt++;
            readlineSync.question(`\u001b[1;31mWRONG ANSWER!!!\u001b[1;32m ${obj.q}${obj.a}\u001b[1;37m, hit Enter for the next question...`);
        }
        return true;
    });
};

// genMultiplicationTestJson();
testbank = JSON.parse(fs.readFileSync('multiplication.json'));

// testbank = testbank.sort((a, b) => a.askedDt - b.askedDt);
testbank = testbank.sort((a, b) => (b.timeCt / b.askedCt) - (a.timeCt / a.askedCt));

giveTest(testbank);

// testbank = testbank.sort((a, b) => a.askedDt - b.askedDt);
testbank = testbank.sort((a, b) => (b.timeCt / b.askedCt) - (a.timeCt / a.askedCt));
console.table(testbank);

readlineSync.question(`Hit Enter to update the Testbank file...`);
fs.writeFileSync('multiplication.json', JSON.stringify(testbank));

// const xx = Date.now();
// console.log(Date(xx));