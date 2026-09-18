# To-Do List App

A vanilla JavaScript to-do list that automatically sorts tasks into **Today**, **Future**, and **Completed** based on their deadline, and persists everything across browser sessions using `localStorage`.

**Live demo:** (https://aj1234-p.github.io/ToDo_List-/)

---

## Features

1. **Deadline-based auto-sorting**
   When a task is added, its deadline is compared against today's date:
   - Deadline = today → appears in the **Today** list
   - Deadline = a future date → appears in the **Future** list
   - Past dates are rejected outright (the app alerts the user and refuses to add the task)

2. **Mark as complete**
   Clicking the check-circle button on a task moves it into the **Completed** list, restyles it (white background, black text, trash icon dimmed to indicate it's now just a record), and removes the "select" button since a completed task has nothing left to select.

3. **Persistent storage**
   Every add, delete, and complete action is saved to `localStorage` under a single key, so the full task list survives page reloads and browser restarts. On load, the app reads this key and rebuilds the three lists from scratch.

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- `localStorage` for persistence
- Font Awesome (trash + check-circle icons)

---

## How It Works

### Adding a task
- User fills in work name, deadline, and priority, then clicks **Add**.
- The deadline is validated against today's date — dates in the past are rejected.
- A unique ID (`crypto.randomUUID()`) is generated for the task, and the task object is pushed into the in-memory list, saved to `localStorage`, and the UI is re-rendered.

### Sorting into Today / Future / Completed
- On every render, each task's `Deadline` is parsed and compared to the current date.
- `isCompleted` (0 or 1) takes priority over date-based sorting — a completed task always lands in the Completed list, regardless of its deadline.

### Deleting or completing a task
- Delete and complete buttons carry the task's unique ID in a `data-id` attribute.
- Clicks are handled via event delegation on a parent container (rather than attaching a listener to each task individually), since tasks are created and destroyed dynamically — this ensures buttons on newly-added tasks work without needing to re-attach listeners after every render.

### Persistence
- `setDataInLocal()` serializes the current task array with `JSON.stringify` and saves it under the key `TODO_KEY`.
- `loadFromStorage()` runs once on page load, parses whatever's saved, and repopulates the UI — so refreshing the page (or closing and reopening the browser) doesn't lose any tasks.

---

## Setup

1. Clone the repo
2. Open `index.html` directly, or serve it with a local server (e.g. VS Code Live Server)
3. No API keys or build steps required — this project runs entirely client-side

---

## Known Issues / Notes

- Delete/complete buttons rely on event delegation: a single click listener on each of the three static container divs (`.today-todo-list`, `.future-todo-list`, `.completed-todo-list`, all sharing the `.same-todo` class) catches clicks on dynamically-added task items inside them via bubbling. This works because the containers themselves exist in the static HTML before any JavaScript runs.
- Date parsing currently relies on slicing fixed string positions from `deadline`/`Deadline` values (assumes a consistent `YYYY-MM-DD` format from the date input) — worth validating input format explicitly if the date input type ever changes.

---

## Possible Future Improvements

- Edit an existing task instead of only add/delete
- Priority-based sorting or filtering within each list
- Confirmation prompt before deleting a task
- Visual indicator for overdue (past-deadline, not-yet-completed) tasks
