console.log("\033c");
const fs = require('fs');
let testbank = [];

const dynamicSort = (...args) => {
    const sortOrder = [];
    args = args.map(arg => {
        if (arg[0] === "-") {
            sortOrder.push(-1);
            arg = arg.substr(1);
        }
        else sortOrder.push(1);
        return arg;
    });
    return (a, b) => {
        // Using for instead of forEach because forEach will not break out of the loop at the "return"...
        for (let i = 0; i < args.length; i++) {
            if (a[args[i]] > b[args[i]]) return 1 * sortOrder[i];
            if (a[args[i]] < b[args[i]]) return -1 * sortOrder[i];
        }
        return 0;
    };
}

const genMultiplicationTestJson = () => {
    const returnQuestionObject = (q, a, weight) => ({ q, a, askedCt: 0, missedCt: 0, timeCt: 0, lastAsked: null, weight });
    
    for (let n1 = 0; n1 <= 12; n1++) for (let n2 = 0; n2 <= 12; n2++) {
        let initValue = 0;
        if ([7,8,9,12].includes(n1) || [7,8,9,12].includes(n2)) initValue = 10;
        if (n1 === 5 || n2 === 5) initValue = -1;
        if (n1 === 2 || n2 === 2) initValue = -2;
        if ([10, 11].includes(n1) || [10, 11].includes(n2)) initValue = -3;
        if ((n1 === 11) && (n2 === 11)) initValue = -4;
        if ([0, 1].includes(n1) || [0, 1].includes(n2)) initValue = -5;
        testbank.push(returnQuestionObject(`${n1} * ${n2} = `, n1 * n2, initValue));
    };

}

genMultiplicationTestJson();
testbank = testbank.sort((a, b) => b.weight - a.weight);
console.table(testbank);
fs.writeFileSync('multiplication.json', JSON.stringify(testbank));