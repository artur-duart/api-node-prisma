import { AppError } from "../../../../errors/AppError";
import { prisma } from "../../../../prisma/client";
import { CreateMovieRentDTO } from "../../dtos/CreateMovieRentDTO";

export class CreateMovieRentUseCase {
  async execute({ movieId, userId }: CreateMovieRentDTO): Promise<void> {
    const movieExists = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movieExists) {
      throw new AppError("Movie not found!");
    }

    const movieAlreadyRented = await prisma.movieRent.findFirst({
      where: { id_movie: movieId },
    });

    if (movieAlreadyRented) {
      throw new AppError("Movie already rented!");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new AppError("User does not exist!");
    }

    await prisma.movieRent.create({
      data: {
        id_movie: movieId,
        id_user: userId,
      },
    });
  }
}
