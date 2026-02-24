import Link from "next/link";
import { Stethoscope, Users, Calendar, PawPrint } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12 text-center animate-fade-in">
        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <PawPrint className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-extralight text-foreground">
            Welcome to <span className="font-medium text-primary">Vet</span>
            <span className="font-light">Hub</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-muted-foreground">
            A modern veterinary clinic management system. Manage pet owners,
            their pets, veterinarians, and appointments — all in one place.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/owners"
          className="card-hover flex flex-col items-center p-6 text-center animate-fade-in-up stagger-1"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mb-2 font-medium text-foreground">Owners</h2>
          <p className="text-sm font-light text-muted-foreground">
            Manage pet owner information and their contact details
          </p>
        </Link>

        <Link
          href="/owners"
          className="card-hover flex flex-col items-center p-6 text-center animate-fade-in-up stagger-2"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <PawPrint className="h-7 w-7 text-accent" />
          </div>
          <h2 className="mb-2 font-medium text-foreground">Pets</h2>
          <p className="text-sm font-light text-muted-foreground">
            View and manage pets, their types, and medical history
          </p>
        </Link>

        <Link
          href="/vets"
          className="card-hover flex flex-col items-center p-6 text-center animate-fade-in-up stagger-3"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Stethoscope className="h-7 w-7 text-success" />
          </div>
          <h2 className="mb-2 font-medium text-foreground">Veterinarians</h2>
          <p className="text-sm font-light text-muted-foreground">
            Browse our team of veterinary specialists
          </p>
        </Link>

        <Link
          href="/visits"
          className="card-hover flex flex-col items-center p-6 text-center animate-fade-in-up stagger-4"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/10">
            <Calendar className="h-7 w-7 text-warning" />
          </div>
          <h2 className="mb-2 font-medium text-foreground">Visits</h2>
          <p className="text-sm font-light text-muted-foreground">
            Schedule and manage veterinary appointments
          </p>
        </Link>
      </section>
    </div>
  );
}
