import React from "react";

interface AdminStatCardsProps {
  totalStudents?: number;
  totalFaculties?: number;
  totalMajors?: number;
  totalClasses?: number;
  colWidths?: number[]; // array untuk mengatur lebar tiap card (1-12)
}

type ProfileKey =
  | "totalStudents"
  | "totalFaculties"
  | "totalMajors"
  | "totalClasses";

const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  totalStudents = 0,
  totalFaculties = 0,
  totalMajors = 0,
  totalClasses = 0,
  colWidths = [3, 3, 3, 3],
}) => {
  const cards: {
    key: ProfileKey;
    label: string;
    icon: string;
    gradient: string;
    iconColor: string;
  }[] = [
    {
      key: "totalStudents",
      label: "Mahasiswa Aktif",
      icon: "fas fa-user-graduate",
      gradient: "linear-gradient(135deg, #C084FC, #9333EA)",
      iconColor: "#C084FC",
    },
    {
      key: "totalFaculties",
      label: "Fakultas",
      icon: "fas fa-book",
      gradient:
        "linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(234, 88, 12, 0.9))",
      iconColor: "#fb923c",
    },
    {
      key: "totalMajors",
      label: "Program Studi",
      icon: "fas fa-graduation-cap",
      gradient:
        "linear-gradient(135deg, rgba(253, 224, 71, 0.9), rgba(212, 155, 33, 0.9))",
      iconColor: "#facc15",
    },
    {
      key: "totalClasses",
      label: "Total Kelas",
      icon: "fas fa-chalkboard-teacher",
      gradient: "linear-gradient(135deg, #4ADE80, #16A34A)",
      iconColor: "#4ADE80",
    },
  ];

  const getValue = (key: ProfileKey) => {
    switch (key) {
      case "totalStudents":
        return totalStudents;
      case "totalFaculties":
        return totalFaculties;
      case "totalMajors":
        return totalMajors;
      case "totalClasses":
        return totalClasses;
      default:
        return 0;
    }
  };

  return (
    <div className="row gx-3" style={{ height: "170px", paddingLeft: "15px" }}>
      {cards.map((card, index) => {
        const colWidth = colWidths[index] || 3; // default 3 jika tidak ada
        return (
          <div
            className={`col-12 col-md-${colWidth} mb-4 `}
            key={index}
            style={{ paddingLeft: "0px" }}
          >
            <div
              className="card card-statistic-1"
              style={{
                background: card.gradient,
                height: "20vh",
                borderRadius: "0.9rem",
                position: "relative",
                color: "white",
                padding: "1rem",
              }}
            >
              {/* Icon */}
              <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                <i
                  className={card.icon}
                  style={{
                    fontSize: "22px",
                    color: card.iconColor,
                    background: "white",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                ></i>
              </div>

              {/* Konten */}
              <div style={{ marginTop: "3rem", textAlign: "left" }}>
                <h2 style={{ margin: 0 }}>{getValue(card.key)}</h2>
                <p style={{ marginTop: "0.25rem", fontWeight: "bold" }}>
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatCards;
