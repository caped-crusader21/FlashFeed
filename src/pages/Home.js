import React, { useEffect, useState, useCallback } from "react";

const categories = [
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
];

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const API_KEY = "7ea35d6a1b78412d9edead67dda5ff66";

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      let url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=7&apiKey=${API_KEY}`;
      if (category) {
        url += `&category=${category}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.articles) {
        setArticles(data.articles);
        setFeatured(data.articles[0] || null);
      } else {
        setArticles([]);
        setFeatured(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setArticles([]);
      setFeatured(null);
    }
    setLoading(false);
  }, [category, API_KEY]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">NewsNow</h1>
        <div className="space-x-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1 rounded hover:bg-gray-300 ${
                category === cat.value ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setCategory(null)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${
              category === null ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Featured News */}
      {loading && <p>Loading...</p>}

      {featured && !loading ? (
        <div className="mb-8">
          {featured.urlToImage ? (
            <img
              src={featured.urlToImage}
              alt={featured.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          ) : (
            <div className="bg-gray-300 rounded-xl w-full h-80 flex items-center justify-center text-gray-700">
              No Image
            </div>
          )}
          <h2 className="text-2xl font-semibold mt-4">{featured.title}</h2>
          <p className="text-gray-600">{featured.description || "No summary available."}</p>
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            Read full article
          </a>
        </div>
      ) : (
        !loading && <p>No featured article available.</p>
      )}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && articles.length > 0 ? (
          articles.map((article, index) => {
            if (article === featured) return null;

            return (
              <div
                key={index}
                className="border p-4 rounded shadow hover:shadow-md transition"
              >
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="rounded mb-3 h-40 w-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-300 rounded mb-3 h-40 w-full flex items-center justify-center text-gray-700 font-bold">
                    🖼️ No Image Available
                  </div>
                )}
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {article.description || "No description available."}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  Read more
                </a>
              </div>
            );
          })
        ) : (
          !loading && <p>No articles to display.</p>
        )}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button
          onClick={fetchNews}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load More
        </button>
      </div>
    </div>
  );
}

export default HomePage;
