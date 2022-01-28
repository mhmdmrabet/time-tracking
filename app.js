const app = Vue.createApp({
  data() {
    return {
      title: "Time Tracking",
      logoSource: "https://cdn.svgporn.com/logos/vue.svg",
      tsFormatter: Intl.DateTimeFormat("fr", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      nowTime: null,
      intervalEverySecond: null,
      tasks: [],
      taskId: 0,
      taskName: "",
      isTaskInProgress: false,
      startTime: null,
      errorMsg: null,
    };
  },
  computed: {
    currentDuration() {
      if (this.startTime && this.nowTime) {
        return this.durationBetweenTimestamps(this.startTime, this.nowTime);
      } else {
        return "00:00:00";
      }
    },
  },
  watch: {
    isTaskInProgress(isInProgress) {
      if (isInProgress) {
        this.intervalEverySecond = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
      } else {
        clearInterval(this.intervalEverySecond);
      }
    },
  },
  methods: {
    // * START
    startTask() {
      // Verification
      if (!this.taskName || !this.taskName.trim()) {
        this.errorMsg = "Task name cannot be empty.";
        return;
      } else if (this.isTaskInProgress) {
        this.errorMsg = "A task is already in progress.";
        return;
      } else {
        this.errorMsg = null;
      }
      // Start task
      this.isTaskInProgress = true;
      this.startTime = Date.now();
      this.nowTime = Date.now();
    },
    // * STOP
    stopTask() {
      // Verification
      if (!this.isTaskInProgress) {
        this.errorMsg = "No task is in progress.";
        return;
      }

      // Saving the task
      this.tasks.unshift({
        id: this.getAnId(),
        name: this.taskName,
        start: this.startTime,
        end: Date.now(),
      });

      // End of task
      this.isTaskInProgress = false;
      this.nowTime = null;
      this.errorMsg = null;
      this.taskName = "";
    },
    // * TOGGLE TASK
    toggleTask() {
      if (this.isTaskInProgress) {
        this.stopTask();
      } else {
        this.startTask();
      }
    },
    // * DELETE TASK
    deleteTask(taskId) {
      let taskIndex = this.tasks.findIndex((element) => element.id === taskId);
      this.tasks.splice(taskIndex, 1);
    },
    // * ID
    getAnId() {
      this.taskId++;
      return this.taskId;
    },
    // * FORMAT Timestamp
    formatTimestamp(ts) {
      return this.tsFormatter.format(ts);
    },
    // * CALCUL DURATION
    durationBetweenTimestamps(start, end) {
      let seconds = Math.floor(end / 1000 - start / 1000);
      let minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    },
  },
});

app.component("task-actions", {
  template: `
    <button @click="sendDelete" type="button" class="hover:ease-in hover:duration-200 hover:text-rose-700 hover:bg-white p-3 rounded bg-rose-700 text-white">
      <svg height="15" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  `,
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  methods: {
    sendDelete() {
      this.$emit("delete", this.id);
    },
  },
});

app.mount("#app");
