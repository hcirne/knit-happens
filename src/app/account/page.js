import AccountForm from "./AccountForm";

export const metadata = {
  title: "Your account · Knit Happens",
};

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-card p-12">
        <h1 className="font-heading text-3xl font-bold">Your account</h1>
        <p className="mt-2 mb-6 text-ink-soft">Change your details or delete your account.</p>
        <AccountForm />
      </div>
    </main>
  );
}
