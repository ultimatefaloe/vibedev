import Feed from "@components/Feed";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <section>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          VibeDev
        </h1>
        <p className="text-[#888] text-sm">
          Discover and share AI prompts that make vibe coding better.
        </p>
      </div>
      <Feed />
    </section>
  );
}