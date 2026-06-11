import DashboardLayout from "@/components/layout/DashboardLayout";
import ClipperInteractive from "./ClipperInteractive";

export default async function AIClipper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let videoData = null;
  let error = null;

  try {
    const res = await fetch(`http://localhost:3001/video/${resolvedParams.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch video");
    videoData = await res.json();
  } catch (err) {
    error = err;
  }

  if (!videoData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <p className="text-white">Loading video data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Convert "local://uploads/filename.mp4" to "http://localhost:3001/uploads/filename.mp4"
  const videoUrl = videoData.url.startsWith("local://")
    ? videoData.url.replace("local://", "http://localhost:3001/")
    : videoData.url;

  return (
    <DashboardLayout>
      <ClipperInteractive videoData={videoData} initialVideoUrl={videoUrl} />
    </DashboardLayout>
  );
}
