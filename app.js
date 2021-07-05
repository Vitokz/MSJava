$(document).ready(function () {
    let count = 0;

    $.ajax({
        url: 'http://localhost:8080/auth',
        type: 'GET',
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        crossDomain: true,
        success: function (data) {
            console.log(data)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    })

    $("#form").on("submit", function (event) {
        event.preventDefault()
        var fd = new FormData();
        var file_data = $('input[type="file"]')[0].files[0]; // for multiple files
        fd.append("file", file_data)
        var other_data = $('form').serializeArray();
        $.each(other_data, function (key, input) {
            fd.append(input.name, input.value);
        });
        $.ajax({
            url: 'http://localhost:8080/makeSupply',
            type: 'POST',
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            crossDomain: true,
            data: fd,
            success: function (data) {
                console.log(data)
                exceptionsView(data["id"], data["exceptions"])
                allIds(count)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });




    function exceptionsView(id, exceptions) {
        $("#form").hide()
        $.each(exceptions, function (key, input) {
            count++
            if (input['status'] == "good") {
                $("#exceptions").append(`
            <p class=background>${input["name"]}</p>`)
            }
        })
        $.each(exceptions, function (key, input) {
            count++
            let nm = input['name'].split(" ")
            if (input['status'] == "bad") {
                $("#exceptions").append(`
     <form id=${count} method="POST">
     Название :${input['name']}<br>
     <input type="hidden" name="price" value=${input['price']}>
     <input type="hidden" name="id" value=${id}>
     <input type="hidden" name="count" value=${input['count']}>
     <input type="hidden" name="name" value=${nm.join("@")} id="${count}inp" >
     Номенклатура<input type="text" name="nomencl"><br>
     Создать новую номенклатуру <input type="radio" name="whatDo" value="new" checked><br>
     Привязать к уже существующей<input type="radio" name="whatDo" value="refactor"><br>
     <input type="submit" value="Отправить"></p><br>
     </form><br>
     `)
            }
        })
    }

    function allIds(count) {
        for (let i = 0; i <= count; i++) {
            let vrem = {
                number: "#" + i
            }
            $("#exceptions").delegate(vrem.number, "submit", function (event) {
                event.preventDefault()
                $.ajax({
                    url: 'http://localhost:8080/addOrRefactor',
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    crossDomain: true,
                    data: $(this).serializeArray(),
                    success: function (data) {
                        console.log(data)
                        let nm = $(`${vrem.number}inp`).val().split("@")
                        $(vrem.number).html("<p class=background>" + nm.join(" ") + "</p>")
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
                return false
            })
        }
    }
})