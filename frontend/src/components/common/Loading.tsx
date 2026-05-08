export const Loading = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-3xl bg-slate-900/80 p-6">
      <div className="flex flex-col items-center gap-3 text-center text-slate-300">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        <p>Loading...</p>
      </div>
    </div>
  );
};
