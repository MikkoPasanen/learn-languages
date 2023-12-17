import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
      <>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8}}>
          <Typography variant="h3" sx={{mb: 1}}>Oops!</Typography>
          <Typography>The page you are looking for doesn&apos;t exist.</Typography>
          <Link to="/">
            <Button variant="contained" sx={{mt: 3}}>
                <Typography sx={{fontWeight: "bold"}}>Go back home</Typography>
            </Button>
          </Link>
        </Box>
      </>
    );
}