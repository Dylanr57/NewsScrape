console.log("hello");

$.getJSON("/articles", function(data){
    data.forEach(item => {
        $("#articles").append(`<img src=${item.image}>"`)
        $("#articles").append(`<p data-id=${item._id}>${item.title}<br/> ${item.summary}</p>`);
        $("#articles").append(`<a href="https://www.gamespot.com${item.link}">https://www.gamespot.com${item.link}</a><br>`);
    });
});

$("#scrape").on("click", function(){
    console.log("clicked");
    $.get("/scrape", function(data, status){
        console.log(data);
        location.reload();
    })
});

$(document).on("click", "p", function(){
    $("#notes").empty();
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data) {
        console.log(data);
        $("#notes").append(`<h2>${data.title}</h2>`);
        $("#notes").append("<input id='titleinput' name='title'>");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);

        if (data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(data => {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});