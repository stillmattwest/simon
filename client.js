$('document').ready(function () {
    // gameState object stores important variables
    // GAME STATE
    var gameState = {
        blueReady: true,
        greenReady: true,
        redReady: true,
        yellowReady: true,
        pattern: [],
        playerPattern: [],
        padSpeed: 500,
        playerTurn: false,
        timer: 60,
        gameOver: true
    };

    // handle it when player clicks start
    $('#start').click(function () {
        startGame();
    });


    // start game function
    // begin game 
    function startGame() {
        resetGame();
        gameState.gameOver = false;
        gameTurn();
    }

    // reset game function
    // reset game
    function resetGame() {
        gameState = {
            blueReady: true,
            greenReady: true,
            redReady: true,
            yellowReady: true,
            pattern: [],
            playerPattern: [],
            padSpeed: 600,
            playerTurn: false,
            timer: 60,
            gameOver: true
        };
    }

    // run one turn
    function gameTurn() {
        // if timer exists, reset it
        if(window.turnTimer){
            stopTimer();
        }
        // reset playerPattern
        gameState.playerPattern = [];
        // add one to the pattern
        getPad();
        // playPattern after one second
        setTimeout(function () {
            playPattern(gameState.pattern);
        }, 1000, startTimer());
        // start a timer for player to match pattern.
    }

    // getPad function
    function getPad() {
        var num = getRandom(1, 4);
        var pad;
        switch (num) {
            case 1: pad = '#blue-pad';
                break;
            case 2: pad = '#green-pad';
                break;
            case 3: pad = '#red-pad';
                break;
            case 4: pad = '#yellow-pad';
                break;
            default: console.log('it broke');
        }
        gameState.pattern.push(pad);
    }

    // get random function
    function getRandom(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // start and stop timer functions
    // set timer for 60 seconds and start
    function startTimer() {
        gameState.timer = 60;
        window.turnTimer = setInterval(function () {
            if (gameState.timer > 0) {
                gameState.timer--;
            } else {
                stopTimer();
                console.log('time is up!');
                loseGame();
                return;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(turnTimer);
    }

    // playPattern function
    // play pattern
    function playPattern(pattern) {
        var counter = 0;
        var id;
        gameState.playerTurn = false;
        var playlist = setInterval(function () {
            if (counter < pattern.length) {
                id = pattern[counter];
                activatePad(id, gameState.padSpeed);
                counter++;
            } else {
                counter = 0;
                gameState.playerTurn = true;
                clearInterval(playlist);
                return;
            }
        }, gameState.padSpeed);
    }

    // activatePad function
    function activatePad(id, speed) {
        var pad = id;
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
            }, speed -100);
        }
    }

    // handle player clicking pad
    $('.pad').click(function () {
        if (gameState.playerTurn) {
            var id = '#' + $(this).attr('id');
            // light pad
            activatePad(id, 350);
            // add clicked pad id to playerPattern
            gameState.playerPattern.push(id);
            // check to see if playerPattern matches game pattern
            checkMatch();
        }
    });

    // checkMatch function
    function checkMatch() {
        var playerPattern = gameState.playerPattern;
        var pattern = gameState.pattern;
        var lastIndex = playerPattern.length - 1;
        if (playerPattern[lastIndex] === pattern[lastIndex]) {
            // check to see if playerPattern and pattern are same length. If so, start new turn
            if (playerPattern.length === pattern.length) {
                setTimeout(function () {
                    gameTurn();
                }, 1000);
            }
        } else {
            loseGame();
        }
    } // end checkMatch function

    // loseGame function
    function loseGame() {
        gameState.gameOver = true;
        stopTimer();
        console.log('You lost!');
    }

}); // end document ready