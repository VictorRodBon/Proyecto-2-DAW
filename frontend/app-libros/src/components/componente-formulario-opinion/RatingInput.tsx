import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}
export function RatingInput({ 
  value, 
  onChange, 
  size = "medium", 
  disabled = false 
}: RatingInputProps) {
  return (
    <Rating
      name="puntuacion-rating"
      value={value}
      onChange={(_event, newValue) => onChange(newValue || 0)}
      precision={1}
      size={size}
      disabled={disabled}
      aria-label={disabled ? "Puntuación deshabilitada" : `Puntuación: ${value} de 5 estrellas`}
      icon={<StarIcon fontSize="inherit" />}
      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
    />
  );
}