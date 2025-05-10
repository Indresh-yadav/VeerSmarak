import { useEffect, useState } from "react";
import API from "../src/api";
import useAuth from "../src/useAuth";
import HeroCard from "../components/HeroCard";

const Profile = ({ type }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchPosts = async () => {
      try {
        const res = await API.get(`/users/${type}/${user._id}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user?._id, type]);

  if (!user) return <div className="text-center p-10 text-blue-600">Login to view profile</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-green-600">Hello {user.name}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2 capitalize text-orange-600">{type} Posts</h2>
        {posts.length === 0 ? (
          <p className="text-blue-600">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((hero) => (
              <HeroCard key={hero._id} hero={hero} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
