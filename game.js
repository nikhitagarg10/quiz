const question = document.getElementById('ques');
const choices =  Array.from(document.getElementsByClassName('choice-option'));
const questionCountertext = document.getElementById('progresstext');
const scoretext = document.getElementById('score');
const progressbarfull = document.getElementById('progressbarfull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let questions = [];

fetch(
	"https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
)
	.then(res => {
		return res.json();
	})
	.then(loadedquestions => {
		questions = loadedquestions.results.map(loadedquestion => {
			const formattedquestion = {
				question: loadedquestion.question
			};

			const answerchoices = [...loadedquestion.incorrect_answers];
			formattedquestion.answer = Math.floor(Math.random()*3) + 1;
			answerchoices.splice(formattedquestion.answer-1, 0, 
												loadedquestion.correct_answer);

			answerchoices.forEach((choice, index) => {
				formattedquestion['choice'+ (index+1)] = choice;
			});

			return formattedquestion;
		});
		startGame();
	})
	.catch(err => {
				console.error(err); 
	});


const max_ques = 10;
const correct_bonus = 10;

let score = 0;
let questionCounter = 0;
let curr = {};
let availablequestions = [];
let accept_ans = false;

function startGame() 
{
	questionCounter = 0;
	score = 0;
	availablequestions = [...questions]
	GetQues()
	loader.classList.add('hidden');
	game.classList.remove('hidden');
};

function GetQues() 
{
	if(availablequestions.length == 0 || questionCounter > max_ques) {
		localStorage.setItem('mostrecentscore', score);
		return window.location.assign("end.html");
	}

	questionCounter++;
	questionCountertext.innerText = `Question: ${questionCounter}/${max_ques}`;
	progressbarfull.style.width = `${(questionCounter/max_ques)*100}%`

	const quesindex = Math.floor(Math.random() * availablequestions.length);
	curr = availablequestions[quesindex];
	question.innerText = curr.question;

	choices.forEach(choice => {
		const num = choice.dataset['number'];
		choice.innerText = curr['choice' + num];
	});

	availablequestions.splice(quesindex, 1);
	accept_ans = true;
};

choices.forEach(choice => {
	choice.addEventListener('click', e => {
		if(!accept_ans) return;

		accept_ans = false;
		const select_choice = e.target;
		const select_ans = select_choice.dataset['number'];
		
		let classtoapply = 'incorrect';
		if (select_ans == curr.answer) {
			classtoapply = 'correct';
			increement(correct_bonus);
		}

		select_choice.parentElement.classList.add(classtoapply);
		setTimeout(() =>{
			select_choice.parentElement.classList.remove(classtoapply);
			GetQues();
		}, 1000);
	});
});

function increement(num) {
	score += num;
	scoretext.innerText = score;
}
