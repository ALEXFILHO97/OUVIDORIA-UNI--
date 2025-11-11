import Spinner from '@/app/components/Spinner';
import prisma from '@/libs/prisma/prismaClient';
import HomePage from '../components/home';
import { ModeToggle } from '@/components/ui/ModeToggle';

export const revalidate = 0;

export default async function Home() {
  const items = await prisma.item.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const types = await prisma.type.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!items || !categories || !types) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center py-12 px-8 subpixel-antialiased md:w-2/3 md:m-auto md:py-12 md:px-8">
      <div className="w-full flex justify-end mb-4">
        <ModeToggle /> 
      </div>

      <HomePage items={items} categories={categories} types={types} />
    </div>
  );
}