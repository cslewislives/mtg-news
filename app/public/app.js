$(document).ready(() => {
    $.getJSON('/articles', data => {
        for (let i in data) {
            console.log(data[i]);
            $('#articles').append(`<p data-id='${data[i]._id}'>${data[i].title}<br/>
            ${data[i].author}<br/>
            ${data[i].description}<br/>
            ${data[i].link}</p>`)
        }
    });
});