import { useState } from "react";
import useArticles from "../hooks/useArticles";
import { articleApi } from "../api/articles.api";

import ArticleTable from "../components/articles/ArticleTable";
import Header from "../components/layout/Header";
import ArticleForm from "../components/articles/ArticleForm";

export default function ArticlesPage({ token }) {
  const [page] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const {
    articles,
    loading,
    refetch,
  } = useArticles(token, page, {});

  const handleCreate = () => {
    setSelectedArticle(null);
    setOpen(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setOpen(true);
  };

  const handleDelete = async (slug) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    try {
      await articleApi.delete(token, slug);

      alert("Article deleted successfully");

      refetch();
    } catch (error) {
      console.error(error);

      alert("Failed to delete article");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Header title="Articles" />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + New Article
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ArticleTable
          articles={articles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ArticleForm
        open={open}
        setOpen={setOpen}
        token={token}
        refetch={refetch}
        article={selectedArticle}
      />
    </div>
  );
}