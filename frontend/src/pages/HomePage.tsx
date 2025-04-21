import { Box, Divider, Typography } from "@mui/material";
import ProductCatalog from "../components/products/ProductCatalog";
import Navbar from "../components/shared/Navbar";
import SquareCard from "../components/shared/SquareCard"; // Assuming you placed it here
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Browse by Category */}
      <Box
        sx={{
          px: 4,
          mt: 6,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight={300}
          gutterBottom
          fontFamily={"'Monteserrat', sans-serif"}
        >
          BROWSE BY CATEGORY
        </Typography>

        <Divider sx={{ mb: 2, width: "100%" }} />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {[
            { title: "FORMAL", path: "/category/formal" },
            { title: "CASUAL", path: "/category/casual" },
            { title: "WOMEN", path: "/category/women" },
            { title: "KIDS", path: "/category/kids" },
          ].map(({ title, path }) => (
            <SquareCard
              key={title}
              title={title}
              onClick={() => navigate(path)}
              sx={{
                width: {
                  xs: "100%",       // Full width on mobile
                  sm: "48%",        // 2 cards per row on small screens
                  md: "22%",        // 4 cards per row on medium and up
                },
                aspectRatio: "1",   // Make it square
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Product Catalog */}
      <ProductCatalog />

      {/* Divider */}
      <Divider sx={{ my: 4, width: "100%" }} />
    </Box>
  );
};

export default HomePage;
