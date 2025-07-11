export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto p-5 flex justify-center">
      {children}
    </div>
  );
}
