import { Box, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import { KNOWN_COLORS, getChipColor, isLightColor, isValidCssColor } from "../../utils/colorUtils";

const FilterSidebar: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const colorOptions = Object.keys(KNOWN_COLORS);

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  return (
    <Box
      sx={{
        width: 240,
        position: "sticky",
        top: 80,
        alignSelf: "flex-start",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Color Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}
        >
          Color
        </Typography>

        <Box sx={{ display: "flex", gap: 1.2, mt: 1.5, flexWrap: "wrap" }}>
          {colorOptions.map((color) => {
            const chipColor = getChipColor(color);
            const isValid = isValidCssColor(chipColor);
            const needsBorder = isLightColor(chipColor);
            const isSelected = selectedColors.includes(color);

            return (
              <Tooltip title={color} arrow key={color}>
                <Box
                  onClick={() => handleColorToggle(color)}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: isValid ? chipColor : "transparent",
                    border: `2px ${isValid ? (needsBorder ? "solid #999" : "solid #ccc") : "dashed #aaa"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: "text.secondary",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                    transform: isSelected ? "scale(1.15)" : "scale(1)",
                    boxShadow: isSelected ? "0 0 0 2px #1976d2" : "none", // Optional highlight
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {!isValid && "?"}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default FilterSidebar;
