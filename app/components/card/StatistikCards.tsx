import React from "react";

interface StatistikCardsProps {
  totalStudents?: number;
  totalClasses?: number;
  totalSks?: number;
}
type ProfileKey = "totalStudents" | "totalClasses" | "totalSks" | "schedules";

const StatistikCards: React.FC<StatistikCardsProps> = ({
  totalStudents = 0,
  totalClasses = 0,
  totalSks = 0,
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
      label: "Total Mahasiswa",
      icon: "fas fa-user-graduate",
      gradient: "linear-gradient(135deg, #C084FC, #9333EA)",
      iconColor: "#C084FC",
    },
    {
      key: "totalClasses",
      label: "Total Kelas",
      icon: "fas fa-chalkboard-teacher",
      gradient:
        "linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(234, 88, 12, 0.9))",
      iconColor: "#fb923c",
    },
    {
      key: "totalSks",
      label: "Total SKS",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #4ADE80, #16A34A)",
      iconColor: "#4ADE80",
    },
  ];

  const getValue = (key: ProfileKey) => {
    switch (key) {
      case "totalStudents":
        return totalStudents;
      case "totalClasses":
        return totalClasses;
      case "totalSks":
        return totalSks;
      default:
        return 0;
    }
  };

  return (
    <div className="row gx-3" style={{ height: "170px" }}>
      {cards.map((card, index) => (
        <div className="col-12 col-md-4 mb-4" key={index}>
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
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
              }}
            >
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
      ))}
    </div>
  );
};

export default StatistikCards;
