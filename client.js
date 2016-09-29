$(document).ready(function () {

    // GAME STATE
    var gameState = {
        blueReady: true,
        greenReady: true,
        redReady: true,
        yellowReady: true,
        pattern: [],
        padSpeed: 500
    };

    // CLICK FUNCTIONS

    $('.pad').click(function () {
        var id = $(this).attr('id');
        activatePad(id);
    });


    // DOM OPERATIONS

    function activatePad(id) {
        var pad = '#' + id;
        var classes = $(pad).attr('class').split(' ');
        var color = classes[1];
        var lit = color + '-lit';
        var prop = color + 'Ready';
        if (gameState[prop]) {
            gameState[prop] = false;
            $(pad).toggleClass(color);
            $(pad).toggleClass(lit);
            setTimeout(function () {
                $(pad).toggleClass(lit);
                $(pad).toggleClass(color);
                gameState[prop] = true;
            }, gameState.padSpeed);
        }
    }

    // pattern creation

    function getRandom(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // generate a random pad and add it to the gameState.pattern array

    function getPad() {
        var num = getRandom(1, 4);
        var pad;
        var baseColor;
        var litColor;
        var prop;
        switch (num) {
            case 1: pad = 'blue-pad';
                break;
            case 2: pad = 'green-pad';
                break;
            case 3: pad = 'red-pad';
                break;
            case 4: pad = 'yellow-pad';
                break;
            default: console.log('broke');
        }
        gameState.pattern.push(pad);
    }

    // testing only. Fills pattern array with pad ids.

    for (var i = 0; i < 10; i++) {
        getPad();
    }

    // play pattern
    function playPattern(pattern) {
        var counter = 0;
        var id;
        setInterval(function () {
            if (counter < pattern.length) {
                id = pattern[counter];
                activatePad(id);
                counter++;
            }else{
                return;
            }
        },gameState.padSpeed);
    }

    playPattern(gameState.pattern);

    // 




});