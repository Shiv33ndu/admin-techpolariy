import { useState } from "react";

import useArticles from "../hooks/useArticles";

import ArticleTable from "../components/articles/ArticleTable";

import Header from "../components/layout/Header";

import ArticleForm from "../components/articles/ArticleForm";

export default function ArticlesPage({
  token,
}) {
  const [page] = useState(1);

  const [open, setOpen] = useState(false);

  const {
    articles,
    loading,
    refetch,
  } = useArticles(token, page, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Header title="Articles" />

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + New Article
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ArticleTable articles={articles} />
      )}

      <ArticleForm
        open={open}
        setOpen={setOpen}
        token={token}
        refetch={refetch}
      />
    </div>
  );
}