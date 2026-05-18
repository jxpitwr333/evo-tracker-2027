import { auth } from '@/auth';
import { db } from '@/lib/db';
import { kanbanCard } from '@/lib/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { KanbanClient } from './KanbanClient';

export default async function KanbanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const cards = await db
    .select()
    .from(kanbanCard)
    .where(
      and(
        isNull(kanbanCard.deletedAt),
        eq(kanbanCard.userId, Number(session.user.id))
      )
    );

  const serialized = cards.map((c) => ({
    id: c.id,
    status: c.status,
    title: c.title,
    description: c.description,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col">
      {/* Header */}
      <div className="border-b-4 border-black bg-blue-400 px-4 sm:px-8 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="font-bold text-sm border-b-2 border-black hover:bg-yellow-300 transition-colors"
            >
              &larr; Home
            </Link>
            <h1 className="font-black text-4xl sm:text-5xl mt-2 leading-none">KANBAN</h1>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <KanbanClient initialCards={serialized} />
      </div>
    </div>
  );
}
