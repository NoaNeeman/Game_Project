function writeToDiv(divId, htmlStr, override) {
    let d = document.getElementById(divId);
    if (override)
        d.innerHTML = htmlStr;
    else
        d.innerHTML += htmlStr;

}