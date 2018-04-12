$(document).ready(() => {
    $('#scrape').on('click', function (event) {
        event.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/scrape'
        }).then(data => {
            if (data) {
                $('.modal-body').text(data);
                $('#alertModal').modal('toggle');
            }
            $('#alertModal').on('hidden.bs.modal', function () {
                location.reload();
            });
        });
    });

    $('#note').on('click', function (event) {
        let id = $(this).attr('data-id');
        $('#noteModal').modal('toggle');
        $('#notes').empty();
        $.ajax({
            method: 'GET',
            url: `/articles/${id}`
        }).then(data => {
            console.log(data);
            let notes = data.notes;
            notes.forEach(element => {
                $('#notes').append(`<li id=${element._id}>${element.body}<div type="button" class="btn btn-danger btn-sm" id='deleteNote' data-id=${element._id} data-dismiss="modal">X</div></li><br/>`);
            });
        });

        $('#saveNote').on('click', function (event) {
            let newNote = $('#noteInput').val();
            console.log(newNote);
            let note = {
                body: newNote
            }
            $.ajax({
                method: 'POST',
                url: `/articles/${id}`,
                data: note
            }).then(data => {
                toastr['success'](`A new note has been added to ${data._id}`)
                $('#noteInput').empty();
            })
        })
        
    });

    $('#deleteNote').on('click', function(event) {
        let id = $(this).attr('data-id');

        $.ajax({
            method: 'DELETE',
            url: `/notes/${id}`
        }).then(data => {
            toastr['warning'](`Note ${id} deleted`);
        });
    });

    $('#saveArticle').on('click', function (event) {
        let id = $('#saveArticle').attr('data-id');
        $.ajax({
            method: 'POST',
            url: `/saved/${id}`
        }).then(data => {
            if (data) {
                $('.modal-body').text(data);
                $('#alertModal').modal('toggle');
            }
            $('#alertModal').on('hidden.bs.modal', function () {
                location.reload();
            });
        });
    });
});