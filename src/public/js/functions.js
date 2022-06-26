$(document).ready(function () {
    $('#sidebarCollapse').click(function () {
        $('#sidebar').toggleClass('act');
    });
});

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

function municipiosList(data){
    $('#munipiosSelect').children().remove();
    var selectId = data.attributes[2].value;
    var index = $('#' + selectId)[0].selectedIndex - 1
    $.ajax({
        type: "get",
        url: "../../json/colombia.json",
        data: {},
        success: function (response) {
            var ciudades = response[index].ciudades
            var html = '<option selected disabled value="">Elige</option>';
            for (var i = 0; i < ciudades.length; i++) {
                html += '<option value="' + ciudades[i] + '">' + ciudades[i] +'</option>';
            }
            $('#munipiosSelect').append(html)
        }
    });
};

function PublicationsList(data){
    $('#typeSelect').children().remove();
    var selectId = data.attributes[2].value;
    var index = $('#' + selectId)[0].selectedIndex - 1
    $.ajax({
        type: "get",
        url: "../../json/types_publications.json",
        data: {},
        success: function (response) {
            var types = response[index].types
            var html = '';
            for (var i = 0; i < types.length; i++) {
                html += '<option value="' + types[i] + '">' + types[i] +'</option>';
            }
            $('#subclase').append(html)
        }
    });
}

async function sizeLimit(){
    var start = true;
    (function () {
        'use strict'
        var forms = document.querySelectorAll('#realForm')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                if (!form.checkValidity()) {
                    start = false;
                    form.classList.add('was-validated')
                }
            })
    })()
    if (start) {
        var formData = new FormData();
        formData.append('upFile', $('input[type=file]')[0].files[0]);
        await $.ajax({
            type: "POST",
            url: "/publications/verification",
            data: formData,
            processData: false,
            contentType: false,
            success: async function(r){
                if(r){
                    dataR = {
                        originalname:   r.originalname,
                        mimetype:       r.mimetype,
                        filename:       r.filename,
                        path:           r.path,   
                        size:           r.size,
                        name:           $('#name').val(),
                        URL:            $('#URL').val(),
                        datePublication:$('#datePublication').val(),
                        clase:          $('#clase').val(),
                        subclase:       $('#subclase').val(),
                        caracter:       $('#caracter').val(),
                        description:    $('#description').val()
                    }
                    await $.ajax({
                        type: "POST",
                        url: "/publications/add",
                        data: dataR,
                        success: () =>{
                            console.log("succes")
                            $('#submitButton').click()
                        }
                    })
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'El tamaño debe ser menor a 5MB',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#8c141b'
                    });
                }
            },
            error: function (e) {
                Swal.fire({
                    title: 'Error!',
                    text: 'El tamaño debe ser menor a 5MB',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("some error", e);
            }
        });
    }
}

function comprobarEliminar(data){
    var selectId = data.attributes[0].value;
    var color = data.attributes[3].value;
    Swal.fire({
        title: 'Estás seguro de Eliminar esta Solicitud?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#'+color,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
            $('#deleteButton'+selectId).click()
        }
      })
}

function noEliminar(){
    Swal.fire({
        title: 'Error!',
        text: 'El tiempo límite para eliminar es de 5min, ese tiempo ya expiró',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#8c141b'
    });
}

function confirmation2(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
}

function noFunction(){
    Swal.fire({
        text: 'Esta Función está en Desarrollo',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#8c141B'
    })
};

function reviewed(){
    Swal.fire({
        text: 'Esta Publicación ya fué revisada',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#8c141B'
    })
};