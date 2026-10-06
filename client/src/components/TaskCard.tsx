import { SquarePen, Trash2 } from 'lucide-react'

interface TaskCardProps {
  title: string
  description: string
  category: string
  onEdit: () => void
  onDelete: () => void
}

function TaskCard({
  title,
  description,
  category,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      className="w-full rounded-[10px] border-[0.5px] border-[#B8B6B6] bg-white px-5 py-4 shadow-none"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-4 border-b-[0.5px] border-[#B8B6B6] pb-1.5">
        {/* Category */}
        <span
          className={`mt-1 text-[15px] font-semibold leading-none tracking-[0.02em] ${
            category === 'Urgent'
              ? 'text-[#F16B6B]'
              : category === 'Important'
                ? 'text-[#73C3A6]'
                : 'text-[#73C3A6]'
          }`}
        >
          {category}
        </span>

            {/* Actions */}
        <div className="flex gap-3">
          {/* Edit Button */}
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-[40px] items-center gap-2 rounded-[8px] bg-[#9747D7] px-4 text-[15px] font-medium text-white"
          >
            <SquarePen size={17} strokeWidth={1.8} />
            <span>Edit</span>
          </button>
         
          <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#B8B6B6] bg-white px-4 py-2 text-sm font-medium text-[#9747D7] shadow-sm transition hover:bg-purple-50"
>
          <Trash2 size={17} strokeWidth={1.8} />
          <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Task content */}
      <div className="pt-3 text-left">
        <h3 className="text-[23px] font-medium leading-[1.2] text-[#4D4D4D]">
          {title}
        </h3>

        <p className="mt-3 w-full text-[15px] leading-[1.42] tracking-[0.005em] text-[#737171]">
          {description}
        </p>
      </div>

    </article>
  )
}

export default TaskCard