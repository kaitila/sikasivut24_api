const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const ticket = document.querySelector(".ticket");
const error = document.querySelector(".error");

async function validateTicket(id) {
  const res = await fetch("/api/verify-ticket", {
    method: "POST",
    body: JSON.stringify({
      gameId: id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((res) => res.json());

  if (!res.error) {
    return true;
  } else {
    return false;
  }
}

validateTicket(id).then((res) => {
  if (res) {
    const imgSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${id}&amp;size=200x200`;
    document.querySelector(".ticket-qr").src = imgSrc;
  } else {
    ticket.classList.add("none");
    error.classList.remove("none");
  }
});
