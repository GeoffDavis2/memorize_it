console.log("\033c");

const fs = require('fs');
const readlineSync = require('readline-sync');

let testbank = [];

const giveTest = (testbank, weightLimit) => {
    readlineSync.question(`Hit Enter to start test...`);
    testbank.some(obj => {
        console.log("\033c");
        console.log("\u001b[1;37m");
        console.log('Enter...');
        console.log('  Q to Quit the test');
        console.log('  S to Skip the question');
        console.log('  R to perminantly Remove the question');
        console.log("  X if you don't know the answer");
        if (obj.weight < weightLimit) return;
        console.log(`Question Weight: ${obj.weight}\n`);
        let dunno = false;
        const startTime = Date.now();
        let ans = readlineSync.question(`${obj.q}`);
        const delay = Date.now() - startTime;
        if (ans.toUpperCase() === "Q") return true;
        if (ans.toUpperCase() === "S") return;
        if (ans.toUpperCase() === "R") {
            obj.weight = -Infinity;
            return;
        }
        obj.askedCt++;
        obj.timeCt += delay;
        obj.weight += (delay / 10000 - .25);
        obj.lastAsked = Date.now();
        if (ans.toUpperCase() === "X") {
            obj.missedCt++;
            obj.weight += 5;
            dunno = true;
        }
        if (!dunno && obj.a.toString() !== ans) {
            const keep = readlineSync.question(`\u001b[1;31mWRONG ANSWER!!!\n\n\u001b[1;32m ${obj.q}${obj.a}\u001b[1;37m,\n\nIf you really guessed the wrong answer enter "X" to log the mistake.\nOtherwise just hit Enter for the next question...`);
            if (keep.toUpperCase() === "X") {
                obj.missedCt++;
                obj.weight += 5;
            } ;
        }
    });
    return true;
};

testbank = JSON.parse(fs.readFileSync('multiplication.json'));

testbank = testbank.sort((a, b) => b.weight - a.weight);
giveTest(testbank, 0);
testbank = testbank.sort((a, b) => b.weight - a.weight);

console.table(testbank);

readlineSync.question(`Hit Enter to update the Testbank file...`);
fs.writeFileSync('multiplication.json', JSON.stringify(testbank));