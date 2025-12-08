import React from 'react';

const JadwalDashboard = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Jadwal</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4>Jadwal</h4>
              </div>
              <div className="card-body">
                <div className="fc-overflow">
                  <div id="myEvent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JadwalDashboard;
