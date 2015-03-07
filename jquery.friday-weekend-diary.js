jQuery.fn.reverse = [].reverse;
jQuery.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};

var order = 0;
var storyProcessors = [[]];

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
        "   margin-top:5em;                              " +
        "   width:2em;                                   " +
        "}                                               " +
        ".fridayweekend .date a{                         " +
        "   text-decoration:none;                        " +
        "   color:white;                                 " +
        "   background-color:#25ace4;                    " +
        "}                                               ";

    $("head").append($("<style></style>").text(style));
    var fwcPrefix = "http://www.fridayweekend.com/rest/getLottery/";
    var fwcSuffix = "?callback=storyProcessors";

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
        setInterval(function(){
            $(".fwc-"+index+" .yet").removeClass("may");
            $(".fwc-"+index+" .yet").random().addClass("may");
        }, 753);
    });
});

var LotteryProcessor = function(index, last, localOrder){
    this.last = last;
    this.i = index;
    this.order = localOrder;
    this.insertLottery = function(data){
	var fwc = $(".fwc-" + this.i);
	var lottery = $("<ul class='descriptor'></ul>");
	var li = $("<li class='lottery'></li>");
	var winner =  $("<li class='winner'><span>"+data.winnerEntertainmentId+"</span></li>");
        var formattedDate = new Date(data.date);
        var d = formattedDate.getDate();
        var m =  formattedDate.getMonth() + 1;
        var y = formattedDate.getFullYear();
        var dateString = d + "." + m + "." + y;
        var href = "http://www.fridayweekend.com/show?code="+data.id+"&amp;key="+data.key;
	var date =  $("<li class='date'><a href='"+href+"' target='_new'>"+dateString+"</a></li>");
	var offset =  $("<li class='offset'><span>"+data.timezoneOffset+"</span></li>");
	var entries = $("<li class='entries'></li>");
	var entertainments = $("<ul class='entertainments'></ul>");
	$(data.entertainments).each(function(){
	    var entry = $("<li class='entry'></li>");
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