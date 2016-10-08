$(document).ready(function () {

    // GAME STATE
    var gameState = {
        blueReady: true,
        greenReady: true,
        redReady: true,
        yellowReady: true,
        pattern: [],
        playerPattern:[],
        padSpeed: 500,
        playerTurn: false,
        timer:60,
        level:1,
        gameOver: true
    };

    // CLICK FUNCTIONS

    $('.pad').click(function () {
        if (gameState.playerTurn) {
            var id = $(this).attr('id');
            // light pad
            activatePad(id);
            // add clicked pad id to playerPattern
            gameState.playerPattern.push(id);
            // check to see if playerPattern matches game pattern
            checkMatch();
        }
    });


    // DOM OPERATIONS

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
            }, speed);
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


    // play pattern
    function playPattern(pattern) {
        var counter = 0;
        var id;
        gameState.playerTurn = false;
        setInterval(function () {
            if (counter < pattern.length) {
                id = pattern[counter];
                activatePad(id, gameState.padSpeed);
                counter++;
            } else {
                gameState.playerTurn = true;
                return;
            }
        }, gameState.padSpeed + 10);
    }

    // begin game 
    function startGame() {


        function gameLoop(level){
        // add one to the pattern
        getPad();
        // playPattern
        playPattern();
        // start a timer for player to match pattern.
        startTimer();


        // if player gets it wrong, flash a modal to try again and repeat pattern (easy mode)
        }

    }

    // turn timer
    function startTimer(){
        gameState.timer = 60;
        setInterval(function(){
            if(gameState.timer > 0){
                gameState.timer --;
            }else{
                stopTimer();
                console.log('time is up!');
                loseGame();
                return;
            }
        },1000);
    }

    function stopTimer(){
        clearInterval(startTimer);
    }

    function checkMatch(){
        var playerPattern = gameState.playerPattern;
        var pattern = gameState.pattern;
        for(var i = 0; i<playerPattern.length;i++){
            if(playerPattern[i] !== pattern[i]){
                loseGame();
                return;
            }
        }
        if(playerPattern.length === pattern.length){
            levelUp();
            return;
        }
        return;
    }

    // lose the game
    function loseGame(){
        console.log('You lost!');
    }

    // level up
    function levelUp(){
        gameState.level++;
    }

    // reset game
    function resetGame() {
        gameState = {
            blueReady: true,
            greenReady: true,
            redReady: true,
            yellowReady: true,
            pattern: [],
            padSpeed: 500,
            playerTurn: false,
            gameOver: true
        };
    }



});