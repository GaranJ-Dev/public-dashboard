import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import { CryptoWidget } from "@/widgets/CryptoWidget";
import { NewsWidget } from "@/widgets/NewsWidget";
import { NasaPODWidget } from "@/widgets/NasaPODWidget";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <DashboardLayout>
      <WeatherWidget />
      <CryptoWidget />
      <NewsWidget />
      <NasaPODWidget />
    </DashboardLayout>
  );
}
