var y = 0;
var canClick = true;
$("body").on("wheel", function (e) {
    console.log(e.originalEvent.deltaY);

    y += e.originalEvent.deltaY;

    setTimeout(function () {
        console.log(y);

        if (canClick) {
            canClick = false;

            if (y > 0) {
                nextPic();
            } else if (y < 0) {
                prevPic();
            }

            setTimeout(function () {
                canClick = true;
            }, 500);
        }

        y = 0;
    }, 200);
});


var current = 0;

function showPic() {
    $(".content")
        .children("li")
        .removeClass("active")
        .eq(0)
        .animate({
            "margin-top": -100 * current + "vh"
        })
        .end()
        .eq(current)
        .addClass("active");

    $(".pagenation span")
        .eq(current)
        .addClass("active")
        .siblings()
        .removeClass("active");
}

function nextPic() {
    current = current >= $(".content li").length - 1 ? current : ++current;
    showPic();
}

function prevPic() {
    current = current <= 0 ? 0 : --current;
    showPic();
}

$(".content li").each(function (index, element) {
    var dotJQ =
        index == 0 ? $("<span class='active'></span>") : $("<span></span>");

    dotJQ.appendTo(".pagenation").click(function () {
        current = $(this).index();
        showPic();
    });
});

function show() {
    // $("body").addClass("active")
    $('.roll').css('transform', 'scale(1)')
    $('.people').css('transform', 'translateX(0px)')
    $('.cellphone').css('transform', 'rotateX(360deg)')
    $('.roll').css('transform', 'scale(1)')

}
$(document).ready(function () {
    if ($(window).scrollTop() >= 0) {
        show();
    }
});