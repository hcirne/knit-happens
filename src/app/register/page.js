import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Create an account · Knit Happens",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-card p-12">
        <h1 className="font-heading text-3xl font-bold">Create account</h1>
        <p className="mt-2 mb-6 text-ink-soft">
          Join the community to share projects and comment.
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
