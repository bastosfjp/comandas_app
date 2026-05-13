import {
Typography,
Box
} from "@mui/material";
import PageLayout from "../common/PageLayout";
const Dashboard = () => {
return (
<PageLayout title="Dashboard" maxWidth="xl">
<Box sx={{ mb: 4 }}>
<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
Bem-vindo ao Comandas do Zé!
</Typography>
<Typography variant="body1" color="text.secondary">
{`Data: ${new Date().toLocaleDateString('pt-BR', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
})}`}
</Typography>
<Box
          component="img"
          src="icon.jpeg"
          alt="Logo Comandas do Zé"
          sx={{
            mt: 3,
            width: 200,
            borderRadius: 50
          }}
        />
</Box>
</PageLayout>
);
};
export default Dashboard;