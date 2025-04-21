import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

interface SquareCardProps {
  title: string;
  imageUrl?: string;
  onClick?: () => void;
  sx?: SxProps;
}

const SquareCard: React.FC<SquareCardProps> = ({ title, imageUrl, onClick, sx }) => {
  return (
    <Card
      sx={{
        ...sx,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        {imageUrl && (
          <Box
            sx={{
              width: "100%",
              height: "70%",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <CardContent sx={{ height: imageUrl ? "30%" : "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography
            variant="h5"
            fontWeight={300}
            fontFamily={"'Monteserrat', sans-serif"}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SquareCard;
