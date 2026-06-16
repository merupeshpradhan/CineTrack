import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMovieForm from "./EditMovieForm";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    notFound();
  }

  // Convert the native Date object safely into a string format ("YYYY-MM-DD")
  let formattedDate = "";
  if (movie.watchDate) {
    const d = new Date(movie.watchDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toISOString().split("T")[0];
    }
  }

  const serializedMovie = {
    id: movie.id,
    title: movie.title,
    genre: movie.genre || "",
    duration: movie.duration || "",
    imageUrl: movie.imageUrl || "",
    watchDate: formattedDate,
    watched: movie.watched,
    location: (movie as any).location || "",
  };

  return <EditMovieForm movie={serializedMovie} />;
}
