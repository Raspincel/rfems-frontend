interface Props {
  children: React.ReactNode;
  title: string;
  buttonText: string;
  formAction: (event: React.FormEvent) => void;
}

export function AuthLayout({ children, title, formAction, buttonText }: Props) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    formAction(event);
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl rounded-lg flex flex-row overflow-hidden">
        <div className="w-1/3 bg-slate-600 text-white flex flex-col items-center py-10">
          <div className="text-3xl font-semibold mb-4 flex flex-col items-center gap-2 justify-center">
            <span className="text-4xl">🔒</span> RFEMS
          </div>
          <p>Simplify your file access</p>
        </div>
        <div className="bg-white flex-1 p-10">
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
          <form className="space-y-4">
          {children}
          <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition-colors"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
