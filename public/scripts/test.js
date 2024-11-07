import random from "./random.js";

let currentGame = "";

const input = document.querySelector("#name");
const score = document.querySelector("#score");

const start = () => {
  fetch("/api/start-game", {
    method: "POST",
    body: JSON.stringify({
      telegram: input.value,
      email: "arttu.kaitila@gmail.com",
      timestamp: Date.now(),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        console.log(res.error);
      }
      console.log("Started game " + res.data.gameId);
      currentGame = res.data.gameId;
    });
};

const end = () => {
  fetch("/api/end-game", {
    method: "POST",
    body: JSON.stringify({
      gameId: currentGame,
      score: score.value,
      timestamp: Date.now(),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      currentGame = "";
    });
};

const highscores = () => {
  fetch("/api/highscores")
    .then((res) => res.json())
    .then((res) => console.log(res));
};

document.querySelector("#start").addEventListener("click", () => {
  start();
});
document.querySelector("#end").addEventListener("click", () => {
  end();
});

document.querySelector("#high").addEventListener("click", () => {
  highscores();
});

document.addEventListener("DOMContentLoaded", () => {
  const rand = random("abe501b8-16e9-4e89-b044-d01bdb25458");
  for (let i = 0; i < 10; i++) {
    console.log(rand());
  }
});
