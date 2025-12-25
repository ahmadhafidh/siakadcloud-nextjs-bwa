import React from "react";

interface StatusData {
  disetujui: number;
  ditolak: number;
  diproses: number;
}

interface KrsKhsStatusCardProps {
  data?: StatusData;
  className?: string;
}

const KrsKhsStatusCard: React.FC<KrsKhsStatusCardProps> = ({
  data = { disetujui: 123, ditolak: 123, diproses: 123 },
  className = "",
}) => {
  const total = data.disetujui + data.ditolak + data.diproses;

  // Calculate percentages for progress bar segments
  const disetujuiPercent = (data.disetujui / total) * 100;
  const ditolakPercent = (data.ditolak / total) * 100;
  const diprosesPercent = (data.diproses / total) * 100;

  return (
    <div
      className={`card shadow-sm ${className}`}
      style={{ maxWidth: "400px", borderRadius: "0.9rem", height:"380px" }}
    >
      <div className="card-body p-4">
        <h6 className="card-title fw-bold text-dark mb-3">
          KRS dan KHS Status
        </h6>

        <p className="text-muted mb-4">Total {total} Pengajuan</p>

        {/* Multi-segment Progress Bar */}
        <div
          className="progress mb-4"
          style={{ height: "12px", borderRadius: "20px" }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${disetujuiPercent}%`,
              backgroundColor: "#ff8c69",
              borderRadius: "20px 0 0 20px",
            }}
            aria-valuenow={disetujuiPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${ditolakPercent}%`,
              backgroundColor: "#ffb3a1",
            }}
            aria-valuenow={ditolakPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${diprosesPercent}%`,
              backgroundColor: "#ffd6cc",
              borderRadius: "0 20px 20px 0",
            }}
            aria-valuenow={diprosesPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>

        {/* Status Items */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark">Disetujui</span>
            <span className="fw-bold text-dark h5 mb-0">{data.disetujui}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark">Ditolak</span>
            <span className="fw-bold text-dark h5 mb-0">{data.ditolak}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark">Diproses</span>
            <span className="fw-bold text-dark h5 mb-0">{data.diproses}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KrsKhsStatusCard;
