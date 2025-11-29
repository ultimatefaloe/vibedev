import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Share & Discover
        <br className="" />
        <span className="blue_gradient">AI Prompt</span>
      </h1>
      <p className="desc text-center">
        Vibe Dev is an open-source AI prompting tool for mordern world to discover, create, and share creative propmts
      </p>

      {/* Feed */}
      <Feed />
    </section>
  );
};

export default Home;
