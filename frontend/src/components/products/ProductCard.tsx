import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Tooltip,
  SxProps,
  Theme,
} from "@mui/material";
import { getChipColor, isLightColor, isValidCssColor } from "../../utils/colorUtils";

interface ProductProps {
  name: string;
  imageUrl?: string;
  colors: string[];
  prices: number[];
  onImageClick?: () => void;
  sx?: SxProps<Theme>;
}

const ProductCard: React.FC<ProductProps> = ({
  name,
  imageUrl,
  colors,
  prices,
  onImageClick,
  sx,
}) => {
  const price = `$${Math.min(...prices).toFixed(2)}`;

  return (
    <Card
      sx={{
        width: 340,
        borderRadius: 0.5,
        overflow: "hidden",
        boxShadow: 4,
        transition: "transform 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.01)",
        },
        ...sx,
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        image={imageUrl || "https://placehold.co/600x850@2x.png"}
        alt={name}
        onClick={onImageClick}
        sx={{
          height: 480,
          objectFit: "cover",
          width: "100%",
        }}
      />

      {/* Content Below Image */}
      <CardContent sx={{ px: 3, py: 2 }}>
        {/* Product Name */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 400,
            fontSize: "1.2rem",
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>

        {/* Price */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 300,
            fontSize: "1.05rem",
            color: "text.secondary",
            mt: 0.8,
          }}
        >
          {price}
        </Typography>

        {/* Color Chips */}
        <Box sx={{ display: "flex", gap: 1.2, mt: 1.5, flexWrap: "wrap" }}>
          {colors.map((color) => {
            const chipColor = getChipColor(color);
            const isValid = isValidCssColor(chipColor);
            const needsBorder = isLightColor(chipColor);

            return (
              <Tooltip title={color} arrow key={color}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: isValid ? chipColor : "transparent",
                    border: `2px ${isValid ? (needsBorder ? "solid #999" : "solid #ccc") : "dashed #aaa"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: "text.secondary",
                  }}
                >
                  {!isValid && "?"}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
