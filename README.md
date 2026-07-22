# 📚 Edumate - Task Management System

A modern, interactive task management website designed for students juggling homework, assignments, and deadlines. Built with pure HTML, CSS, and JavaScript—no frameworks needed!

## ✨ Features

### 📋 Core Functionality
- **Add Tasks**: Enter tasks with title, due date, reminder time, and priority level
- **Voice Input**: Dictate tasks using your microphone (Speech Recognition API)
- **Task Status Tracking**: Track tasks as Pending → In Progress → Completed
- **Priority Levels**: Low, Medium, and High priority indicators
- **Task Filtering**: View all tasks or filter by status (Pending, In Progress, Completed)
- **Task Statistics**: Real-time dashboard showing task counts by status

### 🌙 User Experience
- **Dark Mode**: Toggle between light and dark themes (preference saved)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean UI**: Simple, intuitive interface designed for students
- **Smooth Animations**: Delightful interactions and transitions
- **Local Storage**: All tasks are automatically saved to your device

### 🔔 Reminders & Alerts
- **Scheduled Reminders**: Set custom reminder times for each task
- **Browser Notifications**: Get notified when reminders are due
- **Audio Alerts**: Sound notification when reminder triggers
- **Visual Notifications**: In-app toast notifications for all actions

## 🚀 Getting Started

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation needed—runs entirely in your browser!

### How to Use

1. **Open the Website**: Open `index.html` in your web browser

2. **Add a Task**:
   - Type your homework/task in the text field
   - Select a due date
   - Set a reminder time (optional, defaults to 9:00 AM)
   - Choose priority level
   - Click "+ Add Task"

3. **Use Voice Input**:
   - Click "🎤 Voice" button
   - Speak your task clearly
   - Your speech will be transcribed automatically
   - Complete the form and add the task

4. **Track Progress**:
   - Click "⏳ Start Task" to mark as in-progress
   - Click "✅ Complete Task" to mark as completed
   - Click "↩️ Reopen Task" to move back to pending

5. **Filter Tasks**:
   - Use filter buttons to view specific task categories
   - Dashboard updates in real-time

6. **Dark Mode**:
   - Click the moon/sun icon in the header
   - Your preference is automatically saved

## 📁 Project Structure

```
Educmate-2.0/
├── index.html          # HTML structure
├── styles.css          # All styling and theming
├── script.js           # All functionality and logic
└── README.md           # Documentation (this file)
```

## 🎨 Customization

### Change Color Scheme
Edit the CSS variables at the top of `styles.css`:

```css
:root {
    --accent-color: #4a90e2;        /* Main brand color */
    --success-color: #2ecc71;       /* Completed tasks */
    --warning-color: #f39c12;       /* Warnings */
    --danger-color: #e74c3c;        /* Delete/errors */
    /* ... more colors ... */
}
```

### Modify Priority Levels
Edit the priority options in `index.html` line ~60.

### Adjust Reminder Check Interval
In `script.js`, change the interval in `setupReminders()` (currently checks every 60,000 ms = 1 minute).

## 💾 Data Storage

All tasks are stored in your browser's localStorage:
- **Storage Key**: `edumate_tasks` and `edumate_theme`
- **Persistence**: Data remains even after closing the browser
- **Privacy**: All data stays on your device—nothing sent to servers

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Functions | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ❌* | ❌* | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ | ✅ |

*Voice input requires using Chrome or Edge. Firefox/Safari users can still type tasks manually.

## 🔧 Technical Details

### APIs Used
- **Web Storage API**: For persistent task storage
- **Web Speech API**: For voice input recognition
- **Notifications API**: For browser notifications
- **Web Audio API**: For audio reminders
- **Local Storage**: For theme preferences

### No Dependencies
- ✅ Pure HTML5
- ✅ Vanilla CSS3
- ✅ Vanilla JavaScript (ES6)
- ✅ No frameworks or libraries needed
- ✅ No build process required

## 📝 Tips for Students

1. **Set Realistic Due Dates**: Plan ahead for assignments
2. **Use Priority Levels**: Identify urgent tasks at a glance
3. **Check Reminders**: Set notification times before your study sessions
4. **Regular Updates**: Mark tasks as in-progress when you start working
5. **Review Completed**: Celebrate your achievements!

## 🐛 Known Limitations

- Voice input only works in Chrome/Edge browsers
- Reminders check every 1 minute (not real-time)
- No sync across devices (each device has separate tasks)
- Maximum characters: Limited by browser storage (~5MB)

## 🚀 Future Enhancements

Potential features for future versions:
- Cloud sync across devices
- Task categories/subjects
- Recurring tasks
- Study timer (Pomodoro)
- Task notes and attachments
- Export to PDF/Calendar
- Sharing tasks with classmates

## 📄 License

Free to use and modify for educational purposes.

## 👨‍💻 Built For

Students like you who want to:
- ✅ Stay organized
- ✅ Never miss deadlines
- ✅ Use technology efficiently
- ✅ Manage multiple assignments
- ✅ Have a simple, no-nonsense tool

---

**Made with ❤️ for students managing their academic life.**

*Remember: The best task manager is the one you actually use. Use Edumate consistently, and watch your productivity soar!* 🚀