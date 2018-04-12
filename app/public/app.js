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

    $('#articles').on('click', '.notes', function (event) {
        console.log('clicked');
        let id = $(this).attr('data-id');
        $('#noteModal').modal('toggle');
        $('#notes').empty();
        $.ajax({
            method: 'GET',
            url: `/articles/${id}`
        }).then(data => {
            console.log(data);
            let notes = data.notes;
            let list = $("<ul>")
            notes.forEach(element => {
                list.append(`<li id=${element._id}>${element.body}<div type="button" class="btn btn-danger deleteNote" data-id=${element._id}>X</div></li>\n`);
            });
            $('#notes').html(list)
        });

        $('#saveNote').off().on('click', function (event) {
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
                $('#noteInput').val('');
                $('#noteModal').modal('hide');
            })
        })
        
    });

    $(document).off().on('click', '.deleteNote', function(event) {
        console.log('clicked');
        let noteId = $(this).attr('data-id');
        $.ajax({
            method: 'DELETE',
            url: `/notes/${noteId}`
        }).then(data => {
            toastr['warning'](`Note ${noteId} deleted`);
            $('li').remove(`#${noteId}`);
        });
    });
    

    $('#articles').on('click', '.saveArticle', function (event) {
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: `/saved/${id}`
        }).then(data => {
            if (data) {
                $('.modal-body').text(data);
                $('#alertModal').modal('toggle');
            }
            $('#alertModal').on('hidden.bs.modal', function () {
                $('div').remove(`#${id}`)
            });
        });
    });

    $('#articles').on('click', '.remove', function (event) {
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: `/deleted/${id}`
        }).then(data => {
            if (data) {
                $('.modal-body').text(data);
                $('#alertModal').modal('toggle');
            }
            $('#alertModal').on('hidden.bs.modal', function () {
                $('div').remove(`#${id}`)
            });
        });
    });


});