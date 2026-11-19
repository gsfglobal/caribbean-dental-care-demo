import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="brand-wash flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="h-lg">Deze pagina bestaat niet.</h1>
      <p className="lead">Misschien is de pagina verplaatst. Ga terug naar de homepage.</p>
      <Link href="/" className="btn btn-primary">Naar de homepage</Link>
    </main>
  );
}
