// ===== Task Manager Class =====
class TaskManager {
    constructor() {
        this.tasks = this.loadFromStorage() || [];
        this.currentFilter = 'all';
        this.taskIdCounter = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        this.recognition = null;
        this.isListening = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.setupThemeToggle();
        this.render();
        this.setupReminders();
        this.requestMicrophonePermission();
    }

    // ===== Storage Management =====
    loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('edumate_tasks')) || [];
        } catch (e) {
            console.error('Error loading tasks:', e);
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('edumate_tasks', JSON.stringify(this.tasks));
        } catch (e) {
            console.error('Error saving tasks:', e);
        }
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');
        const filterBtns = document.querySelectorAll('.filter-btn');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    // ===== Theme Toggle =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('edumate_theme') || 'light';
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('edumate_theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
        });
    }

    // ===== Microphone Permission Request =====
    requestMicrophonePermission() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Stop the stream immediately - we just needed permission
                    stream.getTracks().forEach(track => track.stop());
                    console.log('Microphone permission granted');
                })
                .catch(error => {
                    console.log('Microphone permission denied:', error);
                    const voiceBtn = document.getElementById('voiceBtn');
                    voiceBtn.disabled = true;
                    voiceBtn.title = 'Microphone permission denied. Please enable it in browser settings.';
                });
        }
    }

    // ===== Speech Recognition =====
    setupSpeechRecognition() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const taskInput = document.getElementById('taskInput');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            voiceBtn.disabled = true;
            voiceBtn.title = 'Speech Recognition not supported in your browser';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        voiceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        this.recognition.onstart = () => {
            console.log('Speech recognition started');
            this.isListening = true;
            voiceBtn.classList.add('listening');
            voiceBtn.textContent = '🎤 Listening...';
            voiceStatus.textContent = '🔴 Recording...';
            voiceStatus.classList.add('active');
        };

        this.recognition.onresult = (event) => {
            let transcript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    isFinal = true;
                }
            }

            if (transcript.trim()) {
                taskInput.value = transcript.trim();
            }

            // Show interim results
            if (!isFinal) {
                voiceStatus.textContent = `🎙️ Transcribing: "${transcript.trim()}"`;
            }
        };

        this.recognition.onend = () => {
            console.log('Speech recognition ended');
            this.isListening = false;
            voiceBtn.classList.remove('listening');
            voiceBtn.textContent = '🎤 Voice';
            
            if (taskInput.value.trim()) {
                voiceStatus.textContent = '✅ Transcribed successfully!';
                voiceStatus.classList.remove('active');
                voiceStatus.classList.add('success');
            }
            
            setTimeout(() => {
                voiceStatus.textContent = '';
                voiceStatus.classList.remove('success');
            }, 3000);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            voiceBtn.classList.remove('listening');
            voiceBtn.textContent = '🎤 Voice';
            
            let errorMessage = event.error;
            if (event.error === 'no-speech') {
                errorMessage = 'No speech detected. Please try again.';
            } else if (event.error === 'network') {
                errorMessage = 'Network error. Check your connection.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Microphone permission denied.';
            }
            
            voiceStatus.textContent = `❌ Error: ${errorMessage}`;
            voiceStatus.classList.remove('active');
            
            setTimeout(() => {
                voiceStatus.textContent = '';
            }, 5000);
        };
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                const voiceStatus = document.getElementById('voiceStatus');
                voiceStatus.textContent = '❌ Error starting voice input';
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    // ===== Task Management =====
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const reminderTimeInput = document.getElementById('reminderTimeInput');
        const prioritySelect = document.getElementById('prioritySelect');

        const title = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const reminderTime = reminderTimeInput.value;
        const priority = prioritySelect.value;

        if (!title) {
            this.showNotification('Please enter a task', 'error');
            taskInput.focus();
            return;
        }

        if (!dueDate) {
            this.showNotification('Please set a due date', 'error');
            dueDateInput.focus();
            return;
        }

        const task = {
            id: this.taskIdCounter++,
            title,
            dueDate,
            reminderTime: reminderTime || '09:00',
            priority,
            status: 'pending',
            createdAt: new Date().toISOString(),
            reminderShown: false
        };

        this.tasks.push(task);
        this.saveToStorage();
        this.render();
        this.showNotification('Task added successfully! 🎉', 'success');

        // Clear inputs
        taskInput.value = '';
        dueDateInput.value = '';
        reminderTimeInput.value = '';
        prioritySelect.value = 'medium';
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const statuses = ['pending', 'in-progress', 'completed'];
            const currentIndex = statuses.indexOf(task.status);
            task.status = statuses[(currentIndex + 1) % statuses.length];
            this.saveToStorage();
            this.render();
            this.showNotification(`Task marked as ${task.status.replace('-', ' ')} ✅`, 'success');
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveToStorage();
        this.render();
        this.showNotification('Task deleted', 'warning');
    }

    // ===== Rendering =====
    render() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();

        // Update stats
        this.updateStats();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <p>📝 No ${this.currentFilter !== 'all' ? this.currentFilter.replace('-', ' ') : ''} tasks yet.</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.status}">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <span class="task-priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                </div>
                <div class="task-details">
                    <div class="task-detail-item">
                        <strong>📅 Due:</strong> ${this.formatDate(task.dueDate)}
                    </div>
                    <div class="task-detail-item">
                        <strong>⏰ Reminder:</strong> ${task.reminderTime}
                    </div>
                    <div class="task-detail-item">
                        <strong>📌 Status:</strong> ${task.status.replace('-', ' ').toUpperCase()}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-status" onclick="taskManager.updateTaskStatus(${task.id})">
                        ${this.getStatusButtonText(task.status)}
                    </button>
                    <button class="btn-delete" onclick="taskManager.deleteTask(${task.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        return this.tasks
            .filter(t => t.status === this.currentFilter)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    updateStats() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('inProgressCount').textContent = inProgress;
        document.getElementById('completedCount').textContent = completed;
    }

    getStatusButtonText(status) {
        const statusTexts = {
            'pending': '⏳ Start Task',
            'in-progress': '✅ Complete Task',
            'completed': '↩️ Reopen Task'
        };
        return statusTexts[status] || 'Update Status';
    }

    // ===== Reminders =====
    setupReminders() {
        // Check reminders every minute
        setInterval(() => {
            this.checkReminders();
        }, 60000);
        
        // Initial check
        this.checkReminders();
    }

    checkReminders() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = now.toISOString().split('T')[0];

        this.tasks.forEach(task => {
            if (task.status !== 'completed' && !task.reminderShown) {
                if (task.dueDate === today && task.reminderTime === currentTime) {
                    this.triggerReminder(task);
                    task.reminderShown = true;
                    this.saveToStorage();
                }
            }
        });
    }

    triggerReminder(task) {
        // Show notification
        this.showNotification(`🔔 Reminder: ${task.title} is due today at ${task.reminderTime}`, 'warning');
        
        // Browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Edumate Reminder', {
                body: `${task.title} is due today!`,
                icon: '📚'
            });
        }
        
        // Audio alert
        this.playAudio();
    }

    playAudio() {
        // Simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    // ===== Notifications =====
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ===== Utility Functions =====
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// ===== Request Notification Permission =====
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===== Initialize App =====
const taskManager = new TaskManager();