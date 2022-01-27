Vue.createApp({
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
      if (!this.taskName) {
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
}).mount("#app");
