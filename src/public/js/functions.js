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

function PublicationsList(){
    resetRows()
    let modalidad_seleccionada = $('#select_modalidad option:selected' ).text()
    $.ajax({
        type: "get",
        url: "../../json/modalidades.json",
        data: {},
        success: function (response) {
            let articulo = 'Artículo de Revista';
            let libro = 'Libro';
            let capitulo = 'Capítulo de Libro';
            let patentes = 'Patentes';
            let ponencia = 'Ponencia';
            let index = response.findIndex(x => x.name === modalidad_seleccionada);
            let {tipo,categoria} = response[index]
            let modalidad = response[index].name;
            let select_categoria = 'Categoría'
            let select_tipo = 'Tipo'
            switch (modalidad) {
                case 'Artículo de Revista':
                    select_categoria = 'Categoría de la revista en Minciencias al momento de la publicación'
                    select_tipo = 'Tipo de Artículo'
                    $('#name').attr('placeholder','Nombre del Artículo')
                    break;
                case 'Producción de vídeos, cinematográficas o fonográficas':
                    select_categoria = 'Finalidad'
                    select_tipo = 'Impacto'
                    break;
            }
            if(tipo){
                let html = '<div class="col mb-2" id="tipo">'
                html += '<select class="form-select mr-sm-2" name="tipo" id="select_tipo" required>'
                html += '<option selected disabled value="">-- '+select_tipo+' --</option>'
                for (let i in tipo) {
                    html += '<option value="' + tipo[i] + '">' + tipo[i] +'</option>';
                }
                html += '</select>'
                html += '</div>'
                $('#modalidad').after(html)
            }else{
                $('#modalidad').addClass('col-md-3')
            }
            if(modalidad == articulo){
                html = '<div class="form-group row" id="row_2">'
                html += '<div class="col mb-2" id="nombre_revista">'
                html += '<input id="name" type="text" class="form-control" name="nombre_revista" placeholder="Nombre de la Revista" required>'
                html += '</div>'
                html += '</div>'
                html += '<div class="form-group row" id="row_3">'
                html += '<div class="col mb-2" id="url">'
                html += '<input id="URL" type="url" class="form-control" name="URL" placeholder="Dirección URL" required>'
                html += '</div>'
                html += '<div class="col mb-2" id="file">'
                html += '<input type="file" class="form-control mr-sm-2 p-1" id="uploadFile" name="upFile" required>'
                html += '</div>'
                html += '</div>'
                html += '<div class="row g-3 align-items-center mb-2" id="row_4">'
                html += '<div class="col-auto">'
                html += '<label for="meses" class="col-form-label">Tiempo requerido para la publicación del artículo en la revista</label>'
                html += '</div>'
                html += '<div class="col-1">'
                html += '<input type="number" name="tiempo_revista" min="0" class="form-control" required>'
                html += '</div>'
                html += '<div class="col-auto">'
                html += '<span class="form-text">'
                html += 'Cantidad en meses.'
                html += '</span>'
                html += '</div>'
                html += '</div>'
                html += '<div class="row g-3 align-items-center mb-2" id="row_5">'
                html += '<div class="col-5 mb-2">'
                html += '<label for="dateRevista">Fecha de recepción o sumisión del artículo a la revista</label>'
                html += '<input id="dateRevista" type="date" class="form-control w-50" name="fecha_recepcion_revista" required>'
                html += '</div>'
                html += '</div>'
                html += '<div class="row g-3 align-items-center mb-2" id="row_6">'
                html += '<div class="col-3">'
                html += '<input type="text" class="form-control" name="ISXN" placeholder="ISSN" required>'
                html += '</div>'
                html += '</div>'
                html += '<div class="row g-3 align-items-center mb-2" id="row_7">'
                html += '<div class="col-auto">'
                html += '<label for="check" class="col-form-label">Para la publicación del artículo, se invirtieron recursos económicos de la Universidad</label>'
                html += '</div>'
                html += '<div class="form-check form-check-inline ms-3 col-1">'
                html += '<input class="form-check-input" type="radio" name="recursos_U" value="true" required>'
                html += '<label class="form-check-label mx-0" for="inlineRadio1">SI</label>'
                html += '</div>'
                html += '<div class="form-check form-check-inline col-1">'
                html += '<input class="form-check-input" type="radio" name="recursos_U" value="false" required>'
                html += '<label class="form-check-label mx-0" for="inlineRadio2">NO</label>'
                html += '</div>'
                html += '</div>'
                $('#row_1').after(html)
                
            }
            if(categoria){
                html = '<div class="col" id="categoria">'
                html += '<select class="form-select mr-sm-2" name="categoria" id="select_categoria" required>'
                html += '<option selected disabled value="">'+select_categoria+'</option>'
                for (let i in categoria) {
                    html += '<option value="' + categoria[i] + '">' + categoria[i] +'</option>';
                }
                html += '</select>'
                html += '</div>'
                if(modalidad == articulo){
                    $('#nombre_revista').after(html)
                }else{
                    $('#tipo').after(html)
                }
            }
            if(modalidad == libro ||  modalidad == capitulo){
                
                $('#modalidad').removeClass('col-md-3','col')
                $('#modalidad').addClass('col')
                html = '<div class="form-group row mb-2" id="row_3">'
                html += '<div class="col">'
                html += '<input type="text" class="form-control" name="ISXN" placeholder="ISBN" required>'
                html += '</div>'
                html += '<div class="col" id="editorial">'
                html += '<input type="text" class="form-control" name="editorial" placeholder="Editorial" required>'
                html += '</div>'
                html += '</div>'
                html += '<div class="form-group row mb-2" id="row_3">'
                html += '<div class="col-6 mb-2" id="row_2">'
                html += '<input id="URL" type="url" class="form-control" name="URL" placeholder="Dirección URL Editorial" required>'
                html += '</div>'
                html += '</div>'
                $('#row_1').after(html)
            }
            if(modalidad == articulo || modalidad == libro || modalidad == capitulo || modalidad == patentes || modalidad == ponencia){
                html = '<div class="form-group row" id="row_8">'
                html += '<div class="col-6">'
                html += '<label for="name" id="name_label">Nombre del proyecto de Investigación del cual se genera el material, sí aplica</label>'
                html += '<input type="text" class="form-control" name="nombre_proyecto_investigacion" placeholder="">'
                html += '</div>'
                html += '</div>'
                $('#hr').before(html)
            }
            html = '<div class="row g-3 align-items-center mb-2" id="row_10">'
            html += '<div class="col-auto">'
            html += '<label for="check" class="col-form-label">El material presentado fue tenido en cuenta para cambio de categoría en el escalafón docente:</label>'
            html += '</div>'
            html += '<div class="form-check form-check-inline ms-3 col-1">'
            html += '<input class="form-check-input" type="radio" name="cambio_categoria" id="inlineRadio1" value="true" required>'
            html += '<label class="form-check-label mx-0" for="inlineRadio1">SI</label>'
            html += '</div>'
            html += '<div class="form-check form-check-inline col-1">'
            html += '<input class="form-check-input" type="radio" name="cambio_categoria" id="inlineRadio2" value="false" required>'
            html += '<label class="form-check-label mx-0" for="inlineRadio2">NO</label>'
            html += '</div>'
            html += '</div>'
            $('#hr').before(html)
            insertAutores()
            if(modalidad != articulo){
                html = '<div class="form-group row" id="row_9">'
                html = '<div class="col-md-5 mb-2" id="file">'
                html += '<label for="upFile" id="name_label">Archivo para Revisión</label>'
                html += '<input type="file" class="form-control mr-sm-2 p-1" id="uploadFile" name="upFile" required>'
                html += '</div>'
                html += '</div>'
                $('#autores').before(html)
            }
        }
    });
}

function addAutores(){
    var index = parseInt($("#numero_aut").val())
    let html = '';
    let counter = parseInt($('#counter').val())
    for(let i = 2; i < counter + 1; i++){
        $('#div_autor_'+i).remove();
    }
    $('#counter').attr('value',index)
    for (let i = 2; i < index + 1; i++) {
        i = (i).toString()
        html += '<div class="row form-group mb-2" id="div_autor_'+i+'">'
        html += '<div class="col-4">'
        html += '<input type="text" class="form-control" name="autor_name_'+i+'" placeholder="Nombre del Autor '+i+'" required>'
        html += '</div>'
        /*
        html += '<div class="col">'
        html += '<select class="form-select mr-sm-2" name="autor_id_type_'+i+'" required>'
        html += '<option value="" selected>--- Elija un tipo de identificación ---</option>'
        html += '<option value="Cédula">Cédula</option>'
        html += '<option value="Cédula extrangeria">Cédula de extrangeria</option>'
        html += '<option value="Pasaporte">Pasaporte</option>'
        html += '<option value="Tarjeta de identidad">Tarjeta de identidad</option>'
        html += '<option value="Registro civil">Registri civil</option>'
        html += '<option value="Carnet diplomático">Carné diplomático</option>'
        html += '<option value="Salvoconducto">Salvoconducto</option>'
        html += '<option value="Permiso especial de permanencia">Perrmiso especial de permanencia</option>'
        html += '<option value="Documento extrangero">Documento extrangero</option>'
        html += '</select>'
        html += '</div>'
        html += '<div class="col">'
        html += '<input type="text" class="form-control" name="autor_id_'+i+'" placeholder="Número de identificación" required>'
        html += '</div>'
        */
        html += '</div>'
    }
    $('#autores').after(html)
}

function insertAutores(){
    let count = 20+1;
    html = '<div class="row mb-2" id="autores">'
    html += '<input type="number" id="counter" class="d-none" value="">'
    html += '<label for="numero_autores">Número de Autores</label>'
    html += '<div class="col-1">'
    html += '<select class="form-select" name="numero_autores" id="numero_aut" onchange="addAutores()">'
    html += '<option value="" disabled>Selecciona el número de Autores</option>'
    for (let i = 1; i < count; i++) {
        html += '<option value="'+i+'">'+i+'</option>'
    }
    html += '</select>'
    html += '</div>'
    html += '</div>'
    $('#hr').before(html)
}

function resetRows(){
    let counter = parseInt($('#counter').val())
    for(let i = 2; i < counter + 1; i++){
        $('#div_autor_'+i).remove();
    }
    $('#autores').remove();
    $('#name').attr('placeholder','Nombre de la Producción Académica')
    $('#modalidad').removeClass('col-md-3','col')
    $('#modalidad').addClass('col')
    $('#categoria').remove();
    $('#tipo').remove();
    $('#row_2').remove();
    $('#row_3').remove();
    $('#row_3').remove();
    $('#row_4').remove();
    $('#row_5').remove();
    $('#row_6').remove();
    $('#row_7').remove();
    $('#row_8').remove();
    $('#file').remove();
    $('#row_9').remove();
    $('#row_10').remove();
}

async function fileLimit(){
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
        Swal.fire({
            title: 'Acepta los siguientes términos?',
            text: "En mi calidad de docente de la Universidad Surcolombiana de Neiva Huila, me obligo a hacer envío del presente formulario debidamente diligenciado, con los soportes correspondientes. Me abstengo de enviar información que no sea real y/o que no esté debidamente soportada por los documentos idóneos para este efecto. En caso de no tener certeza acerca de la veracidad de la información enviada al Comité de Asignación de Puntaje - CAP, o de no tener seguridad en cuanto a los soportes idóneos para sustentar estos datos, me abstendré de realizar el registro.\nEn estos términos declaro mi responsabilidad sobre el manejo que daré a la información personal y académica a enviar al CAP",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No estoy de acuerdo',
            confirmButtonColor: '#8c141b',
            confirmButtonText: 'Si, estoy de acuerdo',
          }).then(async (result) => {
            if (result.isConfirmed) {
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
                            let form = $('#realForm').serializeJSON();
                            $.extend(r,form)
                            await $.ajax({
                                type: "POST",
                                url: "/publications/add",
                                data: r,
                                success: () =>{
                                    $('#submitButton').click()
                                }
                            })
                        }else{
                            Swal.fire({
                                title: 'Error!',
                                text: 'Error en la validación del archivo',
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
                        console.log("error: ", e);
                    }
                });              
            }
          })
    }
}

async function comprobarEliminar(data){
    var index = data.attributes[0].value;
    var id = data.attributes[1].value;
    await $.ajax({
        type: "get",
        url: "/publications/time",
        data: {
            id
        },
        success: (r) =>{
            if(r.allow){
                Swal.fire({
                    title: 'Estás seguro de Eliminar esta Solicitud?',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    confirmButtonColor: '#8c141b',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#deleteButton'+index).click()
                    }
                })
            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'El tiempo límite para eliminar es de 5min, ese tiempo ya expiró',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
            }
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
                html += '<select class="form-select" name="facultad" id="facultad" onchange="if (this.selectedIndex) selectFacultad(this);" required>';
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

async function selectFacultad(){
    let index = $("#facultad")[0].selectedIndex - 1;
    $('#programa').children().remove();
    let switch_3 = $('#switch_3').val()
    let value = $("#facultad option:selected").val();
    if(value=='todos'){
        $('#programa').children().remove();
        option = '<option value="todos">Todos los programas</option>'
        $('#programa').append(option)
        docentes = '';
        await $.ajax({
            type: "get",
            url: "/docentes/search",
            data: {value},
            success: (r) =>{
                docentes = r.docentes;
            },
            error: (e) =>{
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de docentes para la facultad seleccionada',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        })
        $('#select_docente').children().remove();
        option = '<option value="todos">Todos los docentes</option>'
        $('#select_docente').append(option)
        docentes.map((obj)=>{
            opt = '<option value="' + obj._id + '">' + obj.lastname +' '+ obj.name +'</option>'
            $('#select_docente').append(opt)
        })
    }else{
        $.ajax({
            type: "get",
            url: "../../json/facultades.json",
            data: {},
            success: async function (r) {
                let {programas} = r[index];
                let option='';
                if(switch_3 == '1'){
                    option = '<option value="todos">Todos los programas</option>'
                    $('#programa').append(option)
                }
                if(switch_3 == '1'){
                    await $.ajax({
                        type: "get",
                        url: "/docentes/search",
                        data: {value},
                        success: (r) =>{
                            docentes = r.docentes;
                        },
                        error: (e) =>{
                            Swal.fire({
                                title: 'Error!',
                                text: 'Se produjo un error en la búsqueda de docentes para la facultad seleccionada',
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: '#8c141b'
                            });
                            console.log("error: ", e);
                        }
                    })
                    $('#select_docente').children().remove();
                    option = '<option value="todos">Todos los docentes</option>'
                    $('#select_docente').append(option)
                    docentes.map((obj)=>{
                        opt = '<option value="' + obj._id + '">' + obj.lastname +' '+ obj.name +'</option>'
                        $('#select_docente').append(opt)
                    })
                }
                for(let i in programas) {
                    option = '<option id="programaOption'+i+'" value="' + programas[i] + '">' + programas[i] + '</option>'
                    $('#programa').append(option)
                }
            },
            error: (e)=>{
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de facultades',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        });
        //buscar todos los docentes por la facultad seleccionada
    }
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

function checkISSN(data){
    var id = data.attributes[0].value;
    $.ajax({
        type: "get",
        url: "/issn/check",
        data: {id},
        success: function(r){
            if(r.validation){
                Swal.fire({
                    text: 'Existe ISSN',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
            }else{
                Swal.fire({
                    text: 'No se encuentra este ISSN para el año de publicación',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
            }
        },
        error: function (e) {
            Swal.fire({
                title: 'Error!',
                text: 'Algo salió mal, contacta al desarrollador',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#8c141b'
            });
            console.log("error: ", e);
        }
    });
}

function checkISBN(data){
    var id = data.attributes[0].value;
    $.ajax({
        type: "get",
        url: "/isbn/check",
        data: {id},
        success: function(r){
            if(r.validation){
                Swal.fire({
                    html: 'ISBN correcto, título: <b>'+r.isbn.titulo+'</b>',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
            }else{
                Swal.fire({
                    text: 'No se encuentra este ISBN',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
            }
        },
        error: function (e) {
            Swal.fire({
                title: 'Error!',
                text: 'Algo salió mal, contacta al desarrollador',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#8c141b'
            });
            console.log("error: ", e);
        }
    });
}

function accept(data){
    let res = data.attributes[0].value;
    if(res == 'aceptar'){
        $('#acceptInpt').val('aceptar')
    }
    if(res == 'editar'){
        $('#acceptInpt').val('editar')
    }
    if(res == 'rechazar'){
        $('#acceptInpt').val('rechazar')
    }
    $('#submitButton').click()
}

function otorgarPuntos(){
    $('#rowOtorgados').remove()
    let html = '<div class="row" id="rowOtorgados">'
    html += '<div class="col-4">'
    html += '<label>Tipo de Puntaje</label>'
    html += '<select class="form-select" name="tipo_puntaje" aria-label="Default select example" required>'
    html += '<option value="" disabled selected>---</option>'
    html += '<option value="1">Bonificación por productividad académica</option>'
    html += '<option value="2">Reconocimiento de puntos salariales</option>'
    html += '</select>'
    html += '</div>'
    html += '<div class="col-2 mb-2">'
    html += '<label>Puntaje otorgado</label>'
    html += '<input type="number" min="0" class="form-control w-50" value="" name="puntaje" required>'
    html += '</div>'
    html += '</div>'
    $('#denegar').after(html)
}

function denegarPuntos(){
    $('#rowOtorgados').remove()
}

function searchPublications(){
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
        let formData = $('#FormValidate').serializeJSON();
        let {estado_1,estado_2, estado_3, estado_4, estado_5, estado_6} = formData;
        if(!estado_1&&!estado_2&&!estado_3&&!estado_4&&!estado_5&&!estado_6){
            Swal.fire({
                html: 'Debe seleccionar al menos una casilla en <b>Estado de las Solicitudes</>',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#8c141b'
            });
        }else{
            $.ajax({
                type: "post",
                url: "/publications/search",
                data: formData,
                success: function(r){
                    let {publications} = r;
                    $('#myPublications').remove()
                    $('#myPublications_wrapper').remove()
                    html = '<table class="table table-light table-bordered table-hover overflow-y: hidden" id="myPublications">'
                    html += '<thead class="table-secondary">'
                    html += '<tr>'
                    html += '<th scope="col">#</th>'
                    html += '<th scope="col">Nombre</th>'
                    html += '<th scope="col">Modalidad</th>'
                    html += '<th scope="col">Fecha de Solicitud</th>'
                    html += '<th scope="col">Fecha de Publicación</th>'
                    html += '<th scope="col">Estado</th>'
                    html += '</tr>'
                    html += '</thead>'
                    html += '<tbody>'
                    publications.map((obj)=>{
                        obj.fecha_solicitud = moment(obj.fecha_solicitud).utc().format('DD/MM/YYYY')
                        obj.fecha_publicacion = moment(obj.fecha_publicacion).utc().format('DD/MM/YYYY')
                    })
                    for(let i in publications){
                        let index = (parseInt(i)+1).toString().padStart(3,0)
                        html += '<tr>'
                        html += '<th scope="row">'+index+'</th>'
                        html += '<td>'+publications[i].name+'</td>'
                        html += '<td>'+publications[i].modalidad+'</td>'
                        html += '<td>'+publications[i].fecha_solicitud+'</td>'
                        html += '<td>'+publications[i].fecha_publicacion+'</td>'
                        html += '<td>'+publications[i].estado+'</td>'
                        html += '</tr>'
                    }
                    html += '</tbody>'
                    html += '</table>'
                    $('#hr').after(html)
                    $('#myPublications').DataTable({
                        language: {
                            url: '/json/es-CO.json'
                        },
                        ordering:  false,
                        "scrollCollapse": true,
                        "paging": false,
                    });
                },
                error: function (e) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Se produjo un error en la búsqueda',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#8c141b'
                    });
                    console.log("error: ", e);
                }
            });
        }
    }
}

async function switch_generarInforme_1(){
    $('#row_1').children().remove();
    let switchValue = $('#switch_1').val();
    let html = '<i id="icon_1" class="fas fa-chevron-down"></i>'
    if(switchValue=='0'){
        $('#icon_1').remove()
        $('#b_1').before(html)
        html = '<div class="col-4">'
        html += '<h6 class="fw-bold">Estado de las Solicitudes</h6>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" type="checkbox" name="estado_1" value="Pendiente por revisión" checked>'
        html += '<label class="form-check-label">Pendiente por revisión</label>'
        html += '</div>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" style="" type="checkbox" name="estado_2" value="Revisado" checked>'
        html += '<label class="form-check-label">Revisado</label>'
        html += '</div>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" style="" type="checkbox" name="estado_3" value="Editar" checked>'
        html += '<label class="form-check-label">Editar</label>'
        html += '</div>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" type="checkbox" name="estado_4" value="Rechazado" checked>'
        html += '<label class="form-check-label">Rechazado</label>'
        html += '</div>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" type="checkbox" name="estado_5" value="No aprobado por CAP" checked>'
        html += '<label class="form-check-label">No aprobado por CAP</label>'
        html += '</div>'
        html += '<div class="form-check">'
        html += '<input class="form-check-input custom-control-input" type="checkbox" name="estado_6" value="Aprobado" checked>'
        html += '<label class="form-check-label">Aprobado</label>'
        html += '</div>'
        html += '</div>'
        html += '<div class="col-4">'
        html += '<h6 class="fw-bold">Modalidad Académica</h6>'
        html += '<select class="form-select mr-sm-2" name="modalidad" id="select_modalidad">'
        html += '<option selected value="todas"> Todas las modalidades </option>'
        let modalidades;
        await $.ajax({
            type: "get",
            url: "../../json/modalidades.json",
            data: {},
            success: function(r){
                modalidades = r;
            },
            error: function (e) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de modalidades',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        });
        let option = modalidades.map((obj)=>{
            let opt = '<option value="'+obj.name+'">'+obj.name+'</option>'
            return opt;
        })
        html += option
        html += '</select>'
        html += '</div>'
        $('#row_1').append(html)
        $('#switch_1').val('1')
    }else{
        $('#row_1').children().remove();
        $('#icon_1').remove()
        html = '<i id="icon_1" class="fas fa-greater-than"></i>'
        $('#b_1').before(html)
        $('#switch_1').val('0')
    }
}

function switch_generarInforme_2(){
    $('#row_2').children().remove();
    let switchValue = $('#switch_2').val();
    let html = '<i id="icon_2" class="fas fa-chevron-down"></i>'
    if(switchValue=='0'){
        $('#icon_2').remove()
        $('#b_2').before(html)
        html = '<div class="col-3" onclick="YYYY_trimestre()">'
        html += '<label class="fw-bold" for="yyyy">Año</label>'
        html += '<input type="number" min="0" class="form-control" name="yyyy" placeholder="Año" id="year" required>'
        html += '</div>'
        html += '<div class="col-3" onclick="YYYY_trimestre()">'
        html += '<label class="fw-bold" for="trimestre">Trimestre</label>'
        html += '<select class="form-select mr-sm-2" name="trimestre" id="trim">'
        html += '<option selected disabled value=""> Trimestre </option>'
        html += '<option value="1">1</option>'
        html += '<option value="2">2</option>'
        html += '<option value="3">3</option>'
        html += '<option value="4">4</option>'
        html += '</select>'
        html += '</div>'
        html += '<div class="col-3 mb-3" id="fecha_1" onclick="start_end_date1()">'
        html += '<label class="fw-bold" for="startDate1">Fecha de Publicación (Inicio)</label>'
        html += '<input class="form-control mb-2" type="date" name="startDate1" id="startDate1" required>'
        html += '<label class="fw-bold" for="endDate1">Fecha de Publicación (Fin)</label>'
        html += '<input class="form-control" type="date" name="endDate1" id="endDate1" required>'
        html += '</div>'
        html += '<div class="col-3 mb-2" id="fecha_2" onclick="start_end_date2()">'
        html += '<label class="fw-bold" for="startDate2">Fecha de Solicitud (Inicio)</label>'
        html += '<input class="form-control mb-2" type="date" name="startDate2" id="startDate2" required>'
        html += '<label class="fw-bold" for="endDate2">Fecha de Solicitud (Fin)</label>'
        html += '<input class="form-control" type="date" name="endDate2" id="endDate2" required>'
        html += '</div>'
        $('#row_2').append(html)
        $('#switch_2').val('1')
    }else{
        $('#row_2').children().remove();
        $('#icon_2').remove()
        html = '<i id="icon_2" class="fas fa-greater-than"></i>'
        $('#b_2').before(html)
        $('#switch_2').val('0')
    }
}

async function switch_generarInforme_3(){
    $('#row_3').children().remove();
    $('#buscarDocente').children().remove();
    let switchValue = $('#switch_3').val();
    let html = '<i id="icon_3" class="fas fa-chevron-down"></i>'
    if(switchValue=='0'){
        $('#icon_3').remove()
        $('#b_3').before(html)
        html = '<div class="col-4">'
        html += '<select class="form-select mr-sm-2" name="facultad" id="facultad" onchange="selectFacultad();">'
        html += '<option selected value="todos"> Todas las Facultades </option>'
        let facultades;
        await $.ajax({
            type: "get",
            url: "../../json/facultades.json",
            data: {},
            success: function(r){
                facultades = r;
            },
            error: function (e) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de las facultades',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        });
        option = facultades.map((obj)=>{
            let opt = '<option value="'+obj.facultad+'">'+obj.facultad+'</option>'
            return opt;
        })
        html += option;
        html += '</select>'
        html += '</div>'
        html += '<div class="col-4">'
        html += '<select class="form-select mr-sm-2" id="programa" name="programa" id="select_programa">'
        html += '<option value="todos"> Todos los Programas </option>'
        html += '</select>'
        html += '</div>'
        html += '<div class="col-4">'
        html += '<select class="form-select mr-sm-2" name="docente" id="select_docente">'
        html += '<option selected value="todos"> Todos los docentes </option>'
        let docentes;
        await $.ajax({
            type: "get",
            url: "/docentes/search",
            data: {},
            success: function(r){
                docentes = r.docentes;
            },
            error: function (e) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de los docentes',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        });
        option = docentes.map((obj)=>{
            let opt = '<option value="'+obj._id+'">'+obj.lastname+' '+obj.name+'</option>'
            return opt;
        })
        html += option;
        html += '</select>'
        html += '</div>'
        $('#row_3').append(html)
        html = '<div class="col-4">'
        html += '<label for="name" class="ms-1 fw-bold">Buscar Docente por Cédula</label>'
        html += '<div class="input-group">'
        html += '<input id="cc" type="number" min="0" class="form-control" name="cc" placeholder="Cédula">'
        html += '<span class="input-group-text">'
        html += '<a type="button" title="Buscar" onclick="buscarDocente()"><i class="fas fa-search" style="color: black;"></i></a>'
        html += '</span>'
        html += '</div>'
        html += '</div>'
        $('#buscarDocente').append(html)
        $('#switch_3').val('1');
    }else{
        $('#row_3').children().remove();
        $('#icon_3').remove()
        html = '<i id="icon_3" class="fas fa-greater-than"></i>'
        $('#b_3').before(html)
        $('#switch_3').val('0');
    }
}

async function buscarDocente(){
    let cc = $('#cc').val()
    let docente;
    await $.ajax({
        type: "get",
        url: "/docentes/search/cc",
        data: {cc},
        success: function(r){
            docente = r.docente;
        },
        error: function (e) {
            Swal.fire({
                title: 'Error!',
                text: 'Se produjo un error en la búsqueda de docente por cédula',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#8c141b'
            });
            console.log("error: ", e);
        }
    })
    if(docente){
        let nombreDocente = docente.lastname +' '+docente.name;
        Swal.fire({
            html: 'Se encontró al docente: <b>'+nombreDocente+'</b> con la cédula: '+ cc,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#8c141b'
        });
        let docentes;
        await $.ajax({
            type: "get",
            url: "/docentes/search",
            data: {},
            success: function(r){
                docentes = r.docentes;
            },
            error: function (e) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Se produjo un error en la búsqueda de los docentes',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8c141b'
                });
                console.log("error: ", e);
            }
        });
        option = docentes.map((obj)=>{
            let opt = '<option value="'+obj._id+'">'+obj.lastname+' '+obj.name+'</option>'
            return opt;
        })
        $('#select_docente').append(option)
        $('#select_docente option[value="'+docente._id+'"]').prop('selected', true)
        $('#facultad option[value="todos"]').prop('selected', true)
        $('#programa option[value="todos"]').prop('selected', true)
    }
}

function YYYY_trimestre(){
    $('#year').prop('disabled',false)
    $('#year').prop('required',true)
    $('#trim').prop('disabled',false)

    $('#startDate1').prop('disabled',true)
    $('#endDate1').prop('disabled',true)

    $('#startDate2').prop('disabled',true)
    $('#endDate2').prop('disabled',true)
}

function start_end_date1(){
    $('#year').prop('disabled',true)
    $('#trim').prop('disabled',true)

    $('#startDate1').prop('disabled',false)
    $('#endDate1').prop('disabled',false)

    $('#startDate2').prop('disabled',true)
    $('#endDate2').prop('disabled',true)
}

function start_end_date2(){
    $('#year').prop('disabled',true)
    $('#trim').prop('disabled',true)

    $('#startDate1').prop('disabled',true)
    $('#endDate1').prop('disabled',true)

    $('#startDate2').prop('disabled',false)
    $('#endDate2').prop('disabled',false)
}

function checkGenerarInforme(){
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
        let switch_1 = $('#switch_1').val();
        let switch_2 = $('#switch_2').val();
        let switch_3 = $('#switch_3').val();
        if(switch_1=='0'&&switch_2=='0'&&switch_3=='0'){
            Swal.fire({
                html: 'Estás seguro de Generar un documento con todas las solicitudes existentes? (esto podría tardar bastante tiempo)',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Descargar',
                confirmButtonColor: '#8c141b',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#submitButton').click()
                }
            })
        }else{
            $('#submitButton').click()
        }
    }
}

//DataTables

$(document).ready(function () {
    $('#AllUsers').DataTable({
        language: {
            url: '/json/es-CO.json'
        },
        ordering:  false,
        "scrollCollapse": true,
        "paging": false,
    });
});

//MyPublications
$(document).ready(function () {
    $('#myPublications').DataTable({
        language: {
            url: '/json/es-CO.json'
        },
        ordering:  false,
        "scrollCollapse": true,
        "paging": false,
    });
});

//Primera Revisión
$(document).ready(function () {
    $('#primeraRevision').DataTable({
        language: {
            url: '/json/es-CO.json'
        },
        ordering:  false,
        "columnDefs": [
            { "width": "2%",
            "targets": 0,
            "searchable": false,
            "orderable": false,
        }
        ],
        "scrollCollapse": true,
        "paging": false,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Primera Revisión',
                exportOptions: {
                    columns: [ 0, 1, 2, 4 ]
                }
            },
            {
                extend: 'print',
                autoPrint: false,
                text: 'Ver',
                title: 'Primera Revisión',
                exportOptions: {
                    columns: [ 0, 1, 2, 4 ]
                }
            },
            {
                extend: 'pdfHtml5',
                //download: 'open',
                title: 'Primera Revisión',
                text: 'PDF',
                exportOptions: {
                    columns: [ 0, 1, 2, 4 ]
                }
            }
        ],
    });
});

//ISSN
$(document).ready(function () {
    $('#ISSN').DataTable({
        language: {
            url: '/json/es-CO.json'
        },
        ordering:  false,
        "scrollCollapse": true
    });
});