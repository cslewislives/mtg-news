$(document).ready(() => {
    $('#scrape').on('click', function(event) {
        event.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/scrape'
        }).then(data => {
            alert(data);
        });
    });

    $('#note').on('click', function(event) {
        let id = $(this).attr('data-id');
        $('#noteModal').modal('toggle');
        $.ajax({
            method: 'GET',
            url: '/articles/' + id
        }).then(data => {
            console.log(data);

        })
    });

    $('#saveArticle').on('click', function(event) {

    })
});