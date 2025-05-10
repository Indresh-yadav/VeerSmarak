import { useEffect, useState, useCallback } from "react";
import API from "../src/api";
import HeroCard from "../components/HeroCard";

const Dashboard = () => {
  const [allHeroes, setAllHeroes] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
      setShowDropdown(search.trim() !== ""); 
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAllHeroes = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const res = await API.get(`/hero?page=${pageNum}&limit=10`);
      if (!res.data?.heroes) throw new Error("Invalid API response structure");

      setAllHeroes(prev => {
        const ids = new Set(prev.map(hero => hero._id));
        const newHeroes = res.data.heroes.filter(hero => !ids.has(hero._id));
        return [...prev, ...newHeroes];
      });

      setHasMore(res.data.heroes.length > 0);
    } catch (err) {
      setError(err.message || "Error fetching heroes");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearchResults = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      const res = await API.get(`/hero/heroes?search=${searchTerm}`);
      if (!res.data?.hero) throw new Error("Invalid API response structure");

      const heroesArray = Array.isArray(res.data.hero) ? res.data.hero : [res.data.hero];
      setSearchResults(heroesArray);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setSearchResults([]);
      } else {
        setError(err.message || "Error fetching search results");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      fetchAllHeroes(page);
      setSearchResults(null);
    } else {
      fetchSearchResults(debouncedSearch);
    }
  }, [page, debouncedSearch, fetchAllHeroes, fetchSearchResults]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.1;

    if (isNearBottom && hasMore && !loading && debouncedSearch === "") {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading, debouncedSearch]);

  const sortedAllHeroes = [...allHeroes].sort((a, b) => {
    const likesDifference = (b.likes || 0) - (a.likes || 0);
    
    if (likesDifference === 0) {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
  
    return likesDifference;
  });
  

  const handleSearchItemClick = (hero) => {
    setSearch(hero.name);
    setDebouncedSearch(hero.name);
    setSearchResults([hero]);
    setShowDropdown(false); 
    setHighlightedIndex(-1);
  };

  const clearSearch = async () => {
    setSearch("");
    setDebouncedSearch("");
    setSearchResults(null);
    setPage(1);
    setShowDropdown(false);
    const response = await fetchAllHeroes(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-md relative">
        <div className="relative">
    <div className="p-[2px] rounded bg-gradient-to-r from-orange-400 via-blue-500 to-green-500">
      <input
        type="text"
        placeholder="Search Heroes..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setHighlightedIndex(-1);
          if (e.target.value.trim() === "") {
            setAllHeroes([]);
            setSearchResults(null);
            setPage(1);
            setShowDropdown(false);
          }
        }}
        onKeyDown={(e) => {
          if (searchResults && searchResults.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) => (prev + 1) % searchResults.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
            } else if (e.key === "Enter" && highlightedIndex >= 0) {
              e.preventDefault();
              handleSearchItemClick(searchResults[highlightedIndex]);
            } else if (e.key === "Escape") {
              setShowDropdown(false);
            }
          }
        }}
        onFocus={() => {
          if (search.trim() !== "" && searchResults?.length > 0) {
            setShowDropdown(true);
          }
        }}
        onBlur={() => { setTimeout(() => setShowDropdown(false), 200); }}
        className="w-full p-3 rounded focus:outline-none pr-10 bg-white"
      />
    </div>

    {search && (
      <button
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    )}
  </div>


        {showDropdown && searchResults && searchResults.length > 0 && (
          <div className="absolute mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-y-auto z-40">
            {searchResults.map((hero, index) => (
              <div
                key={hero._id}
                className={`px-4 py-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSearchItemClick(hero)}
              >
                {hero.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto p-6"
        onScroll={handleScroll}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {debouncedSearch.trim() === "" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sortedAllHeroes.map((hero) => (
              <HeroCard key={hero._id} hero={hero}/>
            ))}
            {loading && <p className="col-span-full text-center py-4">Loading more heroes...</p>}
            {!hasMore && allHeroes.length > 0 && <p className="text-center col-span-full py-4">No more heroes to load</p>}
            {!loading && allHeroes.length === 0 && <p className="col-span-full text-center py-4">No heroes found</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading && <p className="col-span-full text-center py-4">Searching heroes...</p>}
            {!loading && searchResults?.length === 0 && (
              <p className="col-span-full text-center py-4">No heroes found matching "{debouncedSearch}"</p>
            )}
            {searchResults && searchResults.map((hero) => (
              <HeroCard key={hero._id} hero={hero} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;