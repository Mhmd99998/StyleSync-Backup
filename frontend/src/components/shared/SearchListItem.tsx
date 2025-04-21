import React from "react";
import { ListItemButton, Box, Typography, Tooltip } from "@mui/material";
import { IndexedProductDto } from "../../models/Search";

interface SearchListItemProps {
  product: IndexedProductDto;
  onClick: (product: IndexedProductDto) => void;
}

const SearchListItem: React.FC<SearchListItemProps> = ({ product, onClick }) => {
  const colorChips = Array.from(
    new Set(product.variants.map((variant) => variant.color))
  );

  const displayedColors = colorChips.slice(0, 3);
  const remainingCount = colorChips.length - displayedColors.length;

  return (
    <ListItemButton
      onClick={() => onClick(product)}
      sx={{
        fontFamily: "'Montserrat', sans-serif",
        opacity: 0.95,
        transition: "all 0.2s ease, opacity 0.2s ease",
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "10px 16px", 
        position: "relative", 
        "&:hover": {
          backgroundColor: "background.paper", 
          opacity: 1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0, 
          left: "50%", 
          width: "95%", 
          height: "1.5px",
          backgroundColor: "primary.main",
          transform: "translateX(-50%) scaleX(0)", 
          transformOrigin: "center", 
          transition: "transform 0.3s ease", 
        },
        "&:hover::after": {
          transform: "translateX(-50%) scaleX(1)", 
        },
      }}
    >
      {/* Text content on the left */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={500}>
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description
            ? product.description.length > 80
              ? product.description.slice(0, 77) + "..."
              : product.description
            : ""}
        </Typography>
      </Box>

      {/* Color chips and remaining count on the right */}
      {displayedColors.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.2, mt: 1.5, flexWrap: "wrap" }}>
          {displayedColors.map((color) => (
            <Tooltip title={color} arrow key={color}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: color.toLowerCase(),
                  border: "1px solid",
                }}
              />
            </Tooltip>
          ))}
          {remainingCount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              sx={{ ml: 1 }}
            >
              +{remainingCount} more
            </Typography>
          )}
        </Box>
      )}
    </ListItemButton>
  );
};

export default SearchListItem;
