import React from "react";

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

interface Class {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  class: Class;
  course: Course;
}

interface KelasMengajarProps {
  schedules?: Schedule[];
  detailLink?: string;
  showAllData?: boolean;
  showScrollbar?: boolean;
  title?: string;
}

const KelasMengajar: React.FC<KelasMengajarProps> = ({
  schedules = [],
  detailLink = "/pages/dosen/jadwal",
  showAllData = false,
  showScrollbar = true,
  title = "Kelar Mengajar",
}) => {
  const scrollbarStyles = showScrollbar ? {} : {};

  const displayedSchedules = showAllData ? schedules : schedules?.slice(0, 3);
  return (
    <div className="row mt-3">
      <div className="col-12">
        <div
          className="bg-white p-4 shadow-sm"
          style={{ borderRadius: "0.9rem" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-dark m-0">{title}</h5>

            {/* Titik 3 sebagai link */}
            <a
              href={detailLink}
              className="text-dark"
              style={{
                fontSize: "1.5rem",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              ...
            </a>
          </div>

          <style jsx>{`
            .scroll-container::-webkit-scrollbar {
              height: ${showScrollbar ? "6px" : "0px"};
            }
            .scroll-container::-webkit-scrollbar-track {
              background: #f8f9fa;
              border-radius: 10px;
            }
            .scroll-container::-webkit-scrollbar-thumb {
              background: rgba(108, 117, 125, 0.3);
              border-radius: 10px;
            }
            .scroll-container::-webkit-scrollbar-thumb:hover {
              background: rgba(108, 117, 125, 0.5);
            }
          `}</style>

          <div
            className="scroll-container"
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              ...scrollbarStyles,
              paddingBottom: showScrollbar ? "8px" : "0",
            }}
          >
            <div
              className="d-flex"
              style={{
                minWidth:
                  showAllData && schedules && schedules.length > 3
                    ? `${schedules.length * 230}px`
                    : "100%",
                gap: "1rem",
              }}
            >
              {displayedSchedules?.map((sch, index) => (
                <div
                  className="flex-shrink-0"
                  key={sch.id}
                  style={{
                    width:
                      showAllData && schedules && schedules.length > 3
                        ? "230px"
                        : "auto",
                    minWidth: "230px",
                  }}
                >
                  <div
                    className="card card-statistic-1 h-100 shadow-sm"
                    style={{
                      background:
                        index % 3 === 0
                          ? "linear-gradient(135deg, #FED7AA, #FED7AA)"
                          : index % 3 === 1
                          ? "linear-gradient(135deg, #DCFCE7, #BBF7D0)"
                          : "linear-gradient(135deg, #FEF3C7, #FDE68A)",
                      borderRadius: "0.9rem",
                      padding: "1rem",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header waktu */}
                    <div
                      style={{
                        background:
                          index % 3 === 0
                            ? "#F97316"
                            : index % 3 === 1
                            ? "#22C55E"
                            : "#EAB308",
                        borderRadius: "0.9rem",
                        padding: "4px 8px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        display: "inline-block",
                        width: "105px",
                      }}
                    >
                      {new Date(sch.timeStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(sch.timeEnd).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Nama mata kuliah */}
                    <div
                      style={{
                        marginTop: "1rem",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#41403eff",
                      }}
                    >
                      {sch.course.name}
                    </div>

                    {/* Nama kelas + SKS */}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        opacity: 0.9,
                        marginTop: "0.25rem",
                        color: "#41403eff",
                      }}
                    >
                      Kelas {sch.class.name} • {sch.course.credits} SKS
                    </div>
                  </div>
                </div>
              ))}

              {schedules?.length === 0 && (
                <div className="w-100">
                  <p className="text-center text-muted">
                    Belum ada kelas mengajar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelasMengajar;
