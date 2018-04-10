$(document).ready(() => {
    $.getJSON('/articles', data => {
        for (let i in data) {
            console.log(data[i]);
            $('#articles').append(`<p data-id='${data[i]._id}'>${data[i].title}
            ${data[i].author}
            ${data[i].description}
            ${data[i].link}</p>`)
        }
    });
});