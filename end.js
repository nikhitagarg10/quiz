const username = document.getElementById('username');
const savescorebtn = document.getElementById('savescorebtn');
const mostrecentscore = localStorage.getItem('mostrecentscore');
const finalscore = document.getElementById('finalscore');

const highscore = JSON.parse(localStorage.getItem("highscores")) || [];

finalscore.innerText = mostrecentscore;

const MAX_QUES = 5;

username.addEventListener('keyup', () => {
	savescorebtn.disabled = !username.value;
});


function savehighscore(event) {
	event.preventDefault();

	const score = {
		'name': username.value,
		'score': mostrecentscore
	};

	highscore.push(score);
	highscore.sort((a,b) => b.score - a.score);
	highscore.splice(5);

	localStorage.setItem("highscores", JSON.stringify(highscore));
	window.location.assign("index.html");
};
