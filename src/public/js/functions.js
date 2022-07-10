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

function checkInputs(){
    var start = true;
    (function () {
        'use strict'
        var forms = document.querySelectorAll('#FormValidate')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                if (!form.checkValidity()) {
                    start = false;
                    form.classList.add('was-validated')
                }
            })
    })()

    if(start){
        $('#realClick').click();
    }
}

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

function assignment(data){
    $('#facultadDiv').remove();
    $('#programasDiv').remove();
    $('#vinculacionDiv').remove();
    $('#vinculacionDiv2').remove();
    $('#investigacionDiv').remove();
    $('#investigacionDiv2').remove();
    $('#titleV').remove();
    $('#titleI').remove();
    $('#divInvestigacion1').remove()
    $('#divInvestigacion2').remove()
    let option = $(`#role option`).toArray().map( o => o.value ).slice(-3);
    var selectId = data.attributes[2].value;
    var index = $('#' + selectId)[0].selectedIndex - 1;
    let selected = option[index];
    if(selected === 'Docente'){
        $.ajax({
            type: "get",
            url: "../../json/facultades.json",
            data: {},
            success: function (r) {
                let option=''; let html = '';
                for (let i in r) {
                    option += '<option value="' + r[i].facultad + '">' + r[i].facultad + '</option>'
                }
                html += '<div class="col pt-2" id="facultadDiv">';
                html += '<select class="form-select" name="facultad" id="facultad" onchange="if (this.selectedIndex) selectPrograma(this);" required>';
                html += '<option selected disabled value="">Seleccione una Facultad</option>';
                html += option;
                html += '</select>';
                html += '</div>';
                $('#divF').append(html)
                html = '<div class="col pt-2" id="programasDiv">';
                html += '<select class="form-select" name="programa" id="programa" required>';
                html += '<option selected disabled value="">Seleccione un Programa</option>';
                html += '</select>';
                html += '</div>';
                $('#divP').append(html)
                html = '<h6 class="fw-bold pt-2" id="titleV">Vinculación</h6>'
                html += '<div class="form-check" id="vinculacionDiv">'
                html += '<input class="form-check-input" type="radio" name="vinculacion" id="vinculacion1" value="true" required>'
                html += '<label class="form-check-label" for="vinculacion1">'
                html += 'Tiempo completo planta'
                html += '</label>'
                html += '</div>'
                html += '<div class="form-check" id="vinculacionDiv2">'
                html += '<input class="form-check-input" type="radio" name="vinculacion" id="vinculacion2" value="false" required>'
                html += '<label class="form-check-label" for="vinculacion2">'
                html += 'Medio tiempo planta'
                html += '</label>'
                html += '</div>'
                $('#divF').append(html)
                html = '<h6 class="fw-bold pt-2" id="titleI">Pertenece a un grupo de investigación?</h6>'
                html += '<div class="form-check pt-1" id="investigacionDiv">'
                html += '<input class="form-check-input" type="radio" name="investigacion" id="investigacion1" value="true" onclick="addInvestigacion()" required>'
                html += '<label class="form-check-label" for="investigacion1">'
                html += 'Si'
                html += '</label>'
                html += '</div>'
                html += '<div class="form-check" id="investigacionDiv2">'
                html += '<input class="form-check-input" type="radio" name="investigacion" id="investigacion2" value="false" onclick="minInvestigacion()" required>'
                html += '<label class="form-check-label" for="investigacion2">'
                html += 'No'
                html += '</label>'
                html += '</div>'
                $('#divP').append(html)
            }
        });
    }else{
        $('#facultadDiv').remove()
        $('#programasDiv').remove()
        $('#vinculacionDiv').remove();
        $('#vinculacionDiv2').remove();
        $('#investigacionDiv').remove();
        $('#investigacionDiv2').remove();
        $('#titleV').remove();
        $('#titleI').remove();
        $('#divInvestigacion1').remove()
        $('#divInvestigacion2').remove()
    }

}

function selectPrograma(){
    let index = $("#facultad")[0].selectedIndex - 1;
    $('#programa').children().remove();
    $.ajax({
        type: "get",
        url: "../../json/facultades.json",
        data: {},
        success: function (r) {
            let {programas} = r[index];
            let option='';
            for (let i in programas) {
                option = '<option id="programaOption'+i+'" value="' + programas[i] + '">' + programas[i] + '</option>'
                $('#programa').append(option)
            }
        }
    });

}

function addInvestigacion(){
    $('#divInvestigacion1').remove()
    $('#divInvestigacion2').remove()
    html = '<div class="col mb-2" id="divInvestigacion1">'
    html += '<input type="text" class="form-control" name="nombreGrupo" placeholder="Nombre del Grupo de Investigación" required>'
    html += '</div>'
    $('#password').prepend(html)
    html = '<div class="col mb-2" id="divInvestigacion2">'
    html += '<input type="text" class="form-control" name="lineaInvestigacion" placeholder="Línea de Investigación" required>'
    html += '</div>'
    $('#c_password').prepend(html)
}

function minInvestigacion(){
    $('#divInvestigacion1').remove()
    $('#divInvestigacion2').remove()
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