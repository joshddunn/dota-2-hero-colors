var app = angular.module('myapp',[]);

app.controller('main', function($scope, $http) {

    $http.get('heroNames.json')
        .then(function(success) {
            $scope.heroes = success.data.result.heroes;
            $scope.heroFunc();
        });

    $scope.heroFunc = function() {
        $scope.heroes = $scope.heroes.map(e => e.name.replace("npc_dota_hero_",'') );

        $scope.output = {};

        $scope.heroes.forEach(e => {
            $scope.output[e] = '#';
        });
    }

    $scope.draw = function(imga,hero) {
        var c = document.getElementById('canvas');
        var ctx = c.getContext('2d');

        ctx.fillStyle = "white";
        ctx.fillRect(0,0,c.width,c.height);

        ctx.drawImage(imga,0,0);

        var i = ctx.getImageData(0,0,c.width,c.height).data;

        var rgba = [0,0,0,0];

        var length = i.length;

        for(var j = 0; j < length; j++) {
            rgba[j%4] += i[j];
        }

        rgba = rgba.map(e => ~~(4*e/length));

        document.getElementById('preview').style.background = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`

        function hex(c) {
            var hex = "0" + c.toString(16);
            return hex.substr(-2);
        }

        function toHex(r, g, b) {
            return '#' + hex(r) + hex(g) + hex(b);
        }

        $scope.output[hero] = toHex(rgba[0], rgba[1], rgba[2]);
        
    }

    $scope.load = function(hero) {
        var imga = new Image;
        imga.onload = function() {
            $scope.draw(imga,hero);
        }
        imga.src = `./full/${hero}_full.png`;
    }

    $scope.begin = function() {
        Object.keys($scope.output).forEach(function(key,index) {
            $scope.load(key);
        });
    }

    $scope.printResultToConsole = function() {
        console.log($scope.output);
    }
});