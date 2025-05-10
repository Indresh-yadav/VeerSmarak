import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../src/api";
import useAuth from "../src/useAuth";
import { MessageCircle, Heart, Bookmark, Edit3 } from "lucide-react";

const HeroCard = ({ hero }) => {
  const defaultImage = import.meta.env.VITE_DEFAULT_IMAGE_URL;
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [likes, setLikes] = useState(hero.likes || 0);
  const [isLiked, setIsLiked] = useState(hero.isLiked || false);
  const [isSaved, setIsSaved] = useState(hero.isSaved || false);

  const handleLike = async () => {
    try {
      const res = await API.post(`/hero/heroes/${hero._id}/like`);
      if (res.data?.likes !== undefined && res.data?.isLiked !== undefined) {
        setLikes(res.data.likes);
        setIsLiked(res.data.isLiked);
      } else {
        setLikes(prev => (isLiked ? prev - 1 : prev + 1));
        setIsLiked(prev => !prev);
      }
    } catch (err) {
      console.error("Error liking hero", err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.post(`/hero/heroes/${hero._id}/save`);
      if (res.data?.isSaved !== undefined) {
        setIsSaved(res.data.isSaved);
      } else {
        setIsSaved(prev => !prev);
      }
    } catch (err) {
      console.error("Error saving hero", err);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/${hero._id}`, { state: { hero } });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-amber-600 transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500 w-full max-w-md mx-auto">
      <div className="w-full aspect-[2/1] overflow-hidden rounded-lg">
        <img
          src={hero.image || defaultImage}
          alt={hero.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="mt-3 sm:mt-4 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-bold text-orange-400">{hero.name}</h2>
        <p className="text-sm sm:text-base text-green-600">{hero.category}</p>

        <div className="flex justify-center sm:justify-between items-center gap-6 mt-2 sm:mt-3 text-sm sm:text-base">
          <Link to={`/hero/${hero._id}`} state={{ hero }}
             className="text-blue-500 hover:underline text-sm sm:text-base text-center mt-2 sm:mt-0"> View More
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between items-center mt-4">
  <div className="flex w-full justify-between items-center">
    <div className="flex gap-4">
      <button onClick={handleSave} title={isSaved ? "Unsave" : "Save"}>
        <Bookmark
          className="w-6 h-6 text-blue-600 hover:scale-110 transition-transform duration-100"
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>

      <button onClick={handleLike} title={isLiked ? "Unlike" : "Like"}>
        <Heart
          className="w-6 h-6 text-red-500 hover:scale-110 transition-transform duration-100"
          fill={isLiked ? "currentColor" : "none"}
        /> 
      </button>
      <span>{likes}</span>
    </div>

    <div className="flex items-center gap-2 ml-auto">
      {isAdmin && (
        <button onClick={handleEdit} title="Edit">
          <Edit3 className="w-6 h-6 text-yellow-500 hover:scale-110 transition-transform duration-200" />
        </button>
      )}
      <MessageCircle className="w-5 h-5 text-blue-500" />
      <span>{hero.comments?.length || 0}</span>
    </div>
  </div>
</div>

  </div>
  );
};

export default HeroCard;
