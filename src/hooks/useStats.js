import { useEffect, useState } from "react";
import { articleApi } from "../api/articles.api";

const useStats = (token) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await articleApi.stats(token);
      setStats(data);
    };

    loadStats();
  }, []);

  return stats;
};

export default useStats;