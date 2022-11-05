// var jsondata;

// fetch("cyrillic.json")
//     .then(response => response.json())
//     .then(json => console.log(json))
//     .then(tmp => tmp);



// fetch("cyrillic.json")
//     .then(res => res.json())
//     .then(data => jsondata = data)
//     .then(() => console.log(jsondata))

// console.log(jsondata);

var tmp = [];

$.getJSON("cyrillic.json", function (data) {
    tmp = data;
});

console.log(tmp);


var myJson;

function get_something() {
    $.getJSON("cyrillic.json", function (json) {
        myJson = json;
        console.log(myJson);
    });
}

console.log(get_something());






var letterC;
var letterL;
var indexOfLetterC;
var startTime;
var endTime;
var cyrillic = ['А', 'Б', 'В', 'Г', 'Д', 'E', 'Ж', 'З', 'И', 'Й', 'K', 'Л', 'M', 'Н', 'O', 'П', 'Р', 'С', 'T', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ь', 'Ю', 'Я'];
var latin = ['A', 'B', 'V', 'G', 'D', 'E', 'Ž', 'Z', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Č', 'Š', 'ŠT', ' ', ' ', 'JU', 'JA'];
var result = [];

function start() {
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("countdown").style.visibility = "visible";
    $('.dBox').each(function () {
        mainLetter(this);
        var letter = $('#letter').attr('value');
        if (letter.length == 2) {
            setTimeout(() => {
                twoLetters();
            }, 100);
        }
    });
}

function removeItems(arr, item) {
    for (var i = 0; i < item; i++) {
        arr.pop();
    };
};

function cyrillicLetters($this) {
    var x = $($this);
    letterC = cyrillic[Math.floor(Math.random() * cyrillic.length)];
    indexOfLetterC = cyrillic.indexOf(letterC);
    letterL = latin[indexOfLetterC]

    x.html('<p class="cyrillic">' + letterC + '</p><p class="latin">' + letterL + '</p>');
};

function mainLetter($this) {
    var x = $($this);
    letterC = cyrillic[Math.floor(Math.random() * cyrillic.length)];
    indexOfLetterC = cyrillic.indexOf(letterC);
    letterL = latin[indexOfLetterC];

    x.html('<p id="letter" value="' + letterL + '">' + letterC + '</p><br><input class="form-control form-control-sm form-width" type="hidden" id="input">');
    startTime = new Date().getTime();
};

function twoLetters() {
    var letterL = $('#letter').attr('value');
    var letterC = $('#letter').text();
    var boolean = '';
    var field = document.getElementById('input');
    field.type = 'text';
    var isFocuse = (document.activeElement === field);
    if (isFocuse === true) {
        // nothing
    } else {
        field.focus();
    };
    $("#input").on('keyup', function () {
        if (field.value.length == 2) {
            if (field.value.toUpperCase() == letterL) {
                endTime = (new Date().getTime() - startTime) / 1000;
                removeItems(result, 2);
                var tmpLetter = letterL + '(' + letterC + ')';
                var tmpTime = endTime / 2;
                var tmpField = field.value.toUpperCase();
                boolean = true;
                var tmpResult = {
                    L: tmpLetter,
                    F: tmpField,
                    T: tmpTime,
                    B: boolean
                };
                result.push(tmpResult);
                $('.dBox').each(function () {
                    mainLetter(this);
                    var letter = $('#letter').attr('value');
                    if (letter.length == 2) {
                        setTimeout(() => {
                            twoLetters();
                        }, 100);
                    }
                });
                $('.box').each(function () {
                    cyrillicLetters(this);
                });
            } else {
                endTime = (new Date().getTime() - startTime) / 1000;
                removeItems(result, 2);
                var tmpLetter = letterL + '(' + letterC + ')';
                var tmpTime = endTime / 2;
                var tmpField = field.value.toUpperCase();
                boolean = false;
                var tmpResult = {
                    L: tmpLetter,
                    F: tmpField,
                    T: tmpTime,
                    B: boolean
                };
                result.push(tmpResult);
                field.value = '';
                $('.box').each(function () {
                    cyrillicLetters(this);
                });
            };
        };
    });
};

$(document).ready(function () {
    $('.box').each(function () {
        cyrillicLetters(this);
    });
    // $('.dBox').each(function(){
    //     mainLetter(this);
    //     var letter = $('#letter').attr('value');
    //     if (letter.length == 2){
    //         setTimeout(() => { twoLetters(); }, 100);
    //     }
    // });
});

$(document).keypress(function (event) {
    endTime = (new Date().getTime() - startTime) / 1000;
    var pressedK = String.fromCharCode(event.which).toUpperCase();
    var letterL = $('#letter').attr('value');
    var letterC = $('#letter').text();
    var boolean = '';
    if (pressedK === letterL) {
        $('.dBox').each(function () {
            mainLetter(this);
            boolean = true;
            var letter = $('#letter').attr('value');
            if (letter.length == 2) {
                setTimeout(() => {
                    twoLetters();
                }, 100);
            };
        });
        $('.box').each(function () {
            cyrillicLetters(this);
        });
    } else {
        boolean = false;
        $('.box').each(function () {
            cyrillicLetters(this);
        });
    };
    var tmpLetter = letterL + '(' + letterC + ')';
    var tmpResult = {
        L: tmpLetter,
        F: pressedK,
        T: endTime,
        B: boolean
    };
    result.push(tmpResult);
    console.log(result);
});