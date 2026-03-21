import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImages, FaEdit, FaBan, FaCheck, FaTimes } from "react-icons/fa";
import { PROGRAMS } from "../../constants";

const GalleryManager = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    projectId: "",
    eventDate: "",
  });

  useEffect(() => {
    fetchGallery();
  }, [galleryFilter]);

  const fetchGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const url = galleryFilter
        ? `${import.meta.env.VITE_API_URL}/gallery?projectId=${galleryFilter}`
        : `${import.meta.env.VITE_API_URL}/gallery`;
      const response = await axios.get(url);
      setGalleryImages(response.data);
    } catch (err) {
      toast.error("Failed to fetch gallery");
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Image deleted successfully");
      fetchGallery();
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const openEditModal = (img) => {
    setImageToEdit(img);
    setEditFormData({
      projectId: img.projectId || "",
      eventDate: img.eventDate ? new Date(img.eventDate).toISOString().split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/gallery/${imageToEdit._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Image details updated");
      setShowEditModal(false);
      fetchGallery();
    } catch (err) {
      toast.error("Failed to update image");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-border p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
          <FaImages /> Gallery
        </h2>
        <select
          value={galleryFilter}
          onChange={(e) => setGalleryFilter(e.target.value)}
          className="px-6 py-3 border border-border bg-bg/30 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
        >
          <option value="">All Projects</option>
          {PROGRAMS.map((program) => (
            <option key={program.id} value={program.id}>
              {program.id.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </option>
          ))}
          <option value="general">General Events</option>
        </select>
      </div>

      {isLoadingGallery ? (
        <div className="py-24 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-body/60 font-medium italic">Loading gallery...</p>
        </div>
      ) : galleryImages.filter(img => img.projectId !== 'volunteer').length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages
            .filter(img => img.projectId !== 'volunteer')
            .map((img) => (
            <div
              key={img._id}
              className="group relative aspect-video rounded-2xl overflow-hidden border border-border bg-bg shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={img.imageUrl}
                alt="Gallery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4 transition-opacity">
                <div className="flex justify-between items-start">
                  <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {img.projectId?.replace(/_/g, " ")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(img)}
                      className="bg-white text-primary p-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all"
                      title="Edit"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img._id)}
                      className="bg-white text-blood p-2 rounded-lg shadow-lg hover:bg-blood hover:text-white transition-all"
                      title="Delete"
                    >
                      <FaBan size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-xs p-1.5 rounded-lg w-fit">
                  {img.eventDate ? new Date(img.eventDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : 'No date'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <FaImages size={64} className="mx-auto text-primary/10 mb-6" />
          <h3 className="text-2xl font-bold text-text-body mb-2">No images found</h3>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-primary mb-6">Edit Image Info</h3>
            <form onSubmit={handleUpdateImage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-body/40">Project</label>
                <select
                  value={editFormData.projectId}
                  onChange={(e) => setEditFormData({ ...editFormData, projectId: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary"
                  required
                >
                  <option value="">Select Project</option>
                  {PROGRAMS.map((p) => <option key={p.id} value={p.id}>{p.id.replace(/_/g, " ")}</option>)}
                  <option value="general">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-body/40">Event Date</label>
                <input
                  type="date"
                  value={editFormData.eventDate}
                  onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-border rounded-xl font-bold hover:bg-bg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
