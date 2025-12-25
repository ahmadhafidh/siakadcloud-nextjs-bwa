import React from "react";

interface Timeline {
  id: string;
  name: string;
  date: string;
}

interface TimelineAkademikProps {
  upcomingTimeline?: Timeline[];
  detailLink?: string;
  maxHeight?: string;
  showScrollbar?: boolean;
}

const TimelineAkademik: React.FC<TimelineAkademikProps> = ({
  upcomingTimeline = [],
  detailLink = "/timeline",
  maxHeight = "400px",
  showScrollbar = true,
}) => {
  const scrollbarStyles = showScrollbar ? {} : {};

  return (
      <div
        className="card card-statistic-1 h-100 d-flex flex-column"
        style={{
          background: "linear-gradient(135deg,  #4ADE80, #16A34A)",
          borderRadius: "0.9rem",
        }}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="text-white m-0">Timeline Akademik</h5>

          {/* Titik 3 sebagai link */}
          <a
            href={detailLink}
            className="text-white"
            style={{
              fontSize: "1.5rem",
              textDecoration: "none",
              lineHeight: 1,
              margin: "10px",
            }}
          >
            ...
          </a>
        </div>

        <div
          className="card-body text-white"
          style={{
            maxHeight: maxHeight,
            overflowY: "auto",
            overflowX: "hidden",
            ...scrollbarStyles,
            paddingRight: showScrollbar ? "8px" : "16px",
          }}
        >
          <style jsx>{`
            .card-body::-webkit-scrollbar {
              width: ${showScrollbar ? "6px" : "0px"};
            }
            .card-body::-webkit-scrollbar-track {
              background: transparent;
            }
            .card-body::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 10px;
            }
            .card-body::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          `}</style>
          {upcomingTimeline?.length ? (
            upcomingTimeline.map((item) => {
              const date = new Date(item.date);
              const day = date.getDate();
              const month = date.toLocaleString("id-ID", {
                month: "short",
              }); // Okt, Nov, dll

              return (
                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3 p-2"
                  style={{
                    background: "rgba(74, 222, 128, 0.2)",
                    borderRadius: "0.9rem",
                  }}
                >
                  {/* Icon tanggal */}
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      background: "white",
                      color: "#16A34A",
                      borderRadius: "0.5rem",
                      width: "50px",
                      height: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", lineHeight: "1" }}>
                      {day}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {month}
                    </span>
                  </div>

                  {/* Nama event */}
                  <div style={{ marginLeft: "1rem" }}>
                    <h6 className="m-0 text-white">{item.name}</h6>
                    <small className="text-white-50">
                      {date.toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white-50">Belum ada timeline</p>
          )}
        </div>
      </div>
  );
};

export default TimelineAkademik;
