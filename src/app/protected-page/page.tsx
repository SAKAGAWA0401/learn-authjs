export default async function ProtectedPage() {
    // auth.tsで制御している
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">ProtectedPage</h1>
          <p>This page is only accessible to authenticated users.</p>
        </div>
      );
}

