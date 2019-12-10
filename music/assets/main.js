$(".stage input[type=range]").on("input", function (e) {
	e.preventDefault();
	// console.log($(this).val());
	$(".stage .progress").css("width", $(this).val() + "%");
	audio.currentTime = $(this).val() / 100 * audio.duration
});

var playlist = [{
		file: "assets/01.mp3",
		thumb: "assets/01.jpg",
		trackName: "Dusk",
		trackArtist: "Tobu & Syndec",
		trackAlbum: "Single"
	},
	{
		file: "assets/02.mp3",
		thumb: "assets/02.jpg",
		trackName: "Blank",
		trackArtist: "Disfigure",
		trackAlbum: "Single"
	},
	{
		file: "assets/03.mp3",
		thumb: "assets/03.jpg",
		trackName: "Fade",
		trackArtist: "Alan Walker",
		trackAlbum: "Single"
	}
];

$.each(playlist, function (i, e) {
	$(".playlist").append(
		'<li><div class="thumb"><img src="' +
		e.thumb +
		'" alt="" /></div><div class="text"><h5>' +
		e.trackName +
		"</h5><p>" +
		e.trackArtist +
		"</p></div></li>"
	);
	// $(".centent").before(
	// 	'<h3>' +
	// 	e.trackName +
	// 	"</h3><p>" +
	// 	e.trackArtist +
	// 	"</p>"
	// );
});

var audio = $("audio")[0];
var current = 0;

//  var details =$('span')[0]

function play() {
	$(".playlist li")
		.eq(current)
		.addClass("playing")
		.siblings()
		.removeClass("playing");
	$(".playlist .playing").removeClass("paused");
}
// 初始化 播放第一首歌
$("audio").attr("src", playlist[current].file);
$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
$(".playlist li").eq(current).addClass('playing paused')

// 事件监听
audio.oncanplay = function () {
	console.log("可以播放");
};
audio.onloadedmetadata = function () {
	console.log("加载到了");
	// play();
};

// 控制
// 播放
$(".controls .fa-play").click(function () {
	$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
	play();
	audio.play();
	$(this).fadeOut();
	$(".controls .fa-pause").fadeIn();
	$(".controls .fa-play").css('opacity', 1);
});

// 暂停
$(".controls .fa-pause")
	.click(function () {
		audio.pause();
		$(".playlist .playing").addClass("paused");
		$(this).fadeOut();
		$(".controls .fa-play").fadeIn();
		$(".controls .fa-play").css('opacity', 1);
	})
	.fadeOut();

// 下一曲
$(".controls .fa-forward").click(function () {
	current++;
	if (current > 2) {
		current = 0;
		$("audio").attr("src", playlist[current].file);
		$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
		$('.centent h3').text(playlist[current].trackName)
		$('.centent p').text(playlist[current].trackArtist)
		play();
	}
	$("audio").attr("src", playlist[current].file);
	$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
	$('.centent h3').text(playlist[current].trackName)
	$('.centent p').text(playlist[current].trackArtist)
	play();
});
//上一曲
$(".controls .fa-backward").click(function () {
	current--;
	if (current < 0) {
		current = 2;
		$("audio").attr("src", playlist[current].file);
		$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
		$('.centent h3').text(playlist[current].trackName)
		$('.centent p').text(playlist[current].trackArtist)
		play();
	}
	$("audio").attr("src", playlist[current].file);
	$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
	$('.centent h3').text(playlist[current].trackName)
	$('.centent p').text(playlist[current].trackArtist)
	play();
});

// 点击歌单
$(".playlist li").click(function () {
	current = $(this).index();
	$("audio").attr("src", playlist[current].file);
	$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
	$('.centent h3').text(playlist[current].trackName)
	$('.centent p').text(playlist[current].trackArtist)
	$(".controls .fa-pause").fadeIn();
	$(".controls .fa-play").css('opacity', 0);
	// audio.play();
	play();
	// if(audio.play){
	// 	$(".controls .fa-pause").fadeIn();
	// 	$(".controls .fa-play").fadeIn();
	// }else{
	// 	$(".controls .fa-play").fadeIn();
	// 	$(".controls .fa-pause").fadeIn();

	// }
});
// .fadeOut();
// 监听

audio.ontimeupdate = function () {
	console.log(audio.currentTime / audio.duration * 100 + '%');
	$(".stage .progress").css("width", audio.currentTime / audio.duration * 100 + '%');
}
audio.onended = function () {
	//  自动下一曲
	current++;
	if (current > 2) {
		current = 0;
		$("audio").attr("src", playlist[current].file);
		$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
		$('.centent h3').text(playlist[current].trackName)
		$('.centent p').text(playlist[current].trackArtist)
		play();
	}
	$("audio").attr("src", playlist[current].file);
	$(".ui").css("background-image", "url(" + playlist[current].thumb + ")");
	$('.centent h3').text(playlist[current].trackName)
	$('.centent p').text(playlist[current].trackArtist)
	play();
}

audio.oncanplay = function () {
	setTimeout(function () {
		audio.style.display = "block";
		var total = audio.duration;
		var result = getResult(total);
		$(".duration").html(result);
	}, 500);
}

function getResult(time) {
	var minute = Math.floor(time % 3600 / 60);
	minute = minute < 10 ? "0" + minute : minute;
	var second = Math.floor(time % 60);
	second = second < 10 ? "0" + second : second;
	return minute + ":" + second;
}

audio.ontimeupdate = function () {
	var currents = audio.currentTime;
	// console.log(currents);
	var result = getResult(currents);
	$(".current").html(result);
	var percent = currents / audio.duration * 100 + "%";
	$(".stage .progress").css("width", percent);
}