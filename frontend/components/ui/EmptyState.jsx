export default function EmptyState({ icon = '🍽️', title = 'Nothing here', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      {description && <p className="text-gray-400 text-sm max-w-xs">{description}</p>}
    </div>
  );
}
