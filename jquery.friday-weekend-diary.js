jQuery.fn.reverse = [].reverse;
jQuery.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};

var order = 0;
var storyProcessors = [[]];
var fwcWinnerPrefix = "http://www.fridayweekend.com/rest/getLotteryWinner/";
var fwcPrefix = "http://www.fridayweekend.com/rest/getLottery/";
var fwcSuffix = "?callback=storyProcessors";

$(document).ready(function(){
    var style = 
        ".fridayweekend {                                " +
        "       width: 10000px;                          " +
        "}                                               " +
        ".fridayweekend img {                            " +
        "       width: 101px;                            " +
        "}                                               " +
        ".fridayweekend .entertainments {                " +
        "       height: 115px;                           " +
        "       overflow: hidden;                        " +
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
        "   margin-top:4.6em;                              " +
        "   width:2em;                                   " +
        "}                                               " +
        ".fridayweekend .date a{                         " +
        "   text-decoration:none;                        " +
        "   color:white;                                 " +
        "   background-color:#25ace4;                    " +
        "   display:block;                               " +
        "   width:6em;              ;                    " +
        "}                                               ";

    $("head").append($("<style></style>").text(style));

    $(".fridayweekend").each(function(index,elem){
        var note = $(this).data("story").split(",").reverse();
        $(this).addClass("fwc-"+index);
        var delay = 0;
        $(note).each(function(i,v){
            condition = (index == $(".fridayweekend").length - 1) && (i == $(note).length - 1);
            var processor = new LotteryProcessor(index, condition, i);
            storyProcessors[index].push(processor);
            var arr = v.split("-");
            var key = arr[1];
            var code = arr[0];
            var script = document.createElement('script');
            setTimeout(function(){
                script.src = fwcPrefix+code+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLottery";
                $("head").append(script);
            }, delay*753);
            delay++;
        });
    });
});

var LotteryProcessor = function(index, last, localOrder){
    this.last = last;
    this.i = index;
    this.order = localOrder;
    this.processLotteryWinner = function(winnerId){
        $(".lottery.code-"+this.id+".key-"+this.key).removeClass("live");
        $(".lottery.code-"+this.id+".key-"+this.key+" .date").removeClass("blink");
        $(".lottery.code-"+this.id+".key-"+this.key+" .entry").removeClass("may");
        $(".lottery.code-"+this.id+".key-"+this.key+" .entry").removeClass("yet");
        $(".lottery.code-"+this.id+".key-"+this.key+" .entry.id-"+winnerId).addClass("yes");
    }
    this.insertLottery = function(data){

        this.id = data.id;
        this.key = data.key;

        var lotteryDate = data.date;
        var lotteryTimezoneOffset = data.timezoneOffset;
        var browserTimezoneOffset = (new Date).getTimezoneOffset();
        var gmtJsonGenerationDateTime = data.gmtJsonGenerationDateTime;
        var browserFragmentGenerationTime = Date.now();
        var timeZoneAdjusted = lotteryDate + lotteryTimezoneOffset - browserTimezoneOffset;
        var clientServerDiff = browserFragmentGenerationTime + browserTimezoneOffset - gmtJsonGenerationDateTime;
        var adjustedLotteryDateTime = timeZoneAdjusted + clientServerDiff;
        var d = new Date(adjustedLotteryDateTime);
        var formattedDate = new Date( d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds() );
        var dd = formattedDate.getDate();
        var m =  formattedDate.getMonth() + 1;
        var y = formattedDate.getFullYear();
        var h = formattedDate.getHours();
        var mm = formattedDate.getMinutes();
        var dateString = dd + "." + m + "." + y + " " + h + ":" + mm;

	var fwc = $(".fwc-" + this.i);
	var lottery = $("<ul class='descriptor'></ul>");
	var li = $("<li class='lottery code-"+data.id+" key-"+data.key+"'></li>");
	var winner =  $("<li class='winner'><span>"+data.winnerEntertainmentId+"</span></li>");
        var href = "http://www.fridayweekend.com/show?code="+data.id+"&amp;key="+data.key;
	var date =  $("<li class='date'><a href='"+href+"' target='_new'>"+dateString+"</a></li>");
	var offset =  $("<li class='offset'><span>"+data.timezoneOffset+"</span></li>");
	var entries = $("<li class='entries'></li>");
	var entertainments = $("<ul class='entertainments'></ul>");

        if(data.winnerEntertainmentId == 0){
            li.addClass("live");
            date.addClass("blink");
            var eta_ms = formattedDate.getTime() - Date.now() + 2345;
            var timeout = setTimeout(function(id,key,index,i){

                var script = document.createElement('script');
                script.src = fwcWinnerPrefix+id+"/"+key+fwcSuffix+"["+index+"]["+i+"].processLotteryWinner";
                $("head").append(script);

            }, eta_ms, data.id, data.key,this.i,this.order);
        }

	$(data.entertainments).each(function(){
	    var entry = $("<li class='entry id-"+this.id+"'></li>");
            if(data.winnerEntertainmentId > 0){
                if(this.id == data.winnerEntertainmentId){
                    entry.addClass("yes");
                } else {
                    entry.addClass("not");
                }
            } else {
                entry.addClass("yet");
            }
	    var entertainment = $("<ul class='entertainment'></ul>");
	    var icon = $("<li class='icon'><img src='http://www.fridayweekend.com/"+this.icon+"'/></li>");
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
	fwc.append(li);
        if(this.last){
            var max = Math.max.apply(Math, $('.fridayweekend .entertainments').map(function(){
                return $(this).width();
            }).get()) + 100;
            $(".fridayweekend").css("width", max + "px");
            setInterval(function(){
                $(".lottery.live").each(function(){
                    var container = $(this).find(".yet").not(".may");
                    $(this).find(".yet").removeClass("may");
                    if(container){
                        container.random().addClass("may");
                    }
                });
                $(".date.blink").fadeOut(150).fadeIn(150);
            }, 1000);
        }
    };
    this.processLottery = function(data){
        if(this.order > order){
            setTimeout(function(){
                storyProcessors[this.i][this.order].processLottery(data);
            }, 100);
        } else if(this.order == order){
            order++;
            storyProcessors[this.i][this.order].insertLottery(data);
        }
    };
}
