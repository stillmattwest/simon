$('document').ready(function () {
    // gameState object stores important variables
    // game state object
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
        gameOver: true,
        easyMode: true
    };

    // handle it when player clicks start
    $('#start').click(function () {
        startGame();
    });

    $('.radio-btn').click(function () {
        $('.radio-btn').removeClass('radio-btn-lit');
        $(this).addClass('radio-btn-lit');
        var id = $(this).parent().attr('id');
        if (id === 'easy') {
            gameState.easyMode = true;
        } else {
            gameState.easyMode = false;
        }
    });


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
            padSpeed: 500,
            playerTurn: false,
            timer: 60,
            gameOver: true,
            easyMode: gameState.easyMode
        };
    }

    // run one turn
    function gameTurn() {
        // if timer exists, reset it
        if (window.turnTimer) {
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
        clearInterval(window.turnTimer);
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
                clearInterval(playlist);
                gameState.playerTurn = true;
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
            if (!gameState.gameOver) {
                $.playSound('./sounds/' + color + '-' + speed);
            } else {
                $.playSound('./sounds/lose');
            }
            setTimeout(function () {
                $(pad).toggleClass(lit);
                $(pad).toggleClass(color);
                gameState[prop] = true;
            }, speed - 100);
        }
    }

    // handle player clicking pad
    $('.pad').click(function () {
        if (gameState.playerTurn) {
            var id = '#' + $(this).attr('id');
            // add clicked pad id to playerPattern
            gameState.playerPattern.push(id);
            // check to see if playerPattern matches game pattern
            checkMatch(id);
        } else {
            return;
        }
    });

    // checkMatch function
    function checkMatch(id) {
        var playerPattern = gameState.playerPattern;
        var pattern = gameState.pattern;
        var lastIndex = playerPattern.length - 1;
        if (playerPattern[lastIndex] === pattern[lastIndex]) {
            // light pad
            activatePad(id, gameState.padSpeed);
            // check to see if playerPattern and pattern are same length. If so, start new turn
            if (playerPattern.length === pattern.length) {
                if(playerPattern.length === 20){
                    winGame();
                }
                setTimeout(function () {
                    gameTurn();
                }, 1000);
            }
        } else {
            loseGame(pattern[lastIndex]);
        }
    } // end checkMatch function

    // loseGame function
    function loseGame(id) {
        gameState.gameOver = true;
        gameState.playerTurn = false;
        activatePad(id, 1000);
        stopTimer();
        setTimeout(function () {
            if (gameState.easyMode) {
                alert('Easy mode. Try again!');
                setTimeout(function () {
                    gameState.gameOver = false;
                    gameState.playerPattern = [];
                    playPattern(gameState.pattern);
                }, 1000);
            } else {
                alert('Strict mode. Game over. Click start to begin a new game.');
                resetGame();
            }
        }, 2000);

    }

    function winGame(){
        setTimeout(function(){
            gameState.playerTurn = false;
            stopTimer();
            alert('That\'s 20, you win!');
            resetGame();
        },gameState.padSpeed);
    }


}); // end document read