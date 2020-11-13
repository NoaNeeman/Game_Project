$(document).ready(function () {
    $("#Start").click(f2);
    $("#ContinueG").click(getLocal);
    $("#help").click(getHelp);
    $("img").on("error" ,function () {
        this.attr("src", "https://preview.pixlr.com/images/800wm/100/1/1001435038.jpg")
    })
}); // end of ready

//cheat - show the right and wrong answers
function f1() {
    for (var i = 0; i < obj.questions[obj.pickedQue].ans.length; i++) {
        if (i == obj.questions[obj.pickedQue].right_ans)
            document.getElementById(i).style.background = "#00b800"
        else {
            document.getElementById(i).style.background = "#282828"
        }
    }
    cheated = true;
    localStorage.setItem("cheated", JSON.stringify(cheated));
    var audio = new Audio("sounds/cheatSound.wav");
    $("#cheat").fadeOut(1000);
    audio.play();
}

//play again 
function plyAgain() {
    var audio = new Audio("sounds/loading.mp3");
    play();
    audio.play();
    document.getElementById("help").innerHTML = "(3) hints";
    $("#fire").hide();
    $("#wow").hide();
    $("#goodJob").hide();
    $("#scR").hide();
    $("#star").hide();
    pickMovie();
    $("#progress").show();
}

//get a hint - only 3 hints allowed
function getHelp() {
    hlp = [];
    dup_ans = obj.questions[obj.pickedQue].ans;
    for (var i = 0; i < dup_ans.length; i++) {
        if (i !== obj.questions[obj.pickedQue].right_ans) {
            hlp.push(i);
        }
    }
    let faded = [];
    for (var i = 0; i < 2; i++) {
        hlp = hlp.filter(function (element) {
            return element !== undefined;
        })
        let rnd = Math.floor(Math.random() * hlp.length);
        let x = hlp[rnd];
        $("#" + x).fadeOut(1000);
        faded.push(x);
        delete hlp[rnd];
    }

    hintFaded = faded;
    localStorage.setItem("hintFaded", JSON.stringify(hintFaded));
    hintFaded = [];
    if (hints > 0) {
        hints--;
    }
    localStorage.setItem("hints", JSON.stringify(hints));
    var audio = new Audio("sounds/usedHint.wav");
    switch (hints) {
        case 2:
            document.getElementById("help").innerHTML = "(2) hints";
            audio.play();
            $("#help").fadeOut(1000);
            break;
        case 1:
            document.getElementById("help").innerHTML = "(1) hints";
            audio.play();
            $("#help").fadeOut(1000);
            break;
        case 0:
            $("#help").hide();
            break;
        default:
            console.log('only 3 hints allowed')
    }
}

//start game
function play() {
    document.getElementById("progress").value = 0;
    prV = document.getElementById("progress").value;
    obj = {
        GenresOfMovie: [],
        CountriesOfMovie: [],
        LanguageOfMovie: [],
        DirectorOfMovie: [],
        ActorsOfMovie: [],
        questions: [],
        level: 1,
        num: 0,
        dup_array: [],
        str1: "",
        disqualification: 5, // פסילה
        score: 0, // ניקוד
        pickedQue: 0,
    }
    cheated = false;
    hints = 3;
    hintFaded = [];
    document.getElementById("help").innerHTML = "(" + hints + ") hints";
    create();
    pickMovie();
}

//into local storage
function intoLocal() {
    localStorage.setItem("obj", JSON.stringify(obj));
    localStorage.setItem("hints", JSON.stringify(hints));
    localStorage.setItem("cheated", JSON.stringify(cheated));
}

//get from local storage
function getLocal() {
    if (localStorage.length == 0)
        f2();
    else {
        $("#ContinueG").hide();
        $("#Start").hide();
        $("#trivia").hide();
        $("#cheat").show();
        $("#progress").show();

        obj = JSON.parse(localStorage.getItem("obj"));
        if (typeof (localStorage.getItem("hints")) !== 'undefined')
            hints = JSON.parse(localStorage.getItem("hints"));
        else
            hints = 3;

        document.getElementById("help").innerHTML = "(" + hints + ") hints";

        if (hints > 0)
            $("#help").show();

        prV = JSON.parse(localStorage.getItem("prV"));
        document.getElementById("progress").value = prV;
        writeToDiv("ph", obj.str1, true);

        if (typeof (localStorage.getItem("hintFaded")) !== 'undefined')
            hintFaded = JSON.parse(localStorage.getItem("hintFaded"));

        cheated = JSON.parse(localStorage.getItem("cheated"));
        plyAns();
    }
}

//pick a movie
function pickMovie() {
    $("#progress").show();
    if (hints > 0)
        $("#help").show();
    $("#cheat").show();
    hintFaded = [];
    cheated = false;
    localStorage.setItem("hintFaded", JSON.stringify(hintFaded));
    chkNum();
    obj.num++;
    obj.questions = [{
        que: "?לאיזה ז'אנר שייך הסרט",
        ans: [],
        right_ans: ""
    },
    {
        que: "?מי הבמאי של הסרט",
        ans: [],
        right_ans: ""
    },
    {
        que: "?מהי שפת הסרט",
        ans: [],
        right_ans: ""
    },
    {
        que: "?באיזו מדינה יצא הסרט לאקרנים",
        ans: [],
        right_ans: ""
    },
    {
        que: "?איזה שחקן שיחק בסרט",
        ans: [],
        right_ans: ""
    }
    ]
    obj.str1 = "";
    obj.str1 += "<h1 class='h1S lvl'>Level: " + obj.level + "</h1><p class='pS'>&#9617 &nbsp Score: " + obj.score + "&nbsp &#9617 &nbsp Lives: &#129505 x " + obj.disqualification + "&nbsp &#9617</p>";
    let x = pickMovLev();
    obj.str1 += "<h1 class='h1S'>" + movies[x].title + "</h1>" + "<img src = ' " + movies[x].poster_path + "' />";
    obj.pickedQue = Math.floor(Math.random() * obj.questions.length);
    pickedCat = chkQue(obj.pickedQue, x);
    obj.str1 += "<h2 class='h2S'>" + obj.questions[obj.pickedQue].que + "</h2>";
    writeToDiv("ph", obj.str1, true);
    remove_cat(pickedCat, obj.dup_array);
}

//level of movie
function pickMovLev() {
    area = Math.floor(movies.length / 3) - 1;
    rnd = 0;
    switch (obj.level) {
        case 1:
            rnd = Math.floor(Math.random() * area);
            //שליש ראשון במערך הסרטים
            break;
        case 2:
            rnd = Math.floor(Math.random() * area) + area;
            //שליש שני במערך הסרטים
            break;
        case 3:
            rnd = Math.floor(Math.random() * area) + (2 * area);
            //שליש שלישי במערך הסרטים
            break;
        default:
            console.log('error: level does not exist');
    }
    return rnd
}

//level up
function chkNum() {
    ck = false;
    if (obj.num == 5)
        ck = true;
    if (ck) {
        obj.num = 0;
        obj.level++;
        levelUp();
    }
}

//start game - effects and loading 
function f2() {
    var audio = new Audio("sounds/loading.mp3");

    $("#loadingImg").fadeIn(500, function () {
        play();
        $("#loadingImg").hide();
    });
    $("#Start").hide();
    $("#ContinueG").hide();
    $("#trivia").hide();
    document.getElementById("help").innerHTML = "(3) hints";
    $("#ph").hide();
    $("#ph2").hide();
    $("#ph3").hide();
    $("#cheat").hide();
    $("#help").hide();
    $("#fire").hide();
    $("#wow").hide();
    $("#scR").hide();
    $("#lostL").hide();
    $("#bonusLife").hide();
    $("#goodJob").hide();
    $("#star").hide();
    audio.play();
    $("#ph").show();
    $("#ph2").show();
    $("#ph3").show();
}

//level up - effects and loading
function levelUp() {
    $("#ph").hide();
    $("#ph2").hide();
    $("#ph3").hide();
    $("#cheat").hide();
    $("#progress").hide();
    $("#loadingImg").hide();
    $("#help").hide();
    $("#scR").hide();
    $("#lostL").hide();
    $("#bonusLife").hide();
    $("#LevelUp").show();
    $("#LevelUp").fadeOut(2000, function () {
        var audio = new Audio("sounds/getReady.wav");
        $("#getReady").show();
        audio.play();
        $("#getReady").fadeOut(2000, function () {
            $("#ph").show();
            $("#ph2").show();
            $("#ph3").show();
            $("#cheat").show();
            $("#progress").show();
            if (hints > 0)
                $("#help").show();
        })
    });
}

//pick a suitable array by question categories
function chkQue(ind, mov) {
    switch (ind) {
        case 0:
            res = movies[mov].genre.split(", ");
            obj.dup_array = obj.GenresOfMovie.slice();
            break;
        case 1:
            res = movies[mov].director.split(", ");
            obj.dup_array = obj.DirectorOfMovie.slice();
            break;
        case 2:
            res = movies[mov].language.split(", ");
            obj.dup_array = obj.LanguageOfMovie.slice();
            break;
        case 3:
            res = movies[mov].country.split(", ");
            obj.dup_array = obj.CountriesOfMovie.slice();
            break;
        case 4:
            res = movies[mov].actors.split(", ");
            obj.dup_array = obj.ActorsOfMovie.slice();
            break;
        default:
            console.log('error: picked question not found');
    }
    return res
}

//create arrays for questions about movies: genres, languages, directors, actors, countries
function create() {
    for (var i = 0; i < movies.length; i++) {
        checkCateg(movies[i].genre.split(", "), obj.GenresOfMovie);
        checkCateg(movies[i].language.split(", "), obj.LanguageOfMovie);
        checkCateg(movies[i].director.split(", "), obj.DirectorOfMovie);
        checkCateg(movies[i].actors.split(", "), obj.ActorsOfMovie);
        checkCateg(movies[i].country.split(", "), obj.CountriesOfMovie);
    }
}

//creates the arrays without duplicates
function checkCateg(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        ck = true;
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) {
                ck = false;
                break;
            }
        }
        if (ck)
            arr2.push(arr1[i]);
    }
}

//shuffle - put the right answer randomly
function shuf(arr, x) {
    indx = Math.floor(Math.random() * obj.questions[obj.pickedQue].ans.length + 1);
    arr.splice(indx, 0, x);
    obj.questions[obj.pickedQue].right_ans = indx;
}

//remove right answers from array and randomly pick wrong answers (for distraction)
function remove_cat(arr1, arr2) {
    ind = Math.floor(Math.random() * arr1.length);
    rans = arr1[ind];
    for (var i = 0; i < arr2.length; i++) {
        for (var j = 0; j < arr1.length; j++) {
            if (arr2[i] == arr1[j]) {
                delete arr2[i];
                break;
            }
        }
    }
    for (var i = 0; i < 3; i++) {
        arr2 = arr2.filter(function (element) {
            return element !== undefined;
        })
        let x = Math.floor(Math.random() * arr2.length);
        obj.questions[obj.pickedQue].ans[i] = arr2[x];
        delete arr2[x];
    }
    shuf(obj.questions[obj.pickedQue].ans, rans);
    plyAns();
}

//show buttons with 4 answers (1 right, 3 wrong) for the question
function plyAns() {
    strS = "";
    strF = "";
    for (var i = 0; i < obj.questions[obj.pickedQue].ans.length; i++) {
        if (i % 2 == 0)
            strS += "<button class='myButton' id='" + i + "' onclick='chkScore(this); rgtOrWrong(this)'>" + obj.questions[obj.pickedQue].ans[i] + "</button>"
        else
            strF += "<button class='myButton' id='" + i + "' onclick='chkScore(this); rgtOrWrong(this)'>" + obj.questions[obj.pickedQue].ans[i] + "</button>"

    }
    writeToDiv("ph2", strS, true);
    writeToDiv("ph3", strF, true);
    if (hintFaded.length > 0)
        getFaded();
    if (cheated) {
        $("#cheat").hide();
        f1();
    }
    intoLocal();
}

//hint - fade 2 wrong answers
function getFaded() {
    for (var i = 0; i < hintFaded.length; i++) {
        $("#" + hintFaded[i]).hide();
    }
    var audio = new Audio("sounds/usedHint.wav");
    $("#help").hide();
    audio.play();
}

//check score - life, if needed - game over (4 options)
function chkScore(elm) {
    if (elm.id == obj.questions[obj.pickedQue].right_ans) {
        //right answer
        obj.score++;
        var audio = new Audio("sounds/coin.wav");
        $("#scR").css("display", "flex");
        $("#scR").show();
        audio.play();
        $("#scR").fadeOut(1000);
        if (obj.num == 1 && (obj.level == 3 || obj.level == 2)) {
            var audio = new Audio("sounds/bonus.wav");
            audio.play();
            $("#bonusLife").css("display", "flex");
            $("#bonusLife").show();
            $("#bonusLife").fadeOut(1000);
            obj.disqualification++;
        }

    }
    else {
        //wrong answer
        obj.disqualification--;
        var audio = new Audio("sounds/life.wav");
        $("#lostL").css("display", "flex");
        $("#lostL").show();
        audio.play();
        $("#lostL").fadeOut(1000);
    }
    if (obj.disqualification == 0 || (obj.level == 3 && obj.num == 5)) {
        //game over
        str = "";
        if (obj.score < 5) {
            var audio = new Audio("sounds/win1.wav");
            $("#star").show();
            str += "<h1 class='h1S'>Failure doesn't mean</h1><h1 class='h1S'> THE GAME IS OVER.</h1><h1 class='h1S'>It means TRY AGAIN</h1><h1 class='h1S'> with experience.</h1>";
            audio.play();
        }
        else if (obj.score >= 5 && obj.score < 10) {
            var audio = new Audio("sounds/win2.mp3");
            $("#wow").show();
            str += "<h1 class='h1S'>You were getting CLOSER</h1><h1 class='h1S'>to the highest score</h1><h1 class='h1S'> in the game.</h1>";
            audio.play();
        }
        else if (obj.score >= 10 && obj.score < 15) {
            var audio = new Audio("sounds/win3.wav");
            $("#goodJob").show();
            str += "<h1 class='h1S'>You were SO CLOSE</h1><h1 class='h1S'>to reach the highest score</h1><h1 class='h1S'> in the game.</h1>";
            audio.play();
        }
        else {
            var audio = new Audio("sounds/win4.mp3");
            $("#fire").show();
            str += "<h1 class='h1S'>Congratulations!</h1><h1 class='h1S'>You've got</h1><h1 class='h1S'>THE HIGHEST SCORE</h1><h1 class='h1S'> in the game</h1>";
            audio.play();
        }
        writeToDiv("ph", str + "<h2 class='h2S f-red mt-20'> Your final score was " + obj.score + "</h2><button class='mt-20 special StartEnd' onclick='plyAgain()'> Play Again </button>", true)
        $("#cheat").hide();
        $("#scR").hide();
        $("#lostL").hide();
        $("#help").hide();
        $("#bonusLife").hide();
        $("#progress").hide();
        writeToDiv("ph2", "", true);
        writeToDiv("ph3", "", true);
        localStorage.clear();
    }
    else {
        setTimeout(pickMovie, 500);
        setTimeout(progressChange, 500);
    }
}

//user chose right/wrong answer
function rgtOrWrong(elm) {
    if (elm.id == obj.questions[obj.pickedQue].right_ans) {
        i = elm.id;
        $("#" + i).css("background", "linear-gradient(to bottom, #51ea35 5%, #2b0000 100%)");

    }
    else {
        r = obj.questions[obj.pickedQue].right_ans;
        i = elm.id;
        $("#" + r).css("background", "linear-gradient(to bottom, #0cc600 5%, #addd61 100%)");
        $("#" + i).css("background", "linear-gradient(to bottom, #84251d 5%, black 100%)");
    }
}

// progress bar
function progressChange() {
    document.getElementById("progress").value++;
    prV = document.getElementById("progress").value;
    localStorage.setItem("prV", JSON.stringify(prV));
}