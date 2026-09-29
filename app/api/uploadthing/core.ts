import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// Verifica la sesión admin real (token HMAC firmado), igual que
			// el resto del panel — no un valor literal.
			const session = cookies().get(ADMIN_SESSION_COOKIE);
			if (!(await verifySessionToken(session?.value))) {
				throw new Error("Unauthorized");
			}

			// Lo que se retorne aquí queda disponible en onUploadComplete como `metadata`
			return { uploadedBy: "admin" };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// Este código corre en el servidor después de subir el archivo
			console.log("Upload complete for userId:", metadata.uploadedBy);
			console.log("file url", file.url);

			return { url: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
