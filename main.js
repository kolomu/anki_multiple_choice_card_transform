const fs = require('node:fs');

const title = "Morning Quiz";

let cardsString = `#separator:tab
#html:false
#tags column:12
`;
const skippedQuestionsBecauseTooManyChoices = [];

try {
    const data = fs.readFileSync('./data/input.txt', 'utf8');
    let questionsWithAnswers = data.split("<< QUESTION >>");
    questionsWithAnswers.shift();

    questionsWithAnswers.forEach(current => {
        const questionWithAnswers = current.split("~~ ANSWER ~~")[0];
        const correctAnswerStr = current.split('~~ ANSWER ~~')[1];
        const correctAnswerArr = getCorrectAnswers(correctAnswerStr);
        const questionWithAnswersCleaned = removeAndTrimEmptyEntries(questionWithAnswers.split('\n'));
        const amountOfQuestionElements = countArrElementsUntilSeperatorA(questionWithAnswersCleaned);
        const question = getQuestionFromQuestionAnswerArr(questionWithAnswersCleaned, amountOfQuestionElements).join(' ');
        const answersArr = extractAnswers(removeAndTrimEmptyEntries(getAnswersFromQuestionAnswerArr(questionWithAnswersCleaned, amountOfQuestionElements)).join(' '));

        if (answersArr.length > 5) {
            skippedQuestionsBecauseTooManyChoices.push(question);
        } else {
            // There has to be atleast 5 choices
            while (answersArr.length < 5) {
                answersArr.push('');
            }
            cardsString += buildQuestionAnswerString(question, title, answersArr, correctAnswerArr)
        }
    });

    fs.writeFileSync('./data/anki_cards.txt', cardsString);
  
    console.log("Skipped this question because more than 5 possible choices are available:");
    console.log(skippedQuestionsBecauseTooManyChoices.join('\n'));

} catch (err) {
    console.error(err);
}

function removeAndTrimEmptyEntries(arr) {
    return arr
        .map(e => e.trim())
        .filter(n => n);
}

function countArrElementsUntilSeperatorA(arr) {
    let amount = 0;
    for (let i = 0; i < arr.length; i++) {
        const currentLine = arr[i].trim();
        if (currentLine.startsWith('A. ')) {
            break;
        }
        amount++;
    }

    if (arr.length - 1 == amount) {
        console.error("This should not happen arr.length == amount");
    }
    return amount;
}

function getAnswersFromQuestionAnswerArr(arr, lengthOfQuestion) {
    var retArr = [];
    for (let i = lengthOfQuestion; i < arr.length; i++) {
        retArr.push(arr[i]);
    }
    return retArr;
}

function getQuestionFromQuestionAnswerArr(arr, lengthOfQuestion) {
    var retArr = [];
    for (let i = 0; i < lengthOfQuestion; i++) {
        retArr.push(arr[i]);
    }
    return retArr;
}

function buildQuestionAnswerString(question, title, answerPossibilitiesArr, correctAnswersArr) {
    const tabSeperator = `	`;
    const cardAnswerType = correctAnswersArr.length > 1 ? 1 : 2; // 1 = Multiple Choice // 2 = single choice
    const answerPossibilityStr = removeCapitalLettersFromAnswers(answerPossibilitiesArr).join(tabSeperator);
    const correctAnswerStr = mapAnswersToBooleanString(correctAnswersArr, createPossibleAnswers(answerPossibilitiesArr));
    return `${question}${tabSeperator}${title}${tabSeperator}${cardAnswerType}${tabSeperator}${answerPossibilityStr}${tabSeperator}${correctAnswerStr}			\n`;
}

function createPossibleAnswers(answerPossibilitiesArr) {
    answerPossibilitiesArr = answerPossibilitiesArr.filter( e => e);
    possibleAnswers = ['A.', 'B.', 'C.', 'D.', 'E.', 'F'];
    return answerPossibilitiesArr.map((_, idx) => possibleAnswers[idx]);
}

function mapAnswersToBooleanString(answers, possibleAnswers) {
    return possibleAnswers
        .map(option => answers.includes(option) ? '1' : '0')
        .join(' ');
}

function getCorrectAnswers(answerStr) {
    return answerStr
        .replace('and', ',')
        .split(',')
        .map(e => e.trim() + '.')
}

function extractAnswers(text) {
    const answers = text.split(/\b(?=[A-F]\.)/); // Split by capital letter followed by a dot

    const extractedAnswers = answers.map(answer => {
        const match = answer.match(/^([A-F]\.)\s*(.*)/); // Extract answer and description
        if (match) {
            return `${match[0]}`;
        } else {
            return null;
        }
    }).filter(Boolean); // Filter out null values

    return extractedAnswers;
}

function removeCapitalLettersFromAnswers(answersArr) {
    return answersArr
        .join(';;')
        .replace('A. ', '')
        .replace('B. ', '')
        .replace('C. ', '')
        .replace('D. ', '')
        .replace('E. ', '')
        .split(';;')
}
