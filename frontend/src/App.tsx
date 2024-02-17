import { useEffect, useState } from "react";
import "./App.css";
import { MdDeleteForever } from "react-icons/md";

type Note = {
	id: number;
	title: string;
	content: string;
};

function App() {
	const baseUrl = "http://localhost:5000/api/notes";

	const [notes, setNotes] = useState<Note[]>([]);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await fetch(baseUrl);

				if (!response.ok) {
					throw new Error("Failed to fetch notes");
				}

				const notes: Note[] = await response.json();
				setNotes(notes);
			} catch (error) {
				console.log(error);
			}
		};

		fetchNotes();
	}, []);

	// *** HANDLE NOTE CLICK
	const handleNoteClick = (note: Note) => {
		setSelectedNote(note);
		setTitle(note.title);
		setContent(note.content);
	};

	// *** ADD NOTE
	const handleAddNote = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, content }),
			});

			const newNote = await response.json();

			setNotes([newNote, ...notes]);
			setTitle("");
			setContent("");
		} catch (error) {
			console.log(error);
		}
	};

	// *** UPDATE NOTE
	const handleUpdateNote = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedNote) {
			return;
		}

		try {
			const response = await fetch(`${baseUrl}/${selectedNote.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, content }),
			});

			const updatedNote = await response.json();

			const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));

			setNotes(updatedNotesList);
			setTitle("");
			setContent("");
			setSelectedNote(null);
		} catch (error) {
			console.log(error);
		}
	};

	// *** CANCEL EDIT
	const handleCancel = () => {
		setTitle("");
		setContent("");
		setSelectedNote(null);
	};

	// *** DELETE NOTE
	const handleDeleteNote = async (e: React.FormEvent, id: number) => {
		e.stopPropagation();

		try {
			await fetch(`${baseUrl}/${id}`, {
				method: "DELETE",
			});

			const updatedNotes = notes.filter((note) => note.id !== id);

			setNotes(updatedNotes);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="app-container">
			<form
				className="note-form"
				onSubmit={(e) => (selectedNote ? handleUpdateNote(e) : handleAddNote(e))}>
				<input
					type="text"
					placeholder="Title"
					required
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					rows={10}
					placeholder="Content"
					required
					value={content}
					onChange={(e) => setContent(e.target.value)}></textarea>

				{selectedNote ? (
					<div className="edit-buttons">
						<button type="submit">Save</button>
						<button onClick={handleCancel}>Cancel</button>
					</div>
				) : (
					<button type="submit">Add Note</button>
				)}
			</form>

			<div className="notes-grid">
				{notes.map((note) => (
					<div
						onClick={() => handleNoteClick(note)}
						className="notes-item"
						key={note.id}>
						<div className="notes-header">
							<button
								className="delete"
								onClick={(e) => handleDeleteNote(e, note.id)}>
								<MdDeleteForever />
							</button>
						</div>
						<h2 className="note-title">{note.title}</h2>
						<p>{note.content}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
