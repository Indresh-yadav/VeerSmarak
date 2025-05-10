import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../src/api";

const AdminPanel = () => {
  const { heroId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    story: "",
    category: "",
    birthDate: "",
    deathDate: "",
    image: null,
  });
  const [existingImage, setExistingImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadHero = async () => {
      if (heroId) {
        if (location.state?.hero) {
          const h = location.state.hero;
          setForm({
            name: h.name || "",
            story: h.story || "",
            category: h.category || "",
            birthDate: h.birthDate?.substring(0, 10) || "",
            deathDate: h.deathDate?.substring(0, 10) || "",
            image: null,
          });
          setExistingImage(h.image || null);
        } else {
          try {
            const res = await API.get(`/hero/heroes/${heroId}`);
            const { name, story, category, birthDate, deathDate, image } = res.data;
            setForm({
              name,
              story,
              category,
              birthDate: birthDate?.substring(0, 10),
              deathDate: deathDate?.substring(0, 10),
              image: null,
            });
            setExistingImage(image);
          } catch (err) {
            console.error("Failed to fetch hero", err);
            alert("Error loading hero data");
          }
        }
      }
    };

    loadHero();
  }, [heroId, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (heroId) {
        await API.put(`/hero/heroes/${heroId}`, {
          name: form.name,
          story: form.story,
          category: form.category,
          birthDate: form.birthDate,
          deathDate: form.deathDate,
        });

        if (form.image) {
          const formData = new FormData();
          formData.append("image", form.image);

          setUploading(true);
          await API.post(`/upload/${heroId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setUploading(false);
        }

        alert("Hero updated successfully!");
      } else {
        const res = await API.post("hero/heroes", {
          name: form.name,
          story: form.story,
          category: form.category,
          birthDate: form.birthDate,
          deathDate: form.deathDate,
        });

        const newHeroId = res.data._id;

        if (form.image) {
          const formData = new FormData();
          formData.append("image", form.image);

          setUploading(true);
          await API.post(`/upload/${newHeroId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setUploading(false);
        }

        alert("Hero added successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving hero.");
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const isValidSize = img.width === 400 && img.height === 200;
      URL.revokeObjectURL(objectUrl);

      if (isValidSize) {
        setForm({ ...form, image: file });
        setExistingImage(null);
      } else {
        alert("Image must be exactly 400x200 pixels.");
        fileInputRef.current.value = "";
      }
    };

    img.onerror = () => {
      alert("Invalid image file.");
      fileInputRef.current.value = "";
    };

    img.src = objectUrl;
  };

  const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this hero?");
  if (!confirmed) return;

  try {
    await API.delete(`/hero/heroes/${heroId}`);
    alert("Hero deleted successfully!");
    navigate("/dashboard");
  } catch (err) {
    console.error("Failed to delete hero", err);
    alert("Error deleting hero.");
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        {heroId ? "Edit Hero" : "Add a New Hero"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md text-green-600"
          required
        />
        <textarea
          placeholder="Story"
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          className="w-full px-4 py-2 border rounded-md h-32 resize-none text-orange-600"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-md text-blue-600"
          required
        >
          <option value="">Select Category</option>
          <option value="Soldier">Soldier</option>
          <option value="Freedom Fighter">Freedom Fighter</option>
        </select>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          className="w-full px-4 py-2 border rounded-md text-green-600"
          required
        />
        <input
          type="date"
          value={form.deathDate}
          onChange={(e) => setForm({ ...form, deathDate: e.target.value })}
          className="w-full px-4 py-2 border rounded-md text-green-600"
        />

        <div className="flex items-center space-x-3">
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-md border hover:bg-gray-200"
          >
            {form.image ? "Change Image" : "Upload Image"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />

          {(form.image || existingImage) && (
            <div className="relative group">
              <span className="text-sm text-gray-800 cursor-pointer group-hover:underline">
                {form.image?.name || "Current Image"}
              </span>
              <div className="absolute z-10 left-full ml-3 top-1/2 -translate-y-1/2 w-40 h-40 border bg-white shadow-lg rounded-md hidden group-hover:block">
                <img
                  src={form.image ? URL.createObjectURL(form.image) : existingImage}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {uploading && (
          <p className="text-blue-500 text-sm mt-2">Uploading image...</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mt-4">
  <button
    type="submit"
    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
  >
    {heroId ? "Update" : "Submit"}
  </button>

  {heroId && (
    <button
      type="button"
      onClick={handleDelete}
      className="w-full sm:w-auto bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
    >
      Delete Hero
    </button>
  )}
</div>

      </form>
    </div>
  );
};

export default AdminPanel;
