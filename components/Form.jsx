import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className="flex w-full max-w-full flex-start flex-col p-2">
      <div className="mb-4">
        <h1 className="head_text text-left">
          {" "}
          <span className="blue_gradient">{type} </span>Post
        </h1>
        <p>
          {type} and share amazing propmts with the world, and let your
          imagination run wild with any AI-powered platform
        </p>
      </div>

      <form
        action=""
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex-col gap-7 "
      >
        <div className="flex-col mb-3">
          <label htmlFor="post">
            <span className="font-satoshi font-semibold text-base text-blue-400">
              Your AI prompt
            </span>
          </label>
          <textarea
            value={post.prompt}
            name="post"
            id="post"
            className="form_textarea glassmorphism"
            placeholder="Rewrite your prompt here..."
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            required
          />
        </div>

        <div className="flex-col mb-3">
          <label htmlFor="post">
            <span className="font-satoshi font-semibold text-base text-blue-400">
              Tag <span>(#region, #love, #webdevelopment, #backend)</span>
            </span>
          </label>
          <input
            value={post.tag}
            name="tag"
            id="tag"
            className="form_input glassmorphism"
            placeholder="#tag"
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            required
          />
        </div>

        <div className="flex-end gap-3">
          <Link
            href="/"
            className="px-6 py-2 border border-blue-700 rounded-full text-blue-700"
          >
            {" "}
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 rounded-full text-white disabled:bg-blue-400 cursor-pointer"
            disabled={submitting}
          >
            {submitting ? `${type}...` : `${type}`}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
