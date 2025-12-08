"use strict";

// $("#modal-1").fireModal({body: 'Modal body text goes here.'});
// $("#modal-2").fireModal({body: 'Modal body text goes here.', center: true});
$("#editFakultasBtn").fireModal({
  title: 'Edit Fakultas',
  body: `
    <form>
      <div class="form-group">
        <label>Nama Fakultas</label>
        <input type="text" class="form-control" value="Fakultas Teknik">
      </div>
      <div class="form-group">
        <label>Kode Fakultas</label>
        <input type="text" class="form-control" value="2018178">
      </div>
    </form>
  `,
  footerClass: 'text-right',
  buttons: [
    {
      text: 'Simpan Perubahan',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
        alert("Data fakultas berhasil diubah!");
        modal.modal('hide');
      }
    }
  ],
  size: 'modal-md',
  center: true
});


$("#modal-2").fireModal({
  title: 'Detail Kartu Hasil Studi',
  body: `
    <div id="khsContent">
      <p><strong>Nama :</strong> Ujang Maman</p>
      <p><strong>NIM :</strong> 1234567890</p>
      <p><strong>Tahun Ajaran :</strong> 2025/2026</p>
      <p><strong>Semester :</strong> 1</p>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode MK</th>
              <th>Nama Mata Kuliah</th>
              <th>SKS</th>
              <th>Huruf Mutu</th>
              <th>Bobot</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>IF201</td>
              <td>Pemrograman Web</td>
              <td>3</td>
              <td>A</td>
              <td>4.00</td>
              <td>90</td>
            </tr>
            <tr>
              <td>2</td>
              <td>IF202</td>
              <td>Struktur Data</td>
              <td>3</td>
              <td>B+</td>
              <td>3.50</td>
              <td>80</td>
            </tr>
            <tr>
              <td>3</td>
              <td>IF203</td>
              <td>Sistem Operasi</td>
              <td>3</td>
              <td>A-</td>
              <td>3.75</td>
              <td>85</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3">Total SKS</th>
              <td>9</td>
              <th colspan="2">Total Nilai Akhir</th>
              <td>85</td>
            </tr>
            <tr>
              <th colspan="6" class="text-right">IP Semester</th>
              <td>3.75</td>
            </tr>
            <tr>
              <th colspan="6" class="text-right">IPK</th>
              <td>3.60</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
  size: 'modal-lg',
  center: true,
  buttons: [
    {
      text: 'Download PDF',
      class: 'btn btn-primary',
      handler: function () {
        const element = document.getElementById('khsContent');
        html2pdf().from(element).set({
          margin: 1,
          filename: 'KHS-Ujang-Maman.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'cm', format: 'a4' }
        }).save();
      }
    }
  ]
});


$("#modal-1").fireModal({
  title: 'Detail Kartu Rencana Studi',
  body: `
    <div id="krsContent">
      <p><strong>Nama :</strong> Ujang Maman</p>
      <p><strong>NIM :</strong> 1234567890</p>
      <p><strong>Tahun Ajaran :</strong> 2025/2026</p>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Kode MK</th>
              <th>Nama Mata Kuliah</th>
              <th>SKS</th>
              <th>Dosen Pengampu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IF201</td>
              <td>Pemrograman Web</td>
              <td>3</td>
              <td>Dr. Indra Kusuma</td>
            </tr>
            <tr>
              <td>IF202</td>
              <td>Struktur Data</td>
              <td>3</td>
              <td>Prof. Dian Astuti</td>
            </tr>
            <tr>
              <td>IF203</td>
              <td>Sistem Operasi</td>
              <td>3</td>
              <td>Dr. Rudi Hartono</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">Total SKS</th>
              <th colspan="2">9</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
  size: 'modal-lg',
  center: true,
  buttons: [
    {
      text: 'Download PDF',
      class: 'btn btn-primary',
      handler: function () {
        const element = document.getElementById('krsContent');
        html2pdf().from(element).set({
          margin: 1,
          filename: 'KRS-Ujang-Maman.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'cm', format: 'a4' }
        }).save();
      }
    }
  ]
});

$("#btn-approve-krs").fireModal({
  title: 'Approve Kartu Rencana Studi',
  body: `
    <form id="form-approve-krs">
      <div class="form-group">
        <label>Nama Mahasiswa</label>
        <input type="text" class="form-control" value="Ujang Maman" readonly>
      </div>
      <div class="form-group">
        <label>NIM</label>
        <input type="text" class="form-control" value="1234567890" readonly>
      </div>
      <div class="form-group">
        <label>Tahun Ajaran</label>
        <input type="text" class="form-control" value="2025/2026" readonly>
      </div>
      <div class="form-group">
        <label>Status KRS</label>
        <select class="form-control" name="status">
          <option value="pending">Menunggu Persetujuan</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>
      <div class="form-group">
        <label>Catatan (Opsional)</label>
        <textarea class="form-control" name="catatan" rows="3" placeholder="Tulis catatan jika ada..."></textarea>
      </div>
    </form>
  `,
  size: 'modal-md',
  center: true,
  buttons: [
    {
      text: 'Simpan',
      class: 'btn btn-primary btn-shadow',
      submit: true,
      handler: function(modal) {}
    },
    {
      text: 'Batal',
      class: 'btn btn-secondary',
      handler: function(modal) {
        modal.modal('hide');
      }
    }
  ],
  onFormSubmit: function(modal, e, form) {
    e.preventDefault();

    // Ambil data dari form
    const status = $('#form-approve-krs select[name="status"]').val();
    const catatan = $('#form-approve-krs textarea[name="catatan"]').val();

    console.log('Status KRS:', status);
    console.log('Catatan:', catatan);

    // Simulasikan submit sukses
    form.stopProgress();
    modal.modal('hide');
    iziToast.success({
      title: 'Berhasil',
      message: 'Status KRS berhasil diperbarui!',
      position: 'topRight'
    });

    // Bisa juga dihubungkan ke AJAX di sini
  }
});



let modal_3_body = '<p>Object to create a button on the modal.</p><pre class="language-javascript"><code>';
modal_3_body += '[\n';
modal_3_body += ' {\n';
modal_3_body += "   text: 'Login',\n";
modal_3_body += "   submit: true,\n";
modal_3_body += "   class: 'btn btn-primary btn-shadow',\n";
modal_3_body += "   handler: function(modal) {\n";
modal_3_body += "     alert('Hello, you clicked me!');\n"
modal_3_body += "   }\n"
modal_3_body += ' }\n';
modal_3_body += ']';
modal_3_body += '</code></pre>';
$("#modal-3").fireModal({
  title: 'Modal with Buttons',
  body: modal_3_body,
  buttons: [
    {
      text: 'Click, me!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
        alert('Hello, you clicked me!');
      }
    }
  ]
});

$("#modal-4").fireModal({
  footerClass: 'bg-whitesmoke',
  body: 'Add the <code>bg-whitesmoke</code> class to the <code>footerClass</code> option.',
  buttons: [
    {
      text: 'No Action!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-5").fireModal({
  title: 'Login',
  body: $("#modal-login-part"),
  footerClass: 'bg-whitesmoke',
  autoFocus: false,
  onFormSubmit: function(modal, e, form) {
    // Form Data
    let form_data = $(e.target).serialize();
    console.log(form_data)

    // DO AJAX HERE
    let fake_ajax = setTimeout(function() {
      form.stopProgress();
      modal.find('.modal-body').prepend('<div class="alert alert-info">Please check your browser console</div>')

      clearInterval(fake_ajax);
    }, 1500);

    e.preventDefault();
  },
  shown: function(modal, form) {
    console.log(form)
  },
  buttons: [
    {
      text: 'Login',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-6").fireModal({
  body: '<p>Now you can see something on the left side of the footer.</p>',
  created: function(modal) {
    modal.find('.modal-footer').prepend('<div class="mr-auto"><a href="#">I\'m a hyperlink!</a></div>');
  },
  buttons: [
    {
      text: 'No Action',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$('.oh-my-modal').fireModal({
  title: 'My Modal',
  body: 'This is cool plugin!'
});