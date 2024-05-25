for (let e of document.getElementsByClassName("playground-tab"))
    e.style.display = "none";
for (let e of document.getElementsByClassName("code-tab"))
    e.style.display = "block";

function showTab(showId, hideId) {
    document.getElementById(hideId).style.display = "none";
    document.getElementById(showId).style.display = "block";
}