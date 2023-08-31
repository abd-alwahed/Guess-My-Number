let gussedNumber = Math.floor(Math.random() * 20);
console.log(gussedNumber)
let session = pl.create();
session.consult('guess.pl');
// session.query('genNumber(X).');
// session.answer(x => {
//     // console.log(pl.format_answer(x));
//     gussedNumber = +pl.format_answer(x).split('=')[1]
//     console.log({ gussedNumber })
// })

document.querySelector('.rand').addEventListener('click', function () {
    let num = Number(document.querySelector('.inputNum').value);
    num == 0 ? num = gussedNumber : num;
    session.query(`genNumber(X,${num}).`)
    session.answer(x => {
        console.log(pl.format_answer(x));
        gussedNumber = +pl.format_answer(x).split('=')[1]
        console.log({ gussedNumber })
    })
    document.querySelector('.check').disabled = false;
})


document.querySelector('.check').disabled = true;

let state = function (message) { document.querySelector('.message').textContent = message; }
var score = 4;

document.querySelector('.score').textContent = String(score);

const guesses = [];

document.querySelector('.check').addEventListener('click', function () {

    const guess = Number(document.querySelector('.guess').value);
    guesses.push(`chosen(${guess}).`);
    session.consult(guesses.join(' '), {
        reconsult: false,
        success: () => {
            session.query(`solve(${guess}, ${gussedNumber}, X).`);
            session.answer(x => {
                const f = pl.format_answer(x);
                console.log(f === "false");
                const ans = pl.format_answer(x).split('=')[1]
                console.log(pl.format_answer(x));
                console.log(score)
                if (ans.includes('equal')) {
                    console.log("ss")
                    let audio = new Audio('WIN.mp3');
                    audio.play();
                    state("correct");
                    document.querySelector('.number').textContent = gussedNumber;
                    document.querySelector('body').style.backgroundColor = '#43b047';
                    document.querySelector('.number').style.width = '30 rem';
                    document.getElementById("btn").disabled = true;
                } else if (ans.includes('greater')) {
                    missSound()
                    score--;
                    document.querySelector('.score').textContent = String(score);
                    state("it's higher");
                } else if (ans.includes('lower')) {
                    missSound()
                    score--;
                    document.querySelector('.score').textContent = String(score);
                    state("it's lower");
                } else if (ans.includes("lost")) {

                    document.querySelector('.message').textContent = "faild";
                    document.querySelector('body').style.backgroundColor = '#e4000f';
                    score = 0;
                    document.getElementById("btn").disabled = true;
                    let audio = new Audio('GAMEOVER.mp3');
                    audio.play();



                }

                session.query('getChosen(L).');
                session.answer((s) => {
                    document.getElementById('moves').textContent = pl.format_answer(s).split('=')[1]
                })
                document.querySelector('.score').textContent = String(score);
            })
        }
    },);
    /* 
        if (!guess) {
            state("Plz enter a number");
        } else
        if (guess == comp) {
            state("correct");
            document.querySelector('.number').textContent = comp;
            document.querySelector('body').style.backgroundColor = '#60b347';
            document.querySelector('.number').style.width = '30 rem';
            let highS = Number(document.querySelector('.highscore').textContent);
            if (score > highS)
                document.querySelector('.highscore').textContent = score;
        } else if (guess != comp) {
            if (guess > comp && score != 0) {
                state("it's lower");
            } else if (guess < comp && score != 0) {
                state("it's higher");
            }
            score--;
        }
     */

})

function missSound() {
    let audio = new Audio('MISS.mp3');
    audio.play();
}
document.querySelector('.again').addEventListener('click', function () {


    window.location.reload(true);
})