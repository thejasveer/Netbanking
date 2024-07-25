export function Center({ children }: { children: any }) {
  return (
    <div className="flex justify-center items-start  min-content max-w-96 mx-auto overflow-auto ">
      {children}
    </div>
  );
}
