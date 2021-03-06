/*
*
*     Project: https://github.com/11100/friday-weekend-diary/
*
*     Define following global functions first:
*
* (1) fridayWeekendEntertainmentClicked(lotteryCode, lotteryKey, clickedEntertainmentId, event);
* (2) fridayWeekendLotteryLiveResults(lotteryCode, lotteryKey, winnerEntertainmentId);
* (3) fridayWeekendLotteryLoaded(lotteryData);
*
*     Visit www.fridayweekend.com API reference to understand more.
*
 */

jQuery.fn.reverse = [].reverse;
jQuery.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};

var keydownFuze = true;
var PAGE_SIZE = 4;
var order = 0;
var storyProcessors = [[]];
var colors = [[]];
var fwcStoryPrefix = "http://www.fridayweekend.com/rest/sms/story/";
var fwcWinnerPrefix = "http://www.fridayweekend.com/rest/getLotteryResults/";
var fwcPrefix = "http://www.fridayweekend.com/rest/getLottery/";
var fwcSuffix = "?callback=storyProcessors";
var fwcStorySuffix = "?callback=fillStory";

$(document).ready(function(){
    var style = 
        "li.icon{                                        " +
        "       cursor:pointer;                          " +
        "}                                               " +
        "li.icon img{                                    " +
        "       max-width:90%;                           " +
        "       max-height:99%;                          " +
        "       border:none;                             " +
        "       position:relative;                       " +
        "       z-index:1;                               " +
        "       margin:0 auto;                           " +
        "       float:left;                              " +
        "}                                               " +
        "li.next{                                        " +
        "       margin-left: -2em;                       " +
        "       width:100%;                              " +
        "       background:white;                        " +
        "       z-index:1000;                            " +
        "       position:relative;                       " +
        "       position: absolute;                      " +
        "       left: 2.5em;                             " +
        "       bottom: 0;                               " +
        "       float: none !important;                  " +
        "}                                               " +
        "li.next a{                                      " +
        "       visibility:hidden;                       " +
        "       margin-left:.75ex;                       " +
        "       display:block;                           " +
        "       height:32px;                             " +
        "       width:32px;                              " +
        "       background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABTtJREFUeJzt3U9oHGUcxvHv701KNqAlaQ+baw/VTWkDioo99SI2B0t26yGoh1gE9VIKnvRiWvHiwYto9aISED3EkCkoLQpCvIsYaxspghWF5GDVFkFKO6+XBouQdrP7zsw77z6f8867Q59vd/OXgIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIjExcp6orm5ucbVq1ef8N4/5r3f65wbBX733n8LnMmy7Juy7iVCNjMzc9A5d8R7P2Vm4977v733P5rZlzt27Di7uLh4vZAnLuLQ/z9Hp9N5DngdaG71IO/910NDQ8eXlpZWS7inaLTb7Ue892875x7e6jF5nv/qnHt5eXn5Y8CHfP5CA5ienh5pNBoLZjbbzePzPL9uZs9mWfZJkfcVi3a7/bz3/rRzbqjLSz64cuXKCysrKzdC3UO3T7xt09PTI6Ojo4tmdrTba8xsyMyOtlqtn9fW1r4r6t5i0Ol0jpvZaTNz27jsgUajcX+z2cwuX76ch7iPQgLYHB840sPlZmYzKUfQ6XSOA2/1cq2Z7R8ZGblvYmLiTIgIggfQ5/ibko2gn/E3mdn+0dHRvc1ms+8ItvPyc1fz8/Ou0Wh8RH/jbzIz+7Ddbs8FOCsKIca/zVPj4+Pv0ufHcUFfAXbt2nXCzF4KeGQyrwSBxwfAzB7ct2/fTxcvXuz5M6dgnwXMzMyMOed+Ae4NdeZtvPf+WJZlCwWcXbgixt+U5/n62NjYnoWFhX96uT7YW4Bz7mmKGR9q/HZQ5PgAzrmJa9euzfR8fagb8d4fDnXWFmoXQdHjb8rzvOd/+2ABmFkr1Fl3fpp6RFDW+ADe+8lerw35WcA9Ac+6k+gjKHN8ADPr+a03ZAB/BjzrbqKNoOzxAczsj16vDRnA+YBndSO6CKoY/5bve70w5McAn4U6a3tPG0cEFY4P8HmvF4b8NPBTYCPUedtQeQRVjp/n+aXh4eFzvV4f7CuBFy5cuNFqtX4zsydDnbkNlX3FsOL/+TjnnllaWrrU6/VBvxS8trZ2fnJychx4NOS5XSo9gqrH996fXF5efr+fM4J+MwhgamrqJeC90Od2qbS3gwjGfyPLstf6PSf4t4NXVlb87Ozs2Y2NjSbwUOjzu1D4K0Ek479CgB8PK+QHQlKOIKXxocAfCUsxgtTGhwIDgLQiSHF8KDgASCOCVMeHEgKAekeQ8vhQUgBQzwhSHx9KDADqFcEgjA8lBwD1iGBQxocKAoC4Ixik8aGiACDOCAZtfCjx18O3Mj8/71ZXV98BXqzoFrz3/piZ7WTAxocIAoA4IqDCf4uqxocK3wJuF8PbQQXPCVQ7PkQSAEQRQemqHh8iCgAGK4IYxofIAoDBiCCW8SHCACDtCGIaHyINANKMILbxIeIAIK0IYhwfIg8A0ogg1vGhBgFAvSOIeXyoSQBQzwhiHx9qFADUK4I6jA81CwDqEUFdxocaBgBxR1Cn8aGmAUCcEdRtfKhxABBXBHUcH2oeAMQRQV3HhwQCgGojqPP4kEgAUE0EdR8fEgoAyo0ghfEhsQCgnAhSGR8SDACKjSCl8SHRAKCYCFIbHxIOAMJGkOL4kHgAECaCVMeHAQgA/otgfX19p5kd3M613vuTWZa9SoLjQyS/GVSmTqfTAd4E9tzpcXmer5nZiSzLvijnzqoxcAEAHDp0aHj37t2P37x587BzrsWtv3SS5/lfZvaDc+7cgQMHvjp16lSQv80nIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiLSv38BYeOka7164mgAAAAASUVORK5CYII=);" +
        "       cursor:pointer;                          " +
        "       background-size:contain;                 " +
        "}                                               " +
        "li.prev{                                        " +
        "       margin-left: -2em;                       " +
        "       width:100%;                              " +
        "       margin-bottom: -1ex;                     " +
        "       background:white;                        " +
        "       z-index:1000;                            " +
        "       position:relative;                       " +
        "}                                               " +
        "li.prev a{                                      " +
        "       visibility:hidden;                       " +
        "       margin-left:.75ex;                       " +
        "       display:block;                           " +
        "       height:32px;                             " +
        "       width:32px;                              " +
        "       background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABPxJREFUeJzt3UFoHFUcx/H//wWJBSE2ElYviqBmBppeRFAoOXmIVmES40FBpZdgq4inXvckgigexBaDFw9KFJKZ6MFaUcm5rpYg6culoF4aIixac9DE+XswfyhI2mTyZua9t7/Psey8HfL7kpRNNiECAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgPBw2zfQhrm5uds2NjammHmKmceJ6A4iIhG5TkRXiOjLfr//9crKyk6rN9qAgQtgenr6WRF5m5nvvdnjyrK8SkSvLy8vf9HQrbViqO0baEq32zWjo6PvEtE7zDxyq8cz81Fmfi5N09uttd82cIutGIgAut2uWV1dfZ+IXq1w+Yk0Te+01n7l+r58EH0AN4z/8iGOeTTWCKIOwNH4KsoIog3A8fgqugiiDKCm8VVUEUQXQM3jq2giiCqAhsZXUUQQTQANj6+CjyCKAFoaXwUdQfABtDy+CjaCoAPwZHwVZATBBuDZ+Cq4CIIMwNPxVVARBBeA5+OrYCIIKoBAxldBRBBMAIGNr7yPIIgAAh1feR2B9wEEPr7yNgKvA4hkfOVlBN4GENn4yrsIvAwg0vGVVxF4F0Dk4ytvIvAqgAEZX3kRgTcBDNj4qvUIvAjAg/GF2nuXVKsRtB6AD+OLyClmvkBET7V0D61F0GoAvoxfFMVH1tpemqbXaMAiaC0An8bXfxjECFoJwMfx1aBF0HgAPo+vBimCRgMIYXw1KBE0FkBI46tBiKCRAEIcX8UeQe0BhDy+stb2kiTZYOboIqg1gBjGV9ba72OMoLYAYhpfxRhBLQHEOL6KLQLnAcQ8voopAucB7P4qtiq/jcuF2sdXnkQwbK395jCHOA1gZmbmeSJ6y+WZB9DY+MqDCE4kSXLZWrte9QBn3wOfnZ09sr29fdUYc7erMw+g8fFvlGXZaWY+18Zzl2X5c6fTeXB+fn67yvXG1Y3s7Ow8M4jjExEVRXFeRM608dzGmPs2NzcrfwZyFgAzP+nqrANofXzVZgQiUvlj7ywAIjrm8Kz98GZ81VYEIlL5Y+8sABG55S9gdsi78VUbERhjjla+1uF9XHd41s14O75qOoKyLP+oeq3LAK44PGsv3o+vmozAGLNW+VpXNyEiF1ydtfdThDG+KoriPBG9UvfziEjlVwRdBvAZEfVdnff/48MaX+V5fo5qjKAsy2sjIyN51eudvRK4vr7+d5Ikv9fwqliw4ytr7aU0TTeJ6KTrs40xZxYWFn6oer3Tl4Kttb3x8fEHmPm4oyODH1/VEYGIfJjn+RuHOcPlfwKJiKTT6ZwioiUXZ8UyvnL55UBEPun3+6fpv7e1Veb8u4G9Xq+cnJzMt7a2jjFzWvGY6MZXLj4T7I7/kos/a1fLD4T0er1yYmIiL8tygoiSA14e7fjqMBG4HJ+oxh8JW1tb+2c3gvuJaL//J/iLiF4oiuLjuu7LF9baS0mS/MrMJ2mfX4pF5IN+vz/n8g9aNvGWaM6y7EURedMYc89eDxKR75j5tTzPf2rgnryRZdnDzPweET2212NE5BdjzNmlpaVPXT9/Y++Jn5qaGh4eHn6CiB4nooeMMUeI6DcRuTw0NPT54uLij03di4c4y7JHmPlpETkuIncx858ism6MuTg2Nnax6vf7AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBP8CDvybBYGXG0UAAAAASUVORK5CYII=);" +
        "       cursor:pointer;                          " +
        "       background-size:contain;                 " +
        "}                                               " +
        ".fridayweekend {                                " +
        "       width: 95%;                              " +
        "       min-width: 800px;                        " +
        "}                                               " +
        ".entries {                                      " +
        "       width: 95%;                              " +
        "       overflow: hidden;                        " +
        "       margin-left:1ex;                         " +
        "}                                               " +
        ".descriptor {                                   " +
        "       width: 99%;                              " +
        "}                                               " +
        ".fridayweekend img {                            " +
        "       width: 101px;                            " +
        "}                                               " +
        ".fridayweekend .entertainments {                " +
        "       height: 95px;                            " +
        "       width: 10000px;                          " +
        "       overflow: hidden;                        " +
        "}                                               " +
        ".transition {                                   " +
        "      -webkit-transition: all 0.9s;             " +
        "      -moz-transition: all 0.9s;                " +
        "      -o-transition: all 0.9s;                  " +
        "      transition: all 0.9s;                     " +
        "}                                               " +
        ".fridayweekend li.yes{                          " + 
        "	background:#abcdef;                      " + 
        "}                                               " +
        ".fridayweekend li.may{                          " + 
        "	background:#abcdef;                      " + 
        "}                                               " +
        ".fridayweekend li.not, .fridayweekend li.yet{   " + 
        "	background:#white;                       " + 
        "}                                               " +
        ".fridayweekend ul{                              " + 
        "	float:left;                              " + 
        "       padding:1ex;                             " +
        "}                                               " +
        ".fridayweekend li.name{                         " + 
        "       padding-top:2em;                         " +
        "}                                               " +
        ".fridayweekend li.lottery{                      " + 
        "       width: 99%;                              " +
        "	clear:both;                              " + 
        "}                                               " +
        ".fridayweekend li{                              " + 
        "	float:left;                              " + 
        "	clear:none;                              " + 
        "       list-style:none;                         " + 
        "}                                               " +
        ".fridayweekend .offset,                         " +
        ".fridayweekend .winner, .fridayweekend .www{    " + 
        "	display:none;                            " + 
        "}                                               " +
        ".fridayweekend .date {                          " +
        "  -webkit-transform: rotate(-90deg);            " +
        "  -moz-transform: rotate(-90deg);               " +
        "  -ms-transform: rotate(-90deg);                " +
        "  -o-transform: rotate(-90deg);                 " +
        "  transform: rotate(-90deg);                    " +
        "   -webkit-transform-origin: 50% 50%;           " +
        "  -moz-transform-origin: 50% 50%;               " +
        "  -ms-transform-origin: 50% 50%;                " +
        "  -o-transform-origin: 50% 50%;                 " +
        "  transform-origin: 50% 50%;                    " +
        "   filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);" +
        "   margin-top:4.6em;                            " +
        "   width:2em;                                   " +
        "   margin-left: -2em;                           " +
        "}                                               " +
        ".fridayweekend .date a{                         " +
        "   text-decoration:none;                        " +
        "   color:white;                                 " +
        "   background-color:#25ace4;                    " +
        "   display:block;                               " +
        "   width:6em;                                   " +
        "}                                               ";

    $("head").append($("<style></style>").text(style));

    var point = $(".fridayweekend").data("story");
    var script = document.createElement('script');
    script.src = fwcStoryPrefix + point + fwcStorySuffix;
    $("head").append(script);
});

var fillStory = function(data){
    if(data.length){
        var story = "";
        $(data).each(function(i,v){
            story = story + v.topic + ",";
        });
        story = story.slice(0, -1);
        $(".fridayweekend").data("story", story);
        processPreparedStories();
    }
}

var processPreparedStories = function(){

    $(".fridayweekend").each(function(index,elem){

        var prev = $("<li class='prev'><a></a></li>");
        var next = $("<li class='next'><a></a></li>");

        prev.click(function(event){
            var lottery = $(event.target).parent().parent();
            var story = lottery.data("story").split(",").reverse();
            var start = lottery.data("start");
            var index = lottery.data("index");
            var i = storyProcessors[index].length;
            if(start > 0){
                lottery.data("start", --start);
                $(".next").children().first().css("visibility", "visible");
                if(start == 0){
                    $(".prev").children().first().css("visibility", "hidden");
                }
                var arr = story[start].split("-");
                var id=arr[0];
                var key=arr[1];
                var color=arr[2];
                var processor = new LotteryProcessor(index, false, i);
                storyProcessors[index].push(processor);
                var access = id + "-" + key;
                if(!(access in colors)){
                    colors[access] = [];
                }
                colors[access].push(color);
                var script = document.createElement('script');
                script.src = fwcPrefix+id+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLotteryUp";
                $("head").append(script);
            }
        });

        next.click(function(event){
            var lottery = $(event.target).parent().parent();
            var story = lottery.data("story").split(",").reverse();
            var start = lottery.data("start");
            var index = lottery.data("index");
            var i = storyProcessors[index].length;
            if(start < story.length - PAGE_SIZE){
                lottery.data("start", ++start);
                $(".prev").children().first().css("visibility", "visible");
                if(start == story.length - PAGE_SIZE){
                    $(".next").children().first().css("visibility", "hidden");
                }
                var arr = story[start+PAGE_SIZE - 1].split("-");
                var id=arr[0];
                var key=arr[1];
                var color=arr[2];
                var processor = new LotteryProcessor(index, false, i);
                storyProcessors[index].push(processor);
                var access = id + "-" + key;
                if(!(access in colors)){
                    colors[access] = [];
                }
                colors[access].push(color);
                var script = document.createElement('script');
                script.src = fwcPrefix+id+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLotteryDown";
                $("head").append(script);
            }
        });

        $(prev).prependTo($(this));
        $(next).appendTo($(this));
        var note = $(this).data("story").split(",").reverse();
        note = note.slice(0,PAGE_SIZE);
        $(this).addClass("fwc-"+index);
        $(this).data("start",0);
        $(this).data("index",index);
        var delay = 0;
        
        $(note).each(function(i,v){
            condition = (index == $(".fridayweekend").length - 1) && (i == $(note).length - 1);
            var arr = v.split("-");
            var key = arr[1];
            var code = arr[0];
            var color = arr[2];
            var processor = new LotteryProcessor(index, condition, i);
            storyProcessors[index].push(processor);
            var access = code + "-" + key;
            if(!(access in colors)){
                colors[access] = [];
            }
            colors[access].push(color);
            var script = document.createElement('script');
            setTimeout(function(){
                script.src = fwcPrefix+code+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLottery";
                $("head").append(script);
            }, delay*753);
            delay++;
        });
    });
}

var LotteryProcessor = function(index, last, localOrder){
    this.last = last;
    this.i = index;
    this.order = localOrder;

    this.processLotteryUp = function(data){
        setTimeout(function(i){
            $(".fwc-"+i).children(".lottery").first().css("margin-top", 0);
        }, 100, this.i);
        $(".fwc-"+this.i).children(".lottery").last().remove();
        storyProcessors[this.i][this.order].insertLottery(data, false);
    }

    this.processLotteryDown = function(data){
        var i;
        var lottery;
        var lotteries = $(".fwc-"+this.i).children(".lottery");
        for(i = 0; i < PAGE_SIZE; i++){
            lottery = lotteries[i];
            if($(lottery).css("margin-top") == "0px"){
                break;
            }
        }
        $(lottery).addClass("transition");
        $(lottery).css("margin-top", "-120px");
        setTimeout(function(i){
            $(".fwc-"+i).children(".lottery").first().remove();
        }, 1000, this.i);
        storyProcessors[this.i][this.order].insertLottery(data, true);
    }

    this.applySingleResult = function(winnerId, id, key){
        $(".lottery.code-"+id+".key-"+key).removeClass("live");
        $(".lottery.code-"+id+".key-"+key+" .date").removeClass("blink");
        $(".lottery.code-"+id+".key-"+key+" .entry").removeClass("may");
        $(".lottery.code-"+id+".key-"+key+" .entry").removeClass("yet");
        $(".lottery.code-"+id+".key-"+key+" .entry.id-"+winnerId).addClass("yes");
        try{
            fridayWeekendLotteryLiveResults(id, key, winnerId);
        } catch(err) {
            // silent
        }
    }

    this.processLotteryWinner = function(results){
        var applySingleResult = this.applySingleResult;
        var id = this.id;
        var key = this.key;
        $(results).each(function(i,e){
            if(e.players.length){
                $(e.players).each(function(j,u){
                    if($.inArray(u.name, colors[id + "-" + key]) >= 0){
                        applySingleResult(e.entertainmentId, id, key);
                    }
                });
            }
        });
    }

    this.insertLottery = function(data, bDown){
        this.id = data.code;
        this.key = data.key;

        var lotteryDate = data.date;
        var lotteryTimezoneOffset = data.timezoneOffset;
        var browserTimezoneOffset = (new Date).getTimezoneOffset();
        var gmtJsonGenerationDateTime = data.gmtJsonGenerationDateTime;
        var browserFragmentGenerationTime = Date.now();
        var timeZoneAdjusted = lotteryDate + (lotteryTimezoneOffset - browserTimezoneOffset)*60*1000;
        var clientServerDiff = browserFragmentGenerationTime + browserTimezoneOffset*60*1000 - gmtJsonGenerationDateTime;
        var adjustedLotteryDateTime = timeZoneAdjusted + clientServerDiff;
        var d = new Date(adjustedLotteryDateTime);
        var dd = d.getDate();
        var m =  d.getMonth() + 1;
        var y = d.getFullYear();
        var h = d.getHours();
        var mm = d.getMinutes();
        var dateString = dd + "." + m + "." + y + "<br/>" + h + ":" + mm;
	var fwc = $(".fwc-" + this.i);
	var lottery = $("<ul class='descriptor'></ul>");
	var li = $("<li class='lottery code-"+data.code+" key-"+data.key+"'></li>");
	var winner =  $("<li class='winner'><span>"+data.hasResults+"</span></li>");
        var href = "http://www.fridayweekend.com/show?code="+data.code+"&amp;key="+data.key;
	var date =  $("<li class='date'><a href='"+href+"' target='_new'>"+dateString+"</a></li>");
	var offset =  $("<li class='offset'><span>"+data.timezoneOffset+"</span></li>");
	var entries = $("<li class='entries'></li>");
	var entertainments = $("<ul class='entertainments'></ul>");

        if(data.hasResults == false){
            li.addClass("live");
            date.addClass("blink");
            var eta_ms = d.getTime() - Date.now() + 1234;
            var timeout = setTimeout(function(id,key,index,i){
                var script = document.createElement('script');
                script.src = fwcWinnerPrefix+id+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLotteryWinner";
                $("head").append(script);
            }, eta_ms, data.code, data.key,this.i,this.order);
        }

	$(data.entertainments).each(function(){
	    var entry = $("<li class='entry id-"+this.id+"'></li>");
            var currentEntertainment = this.id;
            var currentKey = this.key;
            if(data.hasResults == true){
                $(data.results).each(function(i,e){
                    if(currentEntertainment == e.entertainmentId && e.players.length){
                        $(e.players).each(function(j,u){
                            if($.inArray(u.name, colors[data.code + "-" + data.key]) >= 0){
                                entry.addClass("yes");
                            }
                        });
                    } else {
                        entry.addClass("not");
                    }
                });
            } else {
                entry.addClass("yet");
            }
	    var entertainment = $("<ul class='entertainment'></ul>");
	    var icon = $("<li class='icon'><img src='http://www.fridayweekend.com/"+this.icon+"'/></li>");
            icon.click(function(event){
                try{
                    fridayWeekendEntertainmentClicked(data.code, data.key, this.id, event);
                } catch(err){
                    // silent
                }
            });
	    var name = $("<li class='name'><span>"+this.name+"</span></li>");
	    var www = $("<li class='www'><span>"+this.www+"</span></li>");
	    entertainment.append(icon);
	    entertainment.append(www);
	    entertainment.append(name);
	    entry.append(entertainment);
	    entertainments.append(entry);
	});

	lottery.append(winner);
	lottery.append(date);
	lottery.append(offset);
	entries.append(entertainments);
	lottery.append(entries);
	li.append(lottery);
        
        if(bDown){
	    li.insertBefore(fwc.children(".next").first());
        } else {
            li.css("margin-top", "-120px");
            li.addClass("transition");
	    li.insertAfter(fwc.children(".prev").first());
        }

        var sum = 50;
        entertainments.children().each(function(){ 
            sum += $(this).width(); 
        });
        entertainments.width(sum);

        if(this.last){
            $(".fwc-"+this.i).css("overflow", "hidden");
            $(".fwc-"+this.i).css("position", "absolute");
            $(".fwc-"+this.i).height($(".fwc-"+this.i).height()+35);
            var size = $(".fwc-"+this.i).data("story").split(",").length;
            if(size > PAGE_SIZE){
                $(".fwc-"+this.i).children(".next").first().children().first().css("visibility", "visible");
            }

            $(document).keydown(function(e) {
                switch(e.which) {
                case 38: // up
                    if(keydownFuze){
                        keydownFuze = false;
                        $(".prev a").trigger("click");
                        setTimeout(function(){
                            keydownFuze = true;
                        }, 500);
                    }
                    e.preventDefault();
                    break;
                case 40: // down
                    if(keydownFuze){
                        keydownFuze = false;
                        $(".next a").trigger("click");
                        setTimeout(function(){
                            keydownFuze = true;
                        }, 500);
                    }
                    e.preventDefault();
                    break;
                }
            });

            setInterval(function(){
                $(".lottery.live").each(function(){
                    var container = $(this).find(".yet").not(".may");
                    $(this).find(".yet").removeClass("may");
                    if(container){
                        container.random().addClass("may");
                    }
                });

                $("li.entries").each(function(){
                    var width = $(this).width();
                    var entertainmentsContainer = $(this).children("ul.entertainments").first();
                    var entertainmentsContainerWidth = entertainmentsContainer.width();
                    if(width < entertainmentsContainerWidth){
                        var entertainmentsContainerMargin = entertainmentsContainer.css('margin-left').slice(0, -2);
                        if(entertainmentsContainerMargin < 0){
                            var firstWidth = entertainmentsContainer.children().first().width();
                            entertainmentsContainer.children().first().remove();
                            entertainmentsContainer.width(entertainmentsContainerWidth - firstWidth);
                            entertainmentsContainer.removeClass("transition");
                            entertainmentsContainer.css("margin-left", 0);
                        } else {
                            entertainmentsContainer.children().first().clone().appendTo(entertainmentsContainer);
                            var firstWidth = entertainmentsContainer.children().first().width();
                            entertainmentsContainer.width(entertainmentsContainerWidth + firstWidth);
                            entertainmentsContainer.css("margin-left", "-"+firstWidth+"px");
                            entertainmentsContainer.addClass("transition");
                        }
                    }
                });

                $(".date.blink").fadeOut(150).fadeIn(150);
            }, 1000);
        }

        try{
            fridayWeekendLotteryLoaded(data);
        } catch (err){
            // silent
        }
    };
    this.processLottery = function(data){
        if(this.order > order){
            setTimeout(function(){
                storyProcessors[this.i][this.order].processLottery(data);
            }, 100);
        } else if(this.order == order){
            order++;
            storyProcessors[this.i][this.order].insertLottery(data, true);
        }
    };
}