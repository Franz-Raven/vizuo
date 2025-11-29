"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import BackgroundBlobs from "@/components/background-blobs";
import {
    getMoodboards,
    createMoodboard,
    assignSavedImagesToMoodboard
} from "@/lib/api/moodboard";
import { getSavedImages } from "@/lib/api/save-image";
import { Moodboard, MoodboardCreatePayload } from "@/types/moodboard";
import { SavedImage } from "@/types/save-image";
import MoodboardCard from "@/components/moodboard/moodboard-card";
import SavedImageCard from "@/components/moodboard/saved-image-card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import OrganizeModal from "@/components/moodboard/organize-modal";
import CreateMoodboardModal from "@/components/moodboard/create-moodboard-modal";

export default function MoodboardPage() {
    const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
    const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOrganizeOpen, setIsOrganizeOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [boards, saved] = await Promise.all([
                    getMoodboards(),
                    getSavedImages()
                ]);

                setMoodboards(boards);
                setSavedImages(saved);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleCreateMoodboard = async (payload: MoodboardCreatePayload) => {
        if (creating) return;
        setCreating(true);

        try {
            const newBoard = await createMoodboard(payload);
            setMoodboards((prev) => [newBoard, ...prev]);
            setIsCreateOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleAssignToBoard = async (
        moodboardId: number,
        savedImageIds: number[]
    ) => {
        if (!savedImageIds.length) return;

        try {
            const updatedBoard = await assignSavedImagesToMoodboard(
                moodboardId,
                savedImageIds
            );

            setMoodboards((prev) =>
                prev.map((board) => (board.id === updatedBoard.id ? updatedBoard : board))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateBoardWithImages = async (savedImageIds: number[]) => {
        if (!savedImageIds.length) return;

        try {
            const newBoard = await createMoodboard({
                name: "New moodboard",
                isPrivate: false
            });

            const updatedBoard = await assignSavedImagesToMoodboard(
                newBoard.id,
                savedImageIds
            );

            setMoodboards((prev) => [updatedBoard, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <BackgroundBlobs />
            <Header />

            <main className="relative z-10 pt-20 pb-24 max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold tracking-tight">Creations</h1>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/40 hover:bg-primary/90 transition"
                    >
                        Create
                    </button>
                </div>

                <div className="w-full border-t border-foreground/70" />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        {moodboards.length === 0 ? (
                            <p className="text-muted-foreground mt-5 mb-10">No moodboards</p>
                        ) : (
                            <div className="flex gap-8 overflow-x-auto py-4 my-10">
                                {moodboards.map((board) => {
                                    const thumbnails = savedImages
                                        .filter(
                                            (img) =>
                                                board.savedImageIds.includes(img.id) &&
                                                img.thumbnailUrl &&
                                                img.thumbnailUrl.length > 0
                                        )
                                        .slice(0, 3)
                                        .map((img) => img.thumbnailUrl);

                                    return (
                                        <div key={board.id} className="min-w-[220px] max-w-xs">
                                            <MoodboardCard board={board} thumbnails={thumbnails} />
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                        <div className="w-full border-t border-foreground/70 mb-10" />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Saved Assets</h2>
                            <button
                                className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium hover:border-primary transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setIsOrganizeOpen(true)}
                                disabled={savedImages.length === 0}
                            >
                                Organize
                            </button>
                        </div>

                        {savedImages.length === 0 ? (
                            <p className="text-muted-foreground">No saved Assets</p>
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
                                    {savedImages.map((img) => (
                                        <SavedImageCard key={img.id} img={img} />
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>
                        )}
                    </>
                )}
            </main>

            <OrganizeModal
                open={isOrganizeOpen}
                onClose={() => setIsOrganizeOpen(false)}
                savedImages={savedImages}
                moodboards={moodboards}
                onAssignToBoard={handleAssignToBoard}
                onCreateBoardWithImages={handleCreateBoardWithImages}
            />

            <CreateMoodboardModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateMoodboard}
            />
        </div>
    );
}
