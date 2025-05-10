import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import API from "../src/api";
import CommentSection from "./CommentSection";
import { Heart, MessageCircle } from "lucide-react";

const HeroDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialHero = location.state?.hero;

  const [hero, setHero] = useState(initialHero || null);
  const [comments, setComments] = useState(initialHero?.comments || []);
  const [commentCount, setCommentCount] = useState(initialHero?.comments?.length || 0);
  const [isLiked, setIsLiked] = useState(initialHero?.isLiked || false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await API.get(`/hero/heroes/${id}`);
      const fullHero = res.data.hero;

      setHero((prevHero) => ({
        ...fullHero,
        // If initialHero said the user liked this hero, keep it true
        isLiked: initialHero?.isLiked ?? fullHero.isLiked ?? false,
      }));

      setComments(fullHero.comments);
      setCommentCount(fullHero.comments.length);
      setIsLiked(initialHero?.isLiked ?? fullHero.isLiked ?? false);
    } catch (err) {
      console.error("Error fetching hero details:", err);
    }
  };

  fetchHero();
}, [id, initialHero]);



  const handleLike = async () => {
    try {
      const res = await API.post(`/hero/heroes/${id}/like`);
      if (res.data?.likes !== undefined && res.data?.isLiked !== undefined) {
        setHero((prev) => ({ ...prev, likes: res.data.likes }));
        setIsLiked(res.data.isLiked);
      } else {
        setHero((prev) => ({
          ...prev,
          likes: isLiked ? prev.likes - 1 : prev.likes + 1,
        }));
        setIsLiked((prev) => !prev);
      }
    } catch (err) {
      console.error("Error liking hero", err);
    }
  };

  if (!hero) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img
            src={hero.image || "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"}
            alt={hero.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold text-orange-600">{hero.name}</h1>
            <p className="text-green-700 font-medium mt-2 text-3xl">{hero.category}</p>
            <div className="mt-4 text-xl text-gray-500 space-y-1">
              <p><strong>Born:</strong> {hero.birthDate}</p>
              <p><strong>Died:</strong> {hero.deathDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">About</h2>
        <p className="text-gray-700 leading-7 whitespace-pre-line">{hero.story}</p>
      </div>

      <div className="mt-6 flex justify-start gap-6 text-gray-700 text-lg items-center">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-red-500 hover:underline"
        >
          <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
          <span>{hero.likes}</span>
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{commentCount} </span>
        </button>
      </div>

      {showComments && (
        <div className="mt-8">
          <CommentSection
            heroId={id}
            comments={comments}
            setComments={setComments}
            setCommentCount={setCommentCount}
          />
        </div>
      )}
    </div>
  );
};

export default HeroDetail;
