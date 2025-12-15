"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header";
import BackgroundBlobs from "@/components/background-blobs";
import { getMoodboardById, updateMoodboard, deleteMoodboard, reorderMoodboardImages, removeSavedImageFromMoodboard } from "@/lib/api/moodboard";
import { getSavedImagesByIds } from "@/lib/api/save-image";
import { Moodboard } from "@/types/moodboard";
import { SavedImage } from "@/types/save-image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ArrowLeft, Edit, Trash2, GripVertical } from "lucide-react";
import EditMoodboardModal from "@/components/moodboard/edit-moodboard-modal";
import DeleteConfirmModal from "@/components/moodboard/delete-confirm-modal";
import SavedImageCard from "@/components/moodboard/saved-image-card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "@/context/auth-context"

function SortableImageItem({ img, onRemove, organizeMode }: { img: SavedImage; onRemove: (id: number) => void; organizeMode: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className={`aspect-square rounded-xl overflow-hidden border-2 bg-card transition-all cursor-grab active:cursor-grabbing ${
          isDragging
            ? "border-primary shadow-2xl scale-105 rotate-2"
            : "border-border"
        }`}
      >
        <img
          src={img.thumbnailUrl}
          alt={img.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Drag Handle Indicator */}
      {!isDragging && organizeMode && (
        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Delete Button - Always visible in organize mode */}
      {organizeMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(img.id);
          }}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function MoodboardViewPage() {
  const router = useRouter();
  const params = useParams();
  const moodboardId = Number(params.id);

  const [moodboard, setMoodboard] = useState<Moodboard | null>(null);
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [organizeMode, setOrganizeMode] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadMoodboard();
  }, [moodboardId]);

  const loadMoodboard = async () => {
    setLoading(true);
    try {
      const data = await getMoodboardById(moodboardId);
      setMoodboard(data);
      
      // Check if current user is the owner
      const currentUserId = user?.id;
      console.log("Current userId:", currentUserId, "Moodboard userId:", data.userId);
      setIsOwner(data.userId === currentUserId);

      // Load images
      if (data.savedImageIds.length > 0) {
        const imageData = await getSavedImagesByIds(data.savedImageIds);
        // Sort images based on the order in savedImageIds
        const sortedImages = data.savedImageIds
          .map(id => imageData.find(img => img.id === id))
          .filter(img => img !== undefined) as SavedImage[];
        setImages(sortedImages);
      }
    } catch (err) {
      console.error(err);
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (name: string, description: string) => {
    if (!moodboard) return;
    try {
      const updated = await updateMoodboard(moodboard.id, { name, description });
      setMoodboard(updated);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!moodboard) return;
    try {
      await deleteMoodboard(moodboard.id);
      router.push("/moodboard");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = async (savedImageId: number) => {
    if (!moodboard) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to remove this image from the moodboard?");
    if (!confirmed) return;

    try {
      // Call API to remove the saved image from the moodboard
      const updatedMoodboard = await removeSavedImageFromMoodboard(moodboard.id, savedImageId);
      
      // Update local state
      setImages(prev => prev.filter(img => img.id !== savedImageId));
      setMoodboard(updatedMoodboard);
    } catch (err) {
      console.error("Error removing image:", err);
      alert("Failed to remove image from moodboard");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !moodboard || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex);
    setImages(newImages);

    // Auto-save the new order
    try {
      const newOrder = newImages.map(img => img.id);
      await reorderMoodboardImages(moodboard.id, newOrder);
    } catch (err) {
      console.error("Error saving order:", err);
      // Revert on error
      loadMoodboard();
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <BackgroundBlobs />
        <Header />
        <main className="relative z-10 pt-20 pb-24 flex justify-center items-center min-h-screen">
          <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </main>
      </div>
    );
  }

  if (!moodboard) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      <main className="relative z-10 pt-20 pb-24 max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {moodboard.name}
              </h1>
              <p className="text-muted-foreground">
                by {moodboard.username || "Unknown"}
              </p>
              {moodboard.description && (
                <p className="text-foreground/80 mt-3 max-w-3xl">
                  {moodboard.description}
                </p>
              )}
            </div>

            {/* Action Buttons (Only for Owner) */}
            {isOwner && (
              <div className="flex items-center gap-2">
                {organizeMode ? (
                  <button
                    onClick={() => setOrganizeMode(false)}
                    className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/40 hover:bg-primary/90 transition"
                  >
                    Done
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setOrganizeMode(true)}
                      className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium hover:border-primary transition shadow-sm"
                    >
                      Organize
                    </button>
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="p-2 rounded-full bg-card border border-border hover:border-primary transition shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsDeleteOpen(true)}
                      className="p-2 rounded-full bg-card border border-border hover:border-red-500 hover:text-red-500 transition shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="w-full border-t border-foreground/70" />
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images in this moodboard</p>
          </div>
        ) : (
          <>
            {/* Organize Mode Banner */}
            {organizeMode && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Organize Mode Active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag to reorder • Click trash icon to remove images
                    </p>
                  </div>
                </div>
              </div>
            )}

            {organizeMode ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {images.map((img) => (
                      <SortableImageItem
                        key={img.id}
                        img={img}
                        onRemove={handleRemoveImage}
                        organizeMode={organizeMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  0: 2,
                  768: 3,
                  1024: 4,
                  1280: 5
                }}
              >
                <Masonry gutter="24px">
                  {images.map((img) => (
                    <SavedImageCard key={img.id} img={img} />
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {isOwner && (
        <EditMoodboardModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          moodboard={moodboard}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isOwner && (
        <DeleteConfirmModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          moodboardName={moodboard.name}
        />
      )}
    </div>
  );
}
