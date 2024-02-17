import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// *** GET ALL NOTES
app.get("/api/notes", async (req, res) => {
	const notes = await prisma.note.findMany();

	res.status(200).json(notes);
});

// *** CREATE NOTE
app.post("/api/notes", async (req, res) => {
	const { title, content } = req.body;

	if (!title || !content) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		const note = await prisma.note.create({
			data: { title, content },
		});

		res.status(201).json(note);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
});

// *** UPDATE NOTE
app.put("/api/notes/:id", async (req, res) => {
	const { title, content } = req.body;
	const id = parseInt(req.params.id);

	if (!title || !content) {
		return res.status(400).json({ message: "All fields are required" });
	}

	if (!id || isNaN(id)) {
		return res.status(400).json({ message: "ID must be a valid number" });
	}

	try {
		const updatedNote = await prisma.note.update({
			where: { id },
			data: { title, content },
		});

		res.status(201).json(updatedNote);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
});

// *** DELETE NOTE
app.delete("/api/notes/:id", async (req, res) => {
	const id = parseInt(req.params.id);

	if (!id || isNaN(id)) {
		return res.status(400).json({ message: "ID must be a valid number" });
	}

	try {
		await prisma.note.delete({
			where: { id },
		});

		res.status(200).json({ message: "Deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
