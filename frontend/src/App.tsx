import { useState } from "react";
import "./App.css";
import { MdDeleteForever } from "react-icons/md";

type Note = {
	id: number;
	title: string;
	content: string;
};

function App() {
	const [notes, setNotes] = useState<Note[]>([]);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	// *** HANDLE NOTE CLICK
	const handleNoteClick = (note: Note) => {
		setSelectedNote(note);
		setTitle(note.title);
		setContent(note.content);
	};

	// *** ADD NOTE
	const handleAddNote = (e: React.FormEvent) => {
		e.preventDefault();

		const newNote: Note = {
			id: notes.length + 1,
			title: title,
			content: content,
		};

		console.log(newNote);

		setNotes([newNote, ...notes]);
		setTitle("");
		setContent("");
	};

	// *** UPDATE NOTE
	const handleUpdateNote = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedNote) {
			return;
		}

		const updatedNote: Note = {
			id: selectedNote.id,
			title: title,
			content: content,
		};

		const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));

		setNotes(updatedNotesList);
		setTitle("");
		setContent("");
		setSelectedNote(null);
	};

	// *** CANCEL EDIT
	const handleCancel = () => {
		setTitle("");
		setContent("");
		setSelectedNote(null);
	};

	// *** DELETE NOTE
	const handleDeleteNote = (e: React.FormEvent, noteId: number) => {
		e.stopPropagation();

		const updatedNotes = notes.filter((note) => note.id !== noteId);

		setNotes(updatedNotes);
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
