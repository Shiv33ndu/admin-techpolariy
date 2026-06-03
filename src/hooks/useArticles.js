import { useEffect, useState } from "react";
import { articleApi } from "../api/articles.api";

const useArticles = (token, page, filters) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
        ...filters,
      };

      const data = await articleApi.list(token, params);


console.log("API Response:", data);

      setArticles(
        Array.isArray(data)
          ? data
          : data?.articles || []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, JSON.stringify(filters)]);

  return {
    articles,
    loading,
    refetch: fetchArticles,
  };
};

export default useArticles;