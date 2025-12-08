"use strict";

(function($, window, i) {
  // Bootstrap 4 Modal
  $.fn.fireModal = function(options) {
    var options = $.extend({
      size: 'modal-md',
      center: false,
      animation: true,
      title: 'Modal Title',
      closeButton: true,
      header: true,
      bodyClass: '',
      footerClass: '',
      body: '',
      buttons: [],
      autoFocus: true,
      created: function() {},
      appended: function() {},
      onFormSubmit: function() {},
      modal: {}
    }, options);

    this.each(function() {
      i++;
      var id = 'fire-modal-' + i,
        trigger_class = 'trigger--' + id,
        trigger_button = $('.' + trigger_class);

      $(this).addClass(trigger_class);

      // Get modal body
      let body = options.body;

      if(typeof body == 'object') {
        if(body.length) {
          let part = body;
          body = body.removeAttr('id').clone().removeClass('modal-part');
          part.remove();
        }else{
          body = '<div class="text-danger">Modal part element not found!</div>';
        }
      }

      // Modal base template
      var modal_template = '   <div class="modal'+ (options.animation == true ? ' fade' : '') +'" tabindex="-1" role="dialog" id="'+ id +'">  '  + 
                 '     <div class="modal-dialog '+options.size+(options.center ? ' modal-dialog-centered' : '')+'" role="document">  '  + 
                 '       <div class="modal-content">  '  + 
                 ((options.header == true) ?
                 '         <div class="modal-header">  '  + 
                 '           <h5 class="modal-title">'+ options.title +'</h5>  '  + 
                 ((options.closeButton == true) ?
                 '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">  '  + 
                 '             <span aria-hidden="true">&times;</span>  '  + 
                 '           </button>  '
                 : '') + 
                 '         </div>  '
                 : '') +
                 '         <div class="modal-body">  '  + 
                 '         </div>  '  +
                 (options.buttons.length > 0 ?
                 '         <div class="modal-footer">  '  + 
                 '         </div>  '  
                 : '')+ 
                 '       </div>  '  + 
                 '     </div>  '  + 
                 '  </div>  ' ; 

      // Convert modal to object
      var modal_template = $(modal_template);

      // Start creating buttons from 'buttons' option
      var this_button;
      options.buttons.forEach(function(item) {
        // get option 'id'
        let id = "id" in item ? item.id : '';

        // Button template
        this_button = '<button type="'+ ("submit" in item && item.submit == true ? 'submit' : 'button') +'" class="'+ item.class +'" id="'+ id +'">'+ item.text +'</button>';

        // add click event to the button
        this_button = $(this_button).off('click').on("click", function() {
          // execute function from 'handler' option
          item.handler.call(this, modal_template);
        });
        // append generated buttons to the modal footer
        $(modal_template).find('.modal-footer').append(this_button);
      });

      // append a given body to the modal
      $(modal_template).find('.modal-body').append(body);

      // add additional body class
      if(options.bodyClass) $(modal_template).find('.modal-body').addClass(options.bodyClass);

      // add footer body class
      if(options.footerClass) $(modal_template).find('.modal-footer').addClass(options.footerClass);
      
      // execute 'created' callback
      options.created.call(this, modal_template, options);

      // modal form and submit form button
      let modal_form = $(modal_template).find('.modal-body form'),
        form_submit_btn = modal_template.find('button[type=submit]');

      // append generated modal to the body
      $("body").append(modal_template);

      // execute 'appended' callback
      options.appended.call(this, $('#' + id), modal_form, options);

      // if modal contains form elements
      if(modal_form.length) {
        // if `autoFocus` option is true
        if(options.autoFocus) {
          // when modal is shown
          $(modal_template).on('shown.bs.modal', function() {
            // if type of `autoFocus` option is `boolean`
            if(typeof options.autoFocus == 'boolean')
              modal_form.find('input:eq(0)').focus(); // the first input element will be focused
            // if type of `autoFocus` option is `string` and `autoFocus` option is an HTML element
            else if(typeof options.autoFocus == 'string' && modal_form.find(options.autoFocus).length) 
              modal_form.find(options.autoFocus).focus(); // find elements and focus on that
          });
        }

        // form object
        let form_object = {
          startProgress: function() {
            modal_template.addClass('modal-progress');
          },
          stopProgress: function() {
            modal_template.removeClass('modal-progress');
          }
        };

        // if form is not contains button element
        if(!modal_form.find('button').length) $(modal_form).append('<button class="d-none" id="'+ id +'-submit"></button>');

        // add click event
        form_submit_btn.click(function() {
          modal_form.submit();
        });

        // add submit event
        modal_form.submit(function(e) {
          // start form progress
          form_object.startProgress();

          // execute `onFormSubmit` callback
          options.onFormSubmit.call(this, modal_template, e, form_object);
        });
      }

      $(document).on("click", '.' + trigger_class, function() {
        $('#' + id).modal(options.modal);
        
        return false;
      });
    });
  }

  // Bootstrap Modal Destroyer
  $.destroyModal = function(modal) {
    modal.modal('hide');
    modal.on('hidden.bs.modal', function() {
    });
  }

  // Card Progress Controller
  $.cardProgress = function(card, options) {
    var options = $.extend({
      dismiss: false,
      dismissText: 'Cancel',
      spinner: true,
      onDismiss: function() {}
    }, options);

    var me = $(card);

    me.addClass('card-progress');
    if(options.spinner == false) {
      me.addClass('remove-spinner');
    }

    if(options.dismiss == true) {
      var btn_dismiss = '<a class="btn btn-danger card-progress-dismiss">'+options.dismissText+'</a>';
      btn_dismiss = $(btn_dismiss).off('click').on('click', function() {
        me.removeClass('card-progress');
        me.find('.card-progress-dismiss').remove();
        options.onDismiss.call(this, me);
      });
      me.append(btn_dismiss);
    }

    return {
      dismiss: function(dismissed) {
        $.cardProgressDismiss(me, dismissed);
      }
    };
  }

  $.cardProgressDismiss = function(card, dismissed) {
    var me = $(card);
    me.removeClass('card-progress');
    me.find('.card-progress-dismiss').remove();   
    if(dismissed)
      dismissed.call(this, me);
  }

  $.chatCtrl = function(element, chat) {
    var chat = $.extend({
      position: 'chat-right',
      text: '',
      time: moment(new Date().toISOString()).format('hh:mm'),
      picture: '',
      type: 'text', // or typing
      timeout: 0,
      onShow: function() {}
    }, chat);

    var target = $(element),
        element = '<div class="chat-item '+chat.position+'" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text">'+chat.text+'</div>' +
                  '<div class="chat-time">'+chat.time+'</div>' +
                  '</div>' +
                  '</div>',
        typing_element = '<div class="chat-item chat-left chat-typing" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text"></div>' +
                  '</div>' +
                  '</div>';

      var append_element = element;
      if(chat.type == 'typing') {
        append_element = typing_element;
      }

      if(chat.timeout > 0) {
        setTimeout(function() {
          target.find('.chat-content').append($(append_element).fadeIn());
        }, chat.timeout);
      }else{
        target.find('.chat-content').append($(append_element).fadeIn());
      }

      var target_height = 0;
      target.find('.chat-content .chat-item').each(function() {
        target_height += $(this).outerHeight();
      });
      setTimeout(function() {
        target.find('.chat-content').scrollTop(target_height, -1);
      }, 100);
      chat.onShow.call(this, append_element);
  }
})(jQuery, this, 0);

//tambah fakultas 
$(document).ready(function () {
  let index = $('#table-1 tbody tr').length;

  $('#formTambahFakultas').on('submit', function (e) {
    e.preventDefault();

    const nama = $('#inputNamaFakultas').val();
    const logoInput = $('#inputLogoFakultas')[0].files[0];
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const tanggal = today.toLocaleDateString('id-ID', options);

    if (!nama) {
      alert("Nama Fakultas wajib diisi!");
      return;
    }

    // Kode otomatis misalnya FT001, FT002, ...
    const kode = `FT${String(index + 1).padStart(3, '0')}`;

    const renderRow = (logoURL) => {
      const newRow = `
        <tr data-index="${index}">
          <td>${index + 1}</td>
          <td class="fakultas-nama">${nama}</td>
          <td class="fakultas-kode">${kode}</td>
          <td>
            <img alt="Logo" src="${logoURL}" class="rounded-circle" width="35">
          </td>
          <td>${tanggal}</td>
          <td>
            <a href="#" class="btn btn-icon btn-primary editFakultasBtn" 
              data-name="${nama}" data-kode="${kode}" data-index="${index}">
              <i class="far fa-edit"></i>
            </a>
            <a href="#" class="btn btn-icon btn-danger">
              <i class="fa fa-trash"></i>
            </a>
          </td>
        </tr>
      `;

      $('#table-1 tbody').append(newRow);
      index++;
      $('#formTambahFakultas')[0].reset();
      alert("Fakultas berhasil ditambahkan!");
    };

    if (logoInput) {
      const reader = new FileReader();
      reader.onload = function (e) {
        renderRow(e.target.result);
      };
      reader.readAsDataURL(logoInput);
    } else {
      renderRow('../../../assets/img/avatar/avatar-5.png');
    }
  });
});

//tambah prodi
$(document).ready(function () {
  let prodiCounter = $("#table-1 tbody tr").length + 1;

  $('#collapseTambahProdi form').on('submit', function (e) {
    e.preventDefault();

    const fakultas = $('#fakultas').val();
    const fakultasText = $('#fakultas option:selected').text();
    const namaProdi = $(this).find('input[type="text"]').val();
    const kodeProdi = Math.floor(1000000 + Math.random() * 9000000); // kode otomatis
    const tanggal = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    if (!fakultas || !namaProdi) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    const newRow = `
      <tr>
        <td>${prodiCounter++}</td>
        <td>${fakultasText}</td>
        <td>${namaProdi}</td>
        <td>${kodeProdi}</td>
        <td>${tanggal}</td>
        <td>
          <a href="#" class="btn btn-icon btn-primary">
            <i class="far fa-edit"></i>
          </a>
          <a href="#" class="btn btn-icon btn-danger">
            <i class="fa fa-trash"></i>
          </a>
        </td>
      </tr>
    `;

    $('#table-1 tbody').append(newRow);
    $(this).trigger('reset');
    $('#collapseTambahProdi').collapse('hide');
  });
});



