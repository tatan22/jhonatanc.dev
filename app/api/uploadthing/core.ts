import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Check if user is authenticated (using the same logic as our admin dashboard)
      const session = cookies().get('admin_session');
      if (session?.value !== 'authenticated') {
        throw new Error("Unauthorized");
      }
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.uploadedBy);
      console.log("file url", file.url);
      
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
